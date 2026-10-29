// ============================================================
//  Servidor do Poliglota
//  - Entrega os arquivos do site
//  - /api/tutor e /api/gerar: IA (Claude) para conversa e
//    lições sob medida. A chave fica só aqui no servidor
//    (variável de ambiente ANTHROPIC_API_KEY no Railway).
// ============================================================
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";

const PORT = process.env.PORT || 3000;
const RAIZ = path.dirname(fileURLToPath(import.meta.url));
// Padrão: Claude Haiku 5.5, o modelo mais barato. Para trocar, defina AI_MODEL no Railway (ex.: claude-opus-5-5).
const MODELO = process.env.AI_MODEL || "claude-haiku-5-5";
const LIMITE = Number(process.env.AI_LIMITE || 60);          // pedidos por pessoa...
const JANELA_MS = 15 * 60 * 1000;                             // ...a cada 15 minutos
// Chaves criadas fora de um workspace precisam do ID do workspace em cada pedido
// (variável ANTHROPIC_WORKSPACE_ID no Railway). Chaves criadas dentro de um workspace não precisam.
const WORKSPACE = (process.env.ANTHROPIC_WORKSPACE_ID || "").trim();
const cliente = process.env.ANTHROPIC_API_KEY
  ? new Anthropic(WORKSPACE ? { defaultHeaders: { "anthropic-workspace-id": WORKSPACE } } : {})
  : null;

// Modelos que aceitam o "fallback" automático do servidor quando um pedido é recusado
const ACEITA_FALLBACK = new Set(["claude-fable-5-1", "claude-opus-5-5", "claude-opus-5", "claude-sonnet-5-5"]);

const IDIOMAS = { en: "English", es: "Spanish (Spain)", fr: "French", it: "Italian", de: "German" };
const NIVEIS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const CENARIOS = {
  restaurante: "a restaurant: the student is the customer, you are the waiter",
  aeroporto: "an airport: check-in, luggage and boarding gate; you are the airline agent",
  hotel: "a hotel reception: booking, room problems and city tips; you are the receptionist",
  entrevista: "a job interview: you are the interviewer, the student is the candidate",
  medico: "a doctor's appointment: you are the doctor, the student explains symptoms",
  compras: "a clothing store: sizes, prices and exchanges; you are the shop assistant",
  amigos: "a party where the student meets new people; you are a friendly guest",
};

// ---------- Arquivos estáticos ----------
const TIPOS = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon",
};
const PRIVADOS = new Set(["server.js", "package.json", "package-lock.json"]);

function servirArquivo(req, res) {
  let caminho;
  try { caminho = decodeURIComponent(new URL(req.url, "http://x").pathname); }
  catch { res.writeHead(400); return res.end("Requisição inválida"); }
  if (caminho === "/") caminho = "/index.html";
  const arquivo = path.join(RAIZ, path.normalize(caminho));
  const relativo = path.relative(RAIZ, arquivo);
  const primeiro = relativo.split(path.sep)[0];
  if (relativo.startsWith("..") || primeiro.startsWith(".") || primeiro === "node_modules" || PRIVADOS.has(relativo)) {
    res.writeHead(404); return res.end("Não encontrado");
  }
  fs.readFile(arquivo, (erro, dados) => {
    if (erro) { res.writeHead(404); return res.end("Não encontrado"); }
    res.writeHead(200, { "Content-Type": TIPOS[path.extname(arquivo)] || "application/octet-stream" });
    res.end(dados);
  });
}

// ---------- Utilidades da API ----------
function responderJSON(res, status, obj) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(obj));
}
function lerCorpo(req, limite = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let tamanho = 0;
    const partes = [];
    req.on("data", c => {
      tamanho += c.length;
      if (tamanho > limite) { reject(new Error("grande")); req.destroy(); return; }
      partes.push(c);
    });
    req.on("end", () => {
      try { resolve(JSON.parse(Buffer.concat(partes).toString("utf8") || "{}")); }
      catch { reject(new Error("json")); }
    });
    req.on("error", reject);
  });
}
// Limite de uso por pessoa (protege a conta da API contra abuso)
const usos = new Map();
function dentroDoLimite(req) {
  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
  const agora = Date.now();
  const u = usos.get(ip);
  if (!u || agora > u.reinicia) { usos.set(ip, { n: 1, reinicia: agora + JANELA_MS }); return true; }
  u.n++;
  return u.n <= LIMITE;
}
setInterval(() => { const agora = Date.now(); for (const [ip, u] of usos) if (agora > u.reinicia) usos.delete(ip); }, JANELA_MS).unref();

function validarBase(corpo) {
  const idioma = IDIOMAS[corpo.idioma] ? corpo.idioma : null;
  const nivel = NIVEIS.includes(corpo.nivel) ? corpo.nivel : "A1";
  return { idioma, nivel };
}

// Chamada ao Claude: devolve o texto da resposta (ou lança um erro com mensagem amigável)
async function perguntarClaude({ system, messages, effort, formato, maxTokens = 8000 }) {
  const params = {
    model: MODELO,
    max_tokens: maxTokens,
    system,
    messages,
    output_config: { effort, ...(formato ? { format: formato } : {}) },
  };
  let resposta;
  if (ACEITA_FALLBACK.has(MODELO)) {
    // Se o modelo recusar por segurança, a própria API tenta de novo com um modelo de reserva
    resposta = await cliente.beta.messages.create({ ...params, betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" });
  } else {
    resposta = await cliente.messages.create(params);
  }
  if (resposta.stop_reason === "refusal") {
    const erro = new Error("Não posso ajudar com esse assunto. Que tal outro tema?");
    erro.status = 422;
    throw erro;
  }
  return resposta.content.filter(b => b.type === "text").map(b => b.text).join("").trim();
}
function erroAmigavel(erro) {
  if (erro.status === 422) return [422, erro.message];
  // Mensagem original da Anthropic (ajuda a descobrir o motivo de um erro 400)
  const detalhe = String(erro?.error?.error?.message || erro?.message || "");
  if (/not scoped to a workspace|anthropic-workspace-id/i.test(detalhe)) return [500, "A chave da API foi criada fora de um workspace. Crie uma chave dentro de um workspace no console da Anthropic, ou coloque o ID do workspace na variável ANTHROPIC_WORKSPACE_ID no Railway."];
  if (/credit balance|billing|purchase credits/i.test(detalhe)) return [402, "A conta da Anthropic está sem créditos. Adicione créditos em console.anthropic.com, no menu Billing, e tente de novo em alguns minutos."];
  if (/model/i.test(detalhe) && /not found|does not exist|not available|access/i.test(detalhe)) return [502, `Sua conta da Anthropic não tem acesso ao modelo ${MODELO}. Troque a variável AI_MODEL no Railway. Detalhe: ${detalhe}`];
  if (erro instanceof Anthropic.RateLimitError) return [429, "A IA está muito ocupada agora. Tente de novo em alguns segundos."];
  if (erro instanceof Anthropic.AuthenticationError) return [500, "A chave da IA no servidor é inválida. Confira a variável ANTHROPIC_API_KEY no Railway."];
  if (erro instanceof Anthropic.PermissionDeniedError) return [500, "A chave da IA não tem permissão para isso. Confira a chave e o workspace no console da Anthropic."];
  if (erro instanceof Anthropic.APIConnectionError) return [502, "Não consegui falar com a IA. Verifique a conexão do servidor."];
  if (erro instanceof Anthropic.APIError) return [502, `A IA recusou o pedido (erro ${erro.status}): ${detalhe.slice(0, 300)}`];
  return [500, "Algo deu errado no servidor."];
}

// ---------- Tutor ----------
function promptTutor(idioma, nivel, modo, cenario) {
  const lingua = IDIOMAS[idioma];
  const base = `You are Kiko, a warm, encouraging and witty language tutor (a talking parrot) inside "Poliglota", a language-learning app for Brazilian Portuguese speakers.
The student is learning ${lingua} and is currently at CEFR level ${nivel}.`;
  const formatoCorrecao = `Formatting rules:
- Write your main reply in ${lingua}, using vocabulary and grammar suited to level ${nivel}; a little above their level is good (comprehensible input). Keep it to 1-4 short sentences.
- If the student's last message contains mistakes in ${lingua}, add a new line starting with "✏️" with the corrected sentence in **bold** and a one-sentence explanation in Brazilian Portuguese. If there were no mistakes, do not add this line.
- If the student writes in Portuguese, show how to say it in ${lingua} in **bold** on the ✏️ line, then continue.
- Optionally add a final line starting with "💡" with one useful word or expression in ${lingua} and its Portuguese translation.
- End the main reply with a question or prompt that keeps the conversation going.
- Plain text only. No headings, no lists, no emojis other than ✏️ and 💡. Use ** only for bold.`;
  if (modo === "duvidas") {
    return `${base}
The student will ask questions about ${lingua}: grammar, vocabulary, pronunciation, culture or differences between expressions.
Answer in Brazilian Portuguese, clearly and briefly (under 150 words), with 1-3 short examples in ${lingua} written in **bold**, each followed by its Portuguese translation.
Adapt the depth of the explanation to level ${nivel}. Plain text only, no headings. Use ** only for bold. If the question is not about languages, gently bring the conversation back to learning ${lingua}.`;
  }
  if (modo === "roleplay") {
    return `${base}
Role-play: you are in ${CENARIOS[cenario] || CENARIOS.restaurante}. Stay in character and move the scene forward naturally, one step at a time.
${formatoCorrecao}`;
  }
  return `${base}
Have a friendly free conversation. Show curiosity about the student's life, opinions and interests. Steer away from harmful or adult topics.
${formatoCorrecao}`;
}

async function rotaTutor(req, res) {
  const corpo = await lerCorpo(req);
  const { idioma, nivel } = validarBase(corpo);
  if (!idioma) return responderJSON(res, 400, { erro: "Idioma inválido." });
  const modo = ["conversa", "duvidas", "roleplay"].includes(corpo.modo) ? corpo.modo : "conversa";
  const cenario = CENARIOS[corpo.cenario] ? corpo.cenario : "restaurante";
  // Histórico limpo: só papéis válidos, textos curtos, alternando e começando pelo aluno
  let msgs = (Array.isArray(corpo.mensagens) ? corpo.mensagens : [])
    .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .map(m => ({ role: m.role, content: m.content.slice(0, 1500) }))
    .slice(-20);
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  if (!msgs.length || msgs[msgs.length - 1].role !== "user") return responderJSON(res, 400, { erro: "Mensagem vazia." });
  const texto = await perguntarClaude({ system: promptTutor(idioma, nivel, modo, cenario), messages: msgs, effort: "low" });
  responderJSON(res, 200, { texto });
}

// ---------- Lição sob medida ----------
const ESQUEMA_LICAO = {
  type: "object",
  properties: {
    titulo: { type: "string" },
    emoji: { type: "string" },
    palavras: { type: "array", items: { type: "object", properties: { pt: { type: "string" }, alvo: { type: "string" }, emoji: { type: "string" } }, required: ["pt", "alvo", "emoji"], additionalProperties: false } },
    frases: { type: "array", items: { type: "object", properties: { pt: { type: "string" }, alvo: { type: "string" } }, required: ["pt", "alvo"], additionalProperties: false } },
    texto: { type: "object", properties: { titulo: { type: "string" }, alvo: { type: "string" }, pt: { type: "string" } }, required: ["titulo", "alvo", "pt"], additionalProperties: false },
    glossario: { type: "array", items: { type: "object", properties: { palavra: { type: "string" }, traducao: { type: "string" } }, required: ["palavra", "traducao"], additionalProperties: false } },
    perguntas: { type: "array", items: { type: "object", properties: { pergunta: { type: "string" }, opcoes: { type: "array", items: { type: "string" } }, correta: { type: "integer" } }, required: ["pergunta", "opcoes", "correta"], additionalProperties: false } },
    dica: { type: "string" },
  },
  required: ["titulo", "emoji", "palavras", "frases", "texto", "glossario", "perguntas", "dica"],
  additionalProperties: false,
};
const TAMANHO_TEXTO = { A1: "40-60", A2: "60-90", B1: "90-130", B2: "130-170", C1: "170-220", C2: "200-250" };

async function rotaGerar(req, res) {
  const corpo = await lerCorpo(req);
  const { idioma, nivel } = validarBase(corpo);
  if (!idioma) return responderJSON(res, 400, { erro: "Idioma inválido." });
  const tema = String(corpo.tema || "").replace(/[\r\n<>]/g, " ").trim().slice(0, 80);
  if (!tema) return responderJSON(res, 400, { erro: "Escreva um tema." });
  const lingua = IDIOMAS[idioma];
  const system = `You write short, high-quality language lessons for Brazilian Portuguese speakers learning ${lingua}.
Everything must be accurate, natural (as a native speaker would really say it), correctly spelled with all accents, and family-friendly.
In German, capitalize nouns. Portuguese text must be Brazilian Portuguese.`;
  const pedido = `Create a lesson about the topic "${tema}" for CEFR level ${nivel} in ${lingua}.
- titulo: lesson title in Portuguese.
- emoji: one emoji for the topic.
- palavras: exactly 8 useful words or short expressions about the topic, appropriate for ${nivel}. pt = Portuguese, alvo = ${lingua}, emoji = one fitting emoji.
- frases: exactly 4 natural sentences at level ${nivel} that use some of those words (pt and alvo).
- texto: a reading text in ${lingua} at level ${nivel}, ${TAMANHO_TEXTO[nivel]} words, interesting and concrete. titulo in ${lingua}, alvo = the text, pt = full Portuguese translation.
- glossario: 6 to 10 words or expressions copied exactly as they appear in the text, with their Portuguese translation in context.
- perguntas: 3 comprehension questions in Portuguese about the text, each with exactly 3 options in Portuguese; correta = 0-based index of the right option. Vary the position of the right option.
- dica: one short grammar or usage tip in Portuguese related to the text (max 2 sentences).
If the topic is inappropriate for a family-friendly app, pick a related safe topic instead.`;
  const bruto = await perguntarClaude({
    system, messages: [{ role: "user", content: pedido }], effort: "medium", maxTokens: 16000,
    formato: { type: "json_schema", schema: ESQUEMA_LICAO },
  });
  let d;
  try { d = JSON.parse(bruto); } catch { return responderJSON(res, 502, { erro: "A IA respondeu num formato inesperado. Tente de novo." }); }
  // Validação: garante o formato que o site espera
  const s = v => String(v || "").trim();
  d.palavras = (d.palavras || []).map(w => ({ pt: s(w.pt), alvo: s(w.alvo), emoji: s(w.emoji) || "📝" })).filter(w => w.pt && w.alvo).slice(0, 10);
  d.frases = (d.frases || []).map(f => ({ pt: s(f.pt), alvo: s(f.alvo) })).filter(f => f.pt && f.alvo).slice(0, 6);
  d.glossario = (d.glossario || []).map(g => ({ palavra: s(g.palavra), traducao: s(g.traducao) })).filter(g => g.palavra).slice(0, 12);
  d.perguntas = (d.perguntas || []).filter(q => Array.isArray(q.opcoes) && q.opcoes.length >= 2 && Number.isInteger(q.correta) && q.correta >= 0 && q.correta < q.opcoes.length).slice(0, 5);
  if (d.palavras.length < 4 || d.frases.length < 2 || !d.texto || !s(d.texto.alvo)) {
    return responderJSON(res, 502, { erro: "A lição veio incompleta. Tente de novo." });
  }
  responderJSON(res, 200, d);
}

// ---------- Servidor ----------
http.createServer(async (req, res) => {
  const rota = req.url.split("?")[0];
  if (!rota.startsWith("/api/")) return servirArquivo(req, res);
  if (rota === "/api/status") return responderJSON(res, 200, { ia: !!cliente });
  if (req.method !== "POST") return responderJSON(res, 405, { erro: "Use POST." });
  if (!cliente) return responderJSON(res, 503, { erro: "A IA não está configurada no servidor (falta ANTHROPIC_API_KEY)." });
  if (!dentroDoLimite(req)) return responderJSON(res, 429, { erro: "Você usou bastante a IA. Espere alguns minutos e tente de novo." });
  try {
    if (rota === "/api/tutor") return await rotaTutor(req, res);
    if (rota === "/api/gerar") return await rotaGerar(req, res);
    responderJSON(res, 404, { erro: "Rota não encontrada." });
  } catch (erro) {
    if (erro.message === "grande" || erro.message === "json") return responderJSON(res, 400, { erro: "Pedido inválido." });
    console.error("Erro na IA:", erro.status || "", erro?.error?.error?.message || erro.message);
    const [status, msg] = erroAmigavel(erro);
    responderJSON(res, status, { erro: msg });
  }
}).listen(PORT, () => console.log(`Poliglota na porta ${PORT} · IA ${cliente ? "ligada (" + MODELO + ")" + (WORKSPACE ? " · workspace " + WORKSPACE : "") : "desligada"}`));
