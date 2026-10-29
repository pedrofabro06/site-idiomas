// ============================================================
//  Servidor do DrPolygo
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
import * as banco from "./servidor/banco.js";
import * as auth from "./servidor/auth.js";

const PORT = process.env.PORT || 3000;

// ---------- Planos (tudo ajustável por variáveis no Railway) ----------
const num = (v, padrao) => (v !== undefined && v !== "" && !isNaN(Number(v)) ? Number(v) : padrao);
const NOME_PLANO = process.env.NOME_PLANO || "Passaporte";
const LIMITES = {
  gratis: { tutor: num(process.env.LIMITE_GRATIS_TUTOR, 5), licao: num(process.env.LIMITE_GRATIS_LICOES, 1) },
  pro: { tutor: num(process.env.LIMITE_PRO_TUTOR, 150), licao: num(process.env.LIMITE_PRO_LICOES, 15) },
};
const LICOES_SEM_CONTA = num(process.env.LICOES_SEM_CONTA, 2);   // lições liberadas antes de pedir conta
const DIAS_POR_COMPRA = num(process.env.DIAS_POR_COMPRA, 31);    // 0 = vitalício
const CHECKOUT_URL = (process.env.CHECKOUT_URL || "").trim();    // link de pagamento (Kiwify, Hotmart, Mercado Pago...)
const PRECO_TEXTO = process.env.PRECO_TEXTO || "";               // ex.: "R$ 29,90 por mês"
const WEBHOOK_TOKEN = (process.env.WEBHOOK_TOKEN || "").trim();
const ADMINS = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
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
  if (relativo.startsWith("..") || primeiro.startsWith(".") || primeiro === "node_modules" || primeiro === "servidor" || PRIVADOS.has(relativo) || relativo.endsWith(".json") && relativo !== "manifest.json") {
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
// Personagens do laboratório do Doutor Polygo (o tutor fala como o mascote escolhido)
const PERSONAGENS = {
  kiko: "Kiko, a talking parrot who swallowed a dictionary and speaks 5 languages (sometimes mixes them when excited)",
  lumi: "Lumi, a living drop of polyglot ink that changes color with each language",
  tito: "Tito, a clever fox who memorizes words by sniffing books",
  bubu: "Bubu, a cuddly teddy bear who believes every mistake deserves a hug",
  mia: "Mia, a curious cat who woke up understanding French",
  pingo: "Pingo, a penguin mail carrier who travels between countries delivering words",
  bit: "Bit, a translator robot still learning to understand jokes",
  draco: "Draco, a brave dragon who guards the Vault of Difficult Words",
  luna: "Luna, a unicorn made of pure grammar whose horn glows at correct verbs",
  oto: "Oto, an octopus with one language in each tentacle",
};
function promptTutor(idioma, nivel, modo, cenario, mascote = "kiko") {
  const lingua = IDIOMAS[idioma];
  const base = `You are ${PERSONAGENS[mascote] || PERSONAGENS.kiko}. You are one of the creatures living in Doctor Polygo's flying polygon-shaped language laboratory, and you work as a warm, encouraging and witty language tutor inside "DrPolygo", a language-learning app for Brazilian Portuguese speakers.
Backstory (use lightly, only for flavor, never let it get in the way of teaching): Doctor Polygo's machine that taught every language in one second exploded, scattering the world's words; the student is his new Apprentice ("Aprendiz") helping recover them.
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
  const mascote = PERSONAGENS[corpo.mascote] ? corpo.mascote : "kiko";
  const texto = await perguntarClaude({ system: promptTutor(idioma, nivel, modo, cenario, mascote), messages: msgs, effort: "low" });
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

// ============================================================
//  Contas, planos e painel
// ============================================================
const contasLigadas = () => !!banco.bancoAtivo() && !!(auth.GOOGLE_CLIENT_ID || auth.APPLE_CLIENT_ID || auth.DEV_LOGIN);
const ehAdmin = u => !!u && !!u.email && ADMINS.includes(u.email.toLowerCase());

async function usuarioDaSessao(req) {
  if (!banco.bancoAtivo()) return null;
  const id = auth.lerSessao(req);
  return id ? await banco.usuarioPorId(id) : null;
}
function publico(u) {
  return { id: u.id, email: u.email, nome: u.nome, foto: u.foto, plano: banco.planoEfetivo(u), proAte: u.pro_ate, admin: ehAdmin(u), novo: !!u.novo };
}
async function rotaEu(req, res) {
  const u = await usuarioDaSessao(req);
  if (!u) return responderJSON(res, 200, { usuario: null });
  const plano = banco.planoEfetivo(u);
  responderJSON(res, 200, { usuario: publico(u), uso: await banco.usoHoje(u.id), limites: LIMITES[plano] });
}
function rotaConfig(req, res) {
  responderJSON(res, 200, {
    ia: !!cliente,
    contas: contasLigadas(),
    google: auth.GOOGLE_CLIENT_ID || null,
    apple: auth.APPLE_CLIENT_ID ? { clientId: auth.APPLE_CLIENT_ID, redirectURI: auth.APPLE_REDIRECT_URI || null } : null,
    dev: auth.DEV_LOGIN,
    licoesSemConta: LICOES_SEM_CONTA,
    nomePlano: NOME_PLANO, preco: PRECO_TEXTO, checkout: CHECKOUT_URL || null,
    limites: LIMITES,
  });
}
async function concluirLogin(req, res, dadosProvedor, corpo) {
  const perfil = corpo.perfil && typeof corpo.perfil === "object" ? corpo.perfil : {};
  const u = await banco.entrarComProvedor({ ...dadosProvedor, perfil });
  if (corpo.anon) await banco.vincularQuestionarios(String(corpo.anon).slice(0, 64), u.id);
  if (u.novo && Object.keys(perfil).length) await banco.atualizarUsuario(u.id, { perfil });
  auth.criarSessao(res, req, u.id);
  responderJSON(res, 200, { usuario: publico(u), uso: await banco.usoHoje(u.id), limites: LIMITES[banco.planoEfetivo(u)] });
}
async function rotaLogin(req, res, provedor) {
  const corpo = await lerCorpo(req);
  let dados;
  try {
    if (provedor === "google") dados = { provedor, ...(await auth.verificarGoogle(String(corpo.credential || ""))) };
    else if (provedor === "apple") {
      const a = await auth.verificarApple(String(corpo.id_token || ""));
      dados = { provedor, ...a, nome: typeof corpo.nome === "string" ? corpo.nome.slice(0, 80) : null };
    } else if (provedor === "dev" && auth.DEV_LOGIN) {
      const email = String(corpo.email || "teste@exemplo.com").slice(0, 120);
      dados = { provedor: "google", sub: "dev-" + email, email, nome: String(corpo.nome || "Teste").slice(0, 80), foto: null };
    } else return responderJSON(res, 404, { erro: "Login indisponível." });
  } catch (erro) {
    console.error("Login recusado:", erro.message);
    return responderJSON(res, 401, { erro: "Não consegui confirmar seu login. Tente de novo." });
  }
  await concluirLogin(req, res, dados, corpo);
}

// Webhook de pagamento: Kiwify, Hotmart, Mercado Pago, Eduzz... cada um manda um formato.
// Procuramos o e-mail do comprador e o tipo do evento de forma flexível e guardamos tudo no painel.
function acharEmail(obj) {
  const achados = [];
  const visitar = (o, caminho) => {
    if (!o || typeof o !== "object") return;
    for (const [k, v] of Object.entries(o)) {
      const c = caminho + "." + k.toLowerCase();
      if (typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) achados.push({ c, v: v.trim() });
      else if (typeof v === "object") visitar(v, c);
    }
  };
  visitar(obj, "");
  const preferido = achados.find(a => /buyer|customer|cliente|comprador|payer|subscriber/.test(a.c)) || achados.find(a => a.c.endsWith(".email")) || achados[0];
  return preferido ? preferido.v.toLowerCase() : null;
}
function classificarEvento(obj) {
  const valores = [];
  const visitar = (o, nivel) => {
    if (!o || typeof o !== "object" || nivel > 3) return;
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === "string" && /^(event|evento|status|order_status|webhook_event_type|type|action|purchase_status)$/i.test(k)) valores.push(v.toLowerCase());
      else if (typeof v === "object") visitar(v, nivel + 1);
    }
  };
  visitar(obj, 0);
  const texto = valores.join(" ");
  if (/refund|reembols|chargeback|charged_back|cancel|expired|dispute|protest|estorn/.test(texto)) return { acao: "remover", evento: texto };
  if (/approved|aprovad|paid|pago|complete|active|renewed|order_approved|purchase_approved/.test(texto)) return { acao: "liberar", evento: texto };
  return { acao: "ignorar", evento: texto || "desconhecido" };
}
async function rotaWebhook(req, res) {
  const url = new URL(req.url, "http://x");
  const token = url.searchParams.get("token") || req.headers["x-hotmart-hottok"] || "";
  if (!WEBHOOK_TOKEN || token !== WEBHOOK_TOKEN) return responderJSON(res, 401, { erro: "token inválido" });
  const corpo = await lerCorpo(req, 256 * 1024);
  const email = acharEmail(corpo);
  const { acao, evento } = classificarEvento(corpo);
  let resultado = acao;
  if (email && acao === "liberar") { const r = await banco.liberarPlano(email, DIAS_POR_COMPRA); resultado = r.pendente ? "liberado (aguardando a pessoa criar a conta)" : "liberado"; }
  if (email && acao === "remover") { await banco.removerPlano(email); resultado = "removido"; }
  await banco.registrarPagamento({ email, origem: url.searchParams.get("origem") || "webhook", evento: evento.slice(0, 200), acao: email ? resultado : "sem e-mail no aviso", dados: corpo });
  responderJSON(res, 200, { ok: true, email, acao: resultado });
}

async function rotaAdmin(req, res, rota) {
  const u = await usuarioDaSessao(req);
  if (!ehAdmin(u)) return responderJSON(res, 403, { erro: "Só para administradores." });
  if (rota === "/api/admin/resumo") return responderJSON(res, 200, await banco.resumo());
  if (rota === "/api/admin/usuarios") return responderJSON(res, 200, await banco.listarUsuarios(new URL(req.url, "http://x").searchParams.get("busca") || ""));
  if (rota === "/api/admin/pagamentos") return responderJSON(res, 200, await banco.listarPagamentos());
  if (rota === "/api/admin/plano" && req.method === "POST") {
    const corpo = await lerCorpo(req);
    const email = String(corpo.email || "").trim().toLowerCase();
    if (!email) return responderJSON(res, 400, { erro: "Informe o e-mail." });
    if (corpo.remover) await banco.removerPlano(email);
    else await banco.liberarPlano(email, num(corpo.dias, 31));
    await banco.registrarPagamento({ email, origem: "painel", evento: corpo.remover ? "remoção manual" : `liberação manual (${corpo.dias} dias)`, acao: corpo.remover ? "removido" : "liberado", dados: { por: u.email } });
    return responderJSON(res, 200, { ok: true });
  }
  responderJSON(res, 404, { erro: "Rota não encontrada." });
}

// ============================================================
//  Servidor
// ============================================================
async function tratar(req, res) {
  // Quem entra por www.drpolygo.com vai para drpolygo.com (um endereço só, melhor para o Google e para o login)
  const host = String(req.headers.host || "").toLowerCase();
  if (host.startsWith("www.")) {
    res.writeHead(301, { Location: "https://" + host.slice(4) + req.url });
    return res.end();
  }
  const rota = req.url.split("?")[0];
  if (!rota.startsWith("/api/")) return servirArquivo(req, res);
  try {
    if (rota === "/api/status") return responderJSON(res, 200, { ia: !!cliente });
    if (rota === "/api/config") return rotaConfig(req, res);
    if (rota === "/api/eu") return await rotaEu(req, res);
    if (rota.startsWith("/api/admin/")) return await rotaAdmin(req, res, rota);
    if (req.method !== "POST" && !(rota === "/api/progresso" && ["GET", "PUT"].includes(req.method))) return responderJSON(res, 405, { erro: "Método não permitido." });
    if (rota === "/api/webhook/pagamento") return await rotaWebhook(req, res);
    if (rota === "/api/auth/google") return await rotaLogin(req, res, "google");
    if (rota === "/api/auth/apple") return await rotaLogin(req, res, "apple");
    if (rota === "/api/auth/dev") return await rotaLogin(req, res, "dev");
    if (rota === "/api/auth/sair") { auth.encerrarSessao(res); return responderJSON(res, 200, { ok: true }); }

    if (rota === "/api/questionario") {
      if (!banco.bancoAtivo()) return responderJSON(res, 200, { ok: true });
      if (!dentroDoLimite(req)) return responderJSON(res, 429, { erro: "Muitos pedidos." });
      const corpo = await lerCorpo(req);
      const r = corpo.respostas && typeof corpo.respostas === "object" ? corpo.respostas : {};
      const limpo = Object.fromEntries(Object.entries(r).slice(0, 20).map(([k, v]) => [String(k).slice(0, 40), String(v).slice(0, 120)]));
      const u = await usuarioDaSessao(req);
      await banco.salvarQuestionario(String(corpo.anon || "").slice(0, 64), limpo, u ? u.id : null);
      return responderJSON(res, 200, { ok: true });
    }

    if (rota === "/api/progresso") {
      const u = await usuarioDaSessao(req);
      if (!u) return responderJSON(res, 401, { erro: "Entre na sua conta." });
      if (req.method === "GET") return responderJSON(res, 200, (await banco.lerProgresso(u.id)) || { estado: null });
      const corpo = await lerCorpo(req, 900 * 1024);
      if (!corpo.estado || typeof corpo.estado !== "object") return responderJSON(res, 400, { erro: "Progresso inválido." });
      await banco.salvarProgresso(u.id, corpo.estado);
      return responderJSON(res, 200, { ok: true });
    }

    if (rota === "/api/tutor" || rota === "/api/gerar") {
      if (!cliente) return responderJSON(res, 503, { erro: "A IA não está configurada no servidor (falta ANTHROPIC_API_KEY)." });
      if (!dentroDoLimite(req)) return responderJSON(res, 429, { erro: "Muitos pedidos seguidos. Espere alguns minutos e tente de novo." });
      const tipo = rota === "/api/tutor" ? "tutor" : "licao";
      let u = null;
      if (contasLigadas()) {
        // Com contas ligadas, a IA exige login e respeita o limite diário do plano
        u = await usuarioDaSessao(req);
        if (!u) return responderJSON(res, 401, { erro: "Entre na sua conta para usar a IA.", codigo: "login" });
        const plano = banco.planoEfetivo(u);
        const usados = (await banco.usoHoje(u.id))[tipo] || 0;
        if (usados >= LIMITES[plano][tipo]) {
          return responderJSON(res, 402, { erro: plano === "pro" ? "Você atingiu o limite diário. Volta amanhã!" : `Você usou as ${LIMITES.gratis[tipo]} ${tipo === "tutor" ? "mensagens" : "lições"} grátis de hoje.`, codigo: "limite", plano });
        }
      }
      if (tipo === "tutor") await rotaTutor(req, res); else await rotaGerar(req, res);
      if (u && res.statusCode === 200) await banco.somarUso(u.id, tipo);
      return;
    }
    responderJSON(res, 404, { erro: "Rota não encontrada." });
  } catch (erro) {
    if (erro.message === "grande" || erro.message === "json") return responderJSON(res, 400, { erro: "Pedido inválido." });
    console.error("Erro:", erro.status || "", erro?.error?.error?.message || erro.message);
    const [status, msg] = erroAmigavel(erro);
    if (!res.headersSent) responderJSON(res, status, { erro: msg });
  }
}

const tipoBanco = await banco.iniciarBanco().catch(erro => { console.error("Banco de dados indisponível:", erro.message); return null; });
http.createServer(tratar).listen(PORT, () => {
  console.log(`DrPolygo na porta ${PORT} · IA ${cliente ? "ligada (" + MODELO + ")" + (WORKSPACE ? " · workspace " + WORKSPACE : "") : "desligada"}`);
  console.log(`Banco: ${tipoBanco || "desligado"} · Contas: ${contasLigadas() ? "ligadas" : "desligadas"}${auth.GOOGLE_CLIENT_ID ? " · Google" : ""}${auth.APPLE_CLIENT_ID ? " · Apple" : ""}${auth.DEV_LOGIN ? " · LOGIN DE TESTE ATIVO" : ""}`);
});
