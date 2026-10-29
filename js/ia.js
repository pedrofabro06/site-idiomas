// ============================================================
//  Inteligência artificial (Claude) — tutor de conversa e
//  lições sob medida sobre qualquer assunto, em qualquer nível.
//  O site chama o servidor (/api/...), e só o servidor conhece
//  a chave da API.
// ============================================================
let iaDisponivel = null;
async function checarIA() {
  if (iaDisponivel !== null) return iaDisponivel;
  if (location.protocol === "file:") return (iaDisponivel = false);
  try {
    const r = await fetch("/api/status");
    iaDisponivel = !!(await r.json()).ia;
  } catch { iaDisponivel = false; }
  return iaDisponivel;
}
async function chamarIA(rota, corpo) {
  const r = await fetch("/api/" + rota, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corpo) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const erro = new Error(j.erro || "A IA não respondeu. Tente de novo.");
    erro.codigo = j.codigo || null;
    // Sem conta: pede login. Limite do dia: mostra o plano pago.
    if (j.codigo === "login") abrirLogin({ titulo: "Entre para usar a IA", texto: "A IA é gratuita para quem tem conta, com mensagens diárias. Leva 5 segundos." });
    if (j.codigo === "limite") { if (j.plano === "pro") toast("⏳", "Limite de hoje atingido", "Amanhã tem mais!"); else abrirPaywall(rota === "tutor" ? "tutor" : "licao"); }
    throw erro;
  }
  // Conta o uso localmente para mostrar quanto resta hoje
  if (logado()) { const tipo = rota === "tutor" ? "tutor" : "licao"; CONTA.uso[tipo] = (CONTA.uso[tipo] || 0) + 1; }
  return j;
}
function textoRestante(tipo) {
  const r = restanteIA(tipo);
  if (!r) return "";
  const nome = tipo === "tutor" ? (r.limite === 1 ? "mensagem" : "mensagens") : (r.limite === 1 ? "lição" : "lições");
  return `${ehPro() ? "🎫" : "🎟️"} ${r.resta} de ${r.limite} ${nome} hoje`;
}
const AVISO_SEM_IA = `<div class="aviso-ia"><b>🔌 A IA ainda não está ligada.</b>
  <p>Para ativar, o dono do site precisa colocar a chave da API da Anthropic no Railway, na variável <code>ANTHROPIC_API_KEY</code>. Enquanto isso, a trilha, a revisão, a pronúncia e o fliperama funcionam normalmente.</p></div>`;

// Texto simples com **negrito** e quebras de linha
function formatarIA(t) {
  return esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>");
}
// Parte da resposta que está no idioma estudado (antes da correção ✏️ ou da dica 💡)
const parteNoIdioma = t => t.split(/✏️|💡/)[0].replace(/\*\*/g, "").trim();

// ---------- Tutor ----------
const CENARIOS = [
  { id: "restaurante", nome: "🍽️ Restaurante", desc: "Você é o cliente; o tutor é o garçom." },
  { id: "aeroporto", nome: "✈️ Aeroporto", desc: "Check-in, bagagem e portão de embarque." },
  { id: "hotel", nome: "🏨 Hotel", desc: "Reserva, problemas no quarto e dicas da cidade." },
  { id: "entrevista", nome: "💼 Entrevista de emprego", desc: "O tutor é o entrevistador." },
  { id: "medico", nome: "🩺 Consulta médica", desc: "Explique sintomas para o médico." },
  { id: "compras", nome: "🛍️ Loja de roupas", desc: "Tamanhos, preços e trocas." },
  { id: "amigos", nome: "🎉 Conhecendo pessoas", desc: "Bate-papo numa festa." },
];
const MODOS_TUTOR = {
  conversa: { nome: "💬 Conversa livre", desc: "Converse sobre qualquer assunto. O tutor corrige seus erros." },
  duvidas: { nome: "❓ Tirar dúvidas", desc: "Pergunte sobre gramática, palavras e pronúncia, em português." },
  roleplay: { nome: "🎭 Simulação", desc: "Pratique uma situação real com o tutor fazendo um papel." },
};

function estadoChat() {
  E.chat[E.idioma] = E.chat[E.idioma] || { modo: "conversa", cenario: "restaurante", msgs: [] };
  return E.chat[E.idioma];
}
function saudacaoTutor(ch) {
  const idi = IDIOMAS[E.idioma];
  if (ch.modo === "duvidas") return `Oi! Sou o ${nomeMascote()}. Pode perguntar qualquer coisa sobre ${idi.nome}: gramática, uma palavra, como se pronuncia, diferenças entre expressões... Eu explico em português, com exemplos.`;
  if (ch.modo === "roleplay") {
    const c = CENARIOS.find(x => x.id === ch.cenario);
    return `🎭 Simulação: ${c.nome}. ${c.desc} Escreva (ou fale 🎤) a primeira frase em ${idi.nome}. Pode começar com algo simples!`;
  }
  return `${idi.ola}! Sou o ${nomeMascote()}, seu tutor de ${idi.nome}. Escreva ou fale comigo em ${idi.nome} do jeito que conseguir. Eu respondo no seu nível (${nivelAtual()}) e corrijo seus erros com explicação em português. Se travar, escreva em português que eu te ajudo a dizer.`;
}

async function telaTutor() {
  const ok = await checarIA();
  const ch = estadoChat();
  const idi = IDIOMAS[E.idioma];
  render(`
    <button class="voltar" id="tVoltar">← Praticar</button>
    <div class="chat">
      <div class="chat-topo">
        ${lumi("feliz", "mini")}
        <div><b>${nomeMascote()} · tutor de ${idi.nome}</b><small>Nível ${nivelAtual()} · ${MODOS_TUTOR[ch.modo].desc}</small>
          ${CONFIG.contas ? `<small class="restante" id="tRestante">${logado() ? textoRestante("tutor") : "🔑 Entre na sua conta para conversar"}</small>` : ""}</div>
        <button class="btn texto pequeno" id="tLimpar" title="Nova conversa">🗑️ <span class="so-desktop">Nova conversa</span></button>
      </div>
      <div class="chips" id="tModos">${Object.entries(MODOS_TUTOR).map(([k, m]) => `<button class="chip ${ch.modo === k ? "on" : ""}" data-modo="${k}">${m.nome}</button>`).join("")}</div>
      ${ch.modo === "roleplay" ? `<div class="chips">${CENARIOS.map(c => `<button class="chip pequeno ${ch.cenario === c.id ? "on" : ""}" data-cen="${c.id}">${c.nome}</button>`).join("")}</div>` : ""}
      ${ok ? "" : AVISO_SEM_IA}
      <div class="chat-msgs" id="tMsgs"></div>
      <form class="chat-entrada" id="tForm">
        <button type="button" class="som-btn" id="tMic" title="Falar">🎤</button>
        <input class="campo" id="tTexto" autocomplete="off" maxlength="600" placeholder="${ch.modo === "duvidas" ? "Sua dúvida..." : "Escreva em " + idi.nome + "..."}" ${ok ? "" : "disabled"}>
        <button class="btn" id="tEnviar" ${ok ? "" : "disabled"}>Enviar</button>
      </form>
      <div id="tTeclado"></div>
    </div>`);
  $("#tVoltar").onclick = () => ir("praticar");
  const caixa = $("#tMsgs"), input = $("#tTexto");
  const tec = tecladoEspecial(input);
  if (tec) $("#tTeclado").appendChild(tec);

  function bolha(papel, texto, animar = false) {
    const b = el(`<div class="msg ${papel} ${animar ? "entra" : ""}">${papel === "assistant" ? lumi("feliz", "mini") : `<span class="msg-avatar">${E.avatar}</span>`}
      <div class="msg-balao">${formatarIA(texto)}</div></div>`);
    if (papel === "assistant") {
      const acoes = el(`<div class="msg-acoes"></div>`);
      const alvoTxt = parteNoIdioma(texto);
      const bs = el(`<button class="mini-btn">🔊 Ouvir</button>`);
      bs.onclick = () => falar(alvoTxt);
      acoes.appendChild(bs);
      if (Reconhecimento && ch.modo !== "duvidas" && alvoTxt.length < 200) {
        const bp = el(`<button class="mini-btn">🎤 Repetir</button>`);
        bp.onclick = () => abrirPronuncia(alvoTxt);
        acoes.appendChild(bp);
      }
      $(".msg-balao", b).appendChild(acoes);
    }
    caixa.appendChild(b);
    caixa.scrollTop = caixa.scrollHeight;
    return b;
  }
  bolha("assistant", saudacaoTutor(ch));
  ch.msgs.forEach(m => bolha(m.role, m.content));

  $$("[data-modo]").forEach(b => b.onclick = () => { ch.modo = b.dataset.modo; ch.msgs = []; salvar(); telaTutor(); });
  $$("[data-cen]").forEach(b => b.onclick = () => { ch.cenario = b.dataset.cen; ch.msgs = []; salvar(); telaTutor(); });
  $("#tLimpar").onclick = () => { ch.msgs = []; salvar(); telaTutor(); };
  $("#tMic").onclick = async () => {
    const mic = $("#tMic");
    mic.classList.add("ouvindo");
    try { const alts = await ouvirFala(); input.value = alts[0]; input.focus(); }
    catch (e) { toast("🎤", "Microfone", MSG_ERRO_FALA[e] || "Não consegui ouvir."); }
    finally { mic.classList.remove("ouvindo"); }
  };
  $("#tForm").onsubmit = async e => {
    e.preventDefault();
    const texto = input.value.trim();
    if (!texto || !ok) return;
    if (CONFIG.contas && !logado()) return abrirLogin({ titulo: "Entre para conversar com a IA", texto: "O tutor é gratuito para quem tem conta, com mensagens diárias." });
    input.value = "";
    ch.msgs.push({ role: "user", content: texto });
    bolha("user", texto, true);
    const pensando = el(`<div class="msg assistant pensando">${lumi("uau", "mini")}<div class="msg-balao"><span class="pontinhos"><i></i><i></i><i></i></span></div></div>`);
    caixa.appendChild(pensando);
    caixa.scrollTop = caixa.scrollHeight;
    $("#tEnviar").disabled = true;
    try {
      const r = await chamarIA("tutor", { idioma: E.idioma, nivel: nivelAtual(), modo: ch.modo, cenario: ch.cenario, mascote: E.mascote, mensagens: ch.msgs.slice(-20) });
      pensando.remove();
      ch.msgs.push({ role: "assistant", content: r.texto });
      if (ch.msgs.length > 40) ch.msgs.splice(0, ch.msgs.length - 40);
      bolha("assistant", r.texto, true);
      if (ch.modo !== "duvidas") falar(parteNoIdioma(r.texto));
      ganharXP(2);
      const rest = $("#tRestante");
      if (rest) rest.textContent = textoRestante("tutor");
    } catch (erro) {
      pensando.remove();
      ch.msgs.pop();
      // Login e limite já abrem a janela certa; os outros erros aparecem no chat
      if (erro.codigo) { const ult = [...caixa.querySelectorAll(".msg.user")].pop(); if (ult) ult.remove(); input.value = texto; }
      else bolha("assistant", "⚠️ " + erro.message);
    } finally {
      salvar();
      const be = $("#tEnviar");
      if (be) be.disabled = false;
      input.focus();
    }
  };
  setTimeout(() => input.focus(), 100);
}

// ---------- Lições sob medida ----------
const SUGESTOES_TEMA = ["futebol", "entrevista de emprego", "culinária", "viagem para a praia", "séries e filmes", "tecnologia", "academia", "música", "pedir um café", "reunião de trabalho", "natureza", "história"];

async function telaLicaoIA() {
  const ok = await checarIA();
  const salvas = E.licoesIA[E.idioma] || [];
  const nivel = nivelAtual();
  render(`
    <button class="voltar" id="lVoltar">← Praticar</button>
    <section class="secao-topo">
      <div><span class="selo">✨ Lição sob medida</span>
      <h1>Aprenda sobre <span class="destaque">qualquer assunto</span></h1>
      <p class="sub">Diga um tema e o nível. A IA cria um texto para ler no seu nível, com vocabulário, perguntas de compreensão e exercícios. É o <b>input compreensível</b>: ler um pouco acima do que você já sabe.</p></div>
      ${lumi("festa", "media flutua")}
    </section>
    ${ok ? "" : AVISO_SEM_IA}
    <form class="cartao-p form-ia" id="lForm">
      <label><b>Tema</b><input class="campo" id="lTema" maxlength="80" placeholder="Ex.: futebol, culinária italiana, entrevista de emprego..." ${ok ? "" : "disabled"}></label>
      <div class="chips">${SUGESTOES_TEMA.map(s => `<button type="button" class="chip pequeno" data-sug="${esc(s)}">${esc(s)}</button>`).join("")}</div>
      <label><b>Nível</b>
        <div class="segmentado" id="lNivel">${ORDEM_NIVEIS.map(n => `<button type="button" class="${n === nivel ? "on" : ""}" data-v="${n}">${n}</button>`).join("")}</div>
      </label>
      <button class="btn grande" id="lGerar" ${ok ? "" : "disabled"}>✨ Criar minha lição</button>
      ${CONFIG.contas ? `<small class="restante centro">${logado() ? textoRestante("licao") : "🔑 Entre na sua conta para criar lições"}${logado() && !ehPro() ? ` · <a href="#planos">mais com o ${NOME_PLANO()}</a>` : ""}</small>` : ""}
    </form>
    ${salvas.length ? `<h2>Suas lições criadas</h2><div class="grade-ia">${salvas.map((l, i) => `
      <button class="card-ia" data-l="${i}"><span>${esc(l.dados.emoji || "✨")}</span><b>${esc(l.dados.titulo)}</b><small>${l.nivel} · ${esc(l.tema)}</small></button>`).join("")}</div>` : ""}`);
  $("#lVoltar").onclick = () => ir("praticar");
  let nivelEscolhido = nivel;
  $$("#lNivel button").forEach(b => b.onclick = () => { nivelEscolhido = b.dataset.v; $$("#lNivel button").forEach(x => x.classList.toggle("on", x === b)); });
  $$("[data-sug]").forEach(b => b.onclick = () => { $("#lTema").value = b.dataset.sug; });
  $$("[data-l]").forEach(b => b.onclick = () => mostrarLicaoIA(salvas[+b.dataset.l]));
  $("#lForm").onsubmit = async e => {
    e.preventDefault();
    const tema = $("#lTema").value.trim();
    if (!tema || !ok) return tremer($("#lTema"));
    if (CONFIG.contas && !logado()) return abrirLogin({ titulo: "Entre para criar lições com IA", texto: "Quem tem conta grátis cria lições sob medida todo dia." });
    const carregando = abrirModal(`<div class="centro">${lumi("uau", "media flutua")}</div><h2>Criando sua lição...</h2>
      <p class="sub">O ${nomeMascote()} está escrevendo um texto sobre <b>${esc(tema)}</b> no nível ${nivelEscolhido}. Leva uns segundos.</p>
      <div class="barra"><div class="carregando"></div></div>`);
    try {
      const dados = await chamarIA("gerar", { idioma: E.idioma, nivel: nivelEscolhido, tema });
      const licao = { id: "ia-" + Date.now(), tema, nivel: nivelEscolhido, criado: hoje(), dados };
      E.licoesIA[E.idioma] = [licao, ...salvas].slice(0, 12);
      salvar();
      carregando.fechar();
      mostrarLicaoIA(licao);
    } catch (erro) {
      carregando.fechar();
      if (!erro.codigo) toast("⚠️", "Não deu certo", erro.message);
    }
  };
}

// Converte a lição da IA para o formato que o motor de exercícios entende
function temaDaLicaoIA(licao) {
  const col = IDIOMAS[E.idioma].col;
  const linha = (pt, a, e = "📝") => { const p = ["", "", "", "", "", "", e]; p[0] = pt; p[col] = a; return p; };
  return {
    id: licao.id, titulo: licao.dados.titulo, icone: licao.dados.emoji || "✨", imagens: false, nivel: licao.nivel, ia: true,
    palavras: licao.dados.palavras.map(w => linha(w.pt, w.alvo, w.emoji)),
    frases: licao.dados.frases.map(f => linha(f.pt, f.alvo)),
  };
}

function mostrarLicaoIA(licao) {
  const d = licao.dados;
  // Marca no texto as palavras/expressões do glossário (as mais longas primeiro).
  // Usa marcadores temporários para nunca mexer dentro do HTML gerado.
  const termos = [...d.glossario].sort((a, b) => b.palavra.length - a.palavra.length);
  const marcas = [];
  let bruto = d.texto.alvo;
  termos.forEach((g, i) => {
    const re = new RegExp("(^|[^\\p{L}])(" + g.palavra.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")(?=[^\\p{L}]|$)", "iu");
    bruto = bruto.replace(re, (m, antes, termo) => { marcas.push({ i, termo }); return antes + "\u0001" + (marcas.length - 1) + "\u0002"; });
  });
  const html = esc(bruto).replace(/\u0001(\d+)\u0002/g, (m, k) => `<span class="glossa" data-g="${marcas[k].i}">${esc(marcas[k].termo)}</span>`);
  render(`
    <button class="voltar" id="mVoltar">← Lições sob medida</button>
    <article class="leitura">
      <span class="selo">${esc(d.emoji || "✨")} ${licao.nivel} · ${esc(licao.tema)}</span>
      <h1>${esc(d.titulo)}</h1>
      <div class="cartao-p">
        <div class="leitura-topo"><h3>${esc(d.texto.titulo)}</h3>
          <div><button class="btn secundario pequeno" id="mOuvir">🔊 Ouvir texto</button>
          <button class="btn secundario pequeno" id="mLento">🐢 Devagar</button></div></div>
        <p class="texto-leitura" id="mTexto">${html}</p>
        <p class="sub pequena">Toque nas palavras <span class="glossa exemplo">destacadas</span> para ver a tradução.</p>
        <details class="traducao-completa"><summary>Ver tradução completa</summary><p>${esc(d.texto.pt)}</p></details>
      </div>
      ${d.dica ? `<div class="dica-gramatica">💡 <span>${esc(d.dica)}</span></div>` : ""}
      <h2>Entendeu o texto?</h2>
      <div class="perguntas">${d.perguntas.map((q, i) => `
        <div class="pergunta-ia" data-q="${i}"><b>${i + 1}. ${esc(q.pergunta)}</b>
          <div class="opcoes-lista">${q.opcoes.map((o, j) => `<button class="escolha" data-o="${j}"><span class="tecla">${j + 1}</span>${esc(o)}</button>`).join("")}</div>
        </div>`).join("")}</div>
      <h2>Vocabulário</h2>
      <div class="vocab-lista">${d.palavras.map((w, i) => `
        <div class="vocab-item"><span class="vi-emoji">${esc(w.emoji)}</span><span class="vi-txt"><b>${esc(w.alvo)}</b><small>${esc(w.pt)}</small></span>
        <button class="som-btn" data-w="${i}">🔊</button><button class="som-btn mic-btn" data-wp="${i}">🎤</button></div>`).join("")}</div>
      <div class="acoes"><button class="btn grande" id="mPraticar">🎯 Praticar estas palavras · +XP</button></div>
    </article>`);
  $("#mVoltar").onclick = () => telaLicaoIA();
  $("#mOuvir").onclick = () => falar(d.texto.alvo);
  $("#mLento").onclick = () => falar(d.texto.alvo, true);
  $$(".glossa[data-g]").forEach(s => s.onclick = () => {
    const g = termos[+s.dataset.g];
    falar(g.palavra);
    $$(".glossa-pop").forEach(p => p.remove());
    const pop = el(`<span class="glossa-pop">${esc(g.traducao)}</span>`);
    s.appendChild(pop);
    setTimeout(() => pop.remove(), 2600);
  });
  $$(".pergunta-ia").forEach(box => {
    const q = d.perguntas[+box.dataset.q];
    $$(".escolha", box).forEach(b => b.onclick = () => {
      if (box.classList.contains("respondida")) return;
      box.classList.add("respondida");
      const j = +b.dataset.o;
      $$(".escolha", box)[q.correta].classList.add("certa");
      if (j !== q.correta) { b.classList.add("errada"); som("errado"); } else { som("certo"); ganharXP(2); }
    });
  });
  $$("[data-w]").forEach(b => b.onclick = () => falar(d.palavras[+b.dataset.w].alvo));
  $$("[data-wp]").forEach(b => b.onclick = () => { const w = d.palavras[+b.dataset.wp]; abrirPronuncia(w.alvo, w.pt); });
  $("#mPraticar").onclick = () => iniciarLicao({ tema: temaDaLicaoIA(licao), nivel: 2, ia: true });
}
