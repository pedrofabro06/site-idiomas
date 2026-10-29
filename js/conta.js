// ============================================================
//  Conta, planos e boas-vindas
//  - Questionário inicial (estilo Duolingo) + origem do anúncio (UTM)
//  - Login com Google / Apple, progresso salvo na nuvem
//  - Plano grátis x Passaporte (limites de IA, jogos exclusivos)
//  - Painel do administrador
// ============================================================
let CONFIG = { ia: false, contas: false, google: null, apple: null, dev: false, licoesSemConta: 2, nomePlano: "Passaporte", preco: "", checkout: null, limites: { gratis: { tutor: 5, licao: 1 }, pro: { tutor: 150, licao: 15 } } };
let CONTA = { usuario: null, uso: {}, limites: null };

async function carregarConfig() {
  if (location.protocol === "file:") return;
  try { CONFIG = Object.assign(CONFIG, await (await fetch("/api/config")).json()); } catch {}
}
async function carregarConta() {
  if (!CONFIG.contas) return;
  try { aplicarConta(await (await fetch("/api/eu")).json()); } catch {}
}
function aplicarConta(j) {
  CONTA.usuario = j.usuario || null;
  CONTA.uso = j.uso || {};
  CONTA.limites = j.limites || null;
  if (typeof atualizarTopo === "function") atualizarTopo();
}
const logado = () => !!CONTA.usuario;
// Sem contas configuradas no servidor, nada fica travado (o site funciona como antes)
const ehPro = () => !CONFIG.contas || (CONTA.usuario && CONTA.usuario.plano === "pro");
const precisaConta = () => CONFIG.contas && !logado() && (E.stats.licoes || 0) >= CONFIG.licoesSemConta;
const NOME_PLANO = () => CONFIG.nomePlano || "Passaporte";
function restanteIA(tipo) {
  if (!CONFIG.contas || !logado()) return null;
  const lim = (CONTA.limites || CONFIG.limites[ehPro() ? "pro" : "gratis"])[tipo];
  return { usados: CONTA.uso[tipo] || 0, limite: lim, resta: Math.max(0, lim - (CONTA.uso[tipo] || 0)) };
}

// ---------- Origem (anúncios) ----------
function capturarOrigem() {
  const p = new URLSearchParams(location.search);
  const utm = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref"].forEach(k => { if (p.get(k)) utm[k] = p.get(k).slice(0, 80); });
  let mudou = false;
  if (Object.keys(utm).length && !E.origemUtm) { E.origemUtm = utm; mudou = true; }
  if (!E.anon) { E.anon = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now(); mudou = true; }
  if (mudou) salvar();
}
function perfilParaServidor() {
  return Object.assign({}, E.onboarding || {}, E.origemUtm || {});
}

// ---------- Questionário de boas-vindas ----------
const PERGUNTAS = [
  { id: "idioma", fala: () => "Olá, Aprendiz! Eu sou o Doutor Polygo 🧪 Uma explosão no meu laboratório espalhou as palavras do mundo, e eu preciso de ajuda para recuperá-las. Vamos montar um plano só seu. Qual idioma você quer aprender?", idiomas: true },
  { id: "objetivo", fala: () => "Boa escolha! E por que você quer aprender?", opcoes: [
    ["viagem", "🧳", "Viajar", "Pedir comida, se virar no aeroporto, conhecer pessoas"],
    ["carreira", "💼", "Carreira e trabalho", "Reuniões, entrevistas, crescer na empresa"],
    ["estudos", "🎓", "Estudos ou intercâmbio", "Faculdade, cursos e morar fora"],
    ["cultura", "🎬", "Filmes, séries e música", "Entender sem legenda"],
    ["conversar", "💬", "Conversar com pessoas", "Amigos, família, relacionamento"],
    ["certificado", "📜", "Prova ou certificado", "Exames como TOEFL, IELTS, DELE"],
    ["cerebro", "🧠", "Exercitar o cérebro", "Aprender por diversão"],
  ] },
  { id: "nivel", fala: () => `Quanto você já sabe de ${E.idioma ? IDIOMAS[E.idioma].nome : "idioma"}?`, opcoes: [
    ["nada", "🌱", "Nunca estudei", "Começar do primeiro passo"],
    ["palavras", "🙂", "Sei algumas palavras", "Cumprimentos, números, coisas simples"],
    ["basico", "💬", "Consigo me virar", "Converso sobre assuntos do dia a dia"],
    ["avancado", "🚀", "Falo bem", "Quero me aperfeiçoar"],
  ] },
  { id: "tempo", fala: () => "Quanto tempo por dia você quer estudar? Dá para mudar depois.", opcoes: [
    ["5", "☕", "5 minutos por dia", "Casual · meta de 10 XP"],
    ["10", "🚶", "10 minutos por dia", "Regular · meta de 30 XP"],
    ["15", "🏃", "15 minutos por dia", "Sério · meta de 50 XP"],
    ["20", "🔥", "20 minutos ou mais", "Intenso · meta de 100 XP"],
  ] },
  { id: "origem", fala: () => "Última pergunta! Como você conheceu o DrPolygo?", compacto: true, opcoes: [
    ["instagram", iconeMarca("instagram"), "Instagram", ""], ["tiktok", iconeMarca("tiktok"), "TikTok", ""],
    ["youtube", iconeMarca("youtube"), "YouTube", ""], ["google", iconeMarca("google"), "Google", ""],
    ["facebook", iconeMarca("facebook"), "Facebook", ""], ["whatsapp", iconeMarca("whatsapp"), "WhatsApp", ""],
    ["x", iconeMarca("x"), "X (Twitter)", ""], ["amigo", "🗣️", "Indicação", ""],
    ["anuncio", "📢", "Anúncio", ""], ["outro", "✨", "Outro lugar", ""],
  ] },
];
// Nome e símbolo de cada origem (usado também no painel)
const ORIGENS = Object.fromEntries(PERGUNTAS.find(q => q.id === "origem").opcoes.map(([v, ic, rot]) => [v, { ic, rot }]));
const META_POR_TEMPO = { 5: 10, 10: 30, 15: 50, 20: 100 };

function telaBoasVindas() {
  document.body.classList.add("em-licao");
  const resp = Object.assign({}, E.onboardingRascunho || {});
  // Se veio de um anúncio, já sugere a origem
  const fonte = (E.origemUtm && E.origemUtm.utm_source || "").toLowerCase();
  if (fonte && !resp.origem) {
    const mapa = { ig: "instagram", instagram: "instagram", tiktok: "tiktok", youtube: "youtube", yt: "youtube", google: "google", facebook: "facebook", fb: "facebook", meta: "anuncio", whatsapp: "whatsapp", wa: "whatsapp", twitter: "x", x: "x" };
    resp.origem = mapa[fonte] || null;
  }
  let passo = 0;
  function mostrar() {
    const q = PERGUNTAS[passo];
    render(`
      <div class="boasvindas">
        <div class="licao-topo">
          <button class="fechar" id="bvVoltar" ${passo === 0 ? "style=\"visibility:hidden\"" : ""} title="Voltar">←</button>
          <div class="barra grossa"><div style="width:${(passo / PERGUNTAS.length) * 100}%"></div></div>
          ${passo === 0 && CONFIG.contas ? `<button class="btn texto pequeno" id="bvEntrar">Já tenho conta</button>` : `<span class="nivel-chip">${passo + 1}/${PERGUNTAS.length}</span>`}
        </div>
        <div class="bv-fala">${passo === 0 ? desenharDrPolygo("feliz", "media flutua") : lumi(passo === PERGUNTAS.length - 1 ? "festa" : "feliz", "media flutua")}<div class="balao">${q.fala()}</div></div>
        <div class="bv-opcoes ${q.idiomas ? "idiomas" : ""} ${q.compacto ? "compacto" : ""}" id="bvOpcoes">${q.idiomas
          ? Object.entries(IDIOMAS).map(([c, i]) => `<button class="bv-op ${resp.idioma === c ? "sel" : ""}" data-v="${c}" style="--k1:${i.tema.c1}">${svgBandeira(c, "bandeira bv-bandeira")}<b>${i.nome}</b><small>${i.nativo}</small></button>`).join("")
          : q.opcoes.map(([v, ic, rot, sub]) => `<button class="bv-op ${resp[q.id] === v ? "sel" : ""}" data-v="${v}"><span class="bv-ic">${ic}</span><span><b>${rot}</b>${sub ? `<small>${sub}</small>` : ""}</span></button>`).join("")}
        </div>
      </div>`);
    if (passo > 0) $("#bvVoltar").onclick = () => { passo--; mostrar(); };
    const be = $("#bvEntrar");
    if (be) be.onclick = () => abrirLogin({ titulo: "Entrar na sua conta", texto: "Seu progresso volta na hora." });
    $$(".bv-op").forEach(b => b.onclick = () => {
      resp[q.id] = b.dataset.v;
      E.onboardingRascunho = resp;
      if (q.id === "idioma") { E.idioma = b.dataset.v; aplicarTema(E.idioma); }
      salvar();
      som("clique");
      $$(".bv-op").forEach(x => x.classList.toggle("sel", x === b));
      setTimeout(() => { if (passo < PERGUNTAS.length - 1) { passo++; mostrar(); } else concluir(); }, 260);
    });
  }
  function concluir() {
    E.onboarding = Object.assign({}, resp, { data: hoje() });
    delete E.onboardingRascunho;
    E.meta = META_POR_TEMPO[resp.tempo] || 30;
    if (resp.nivel === "nada") E.nivelamento[E.idioma] = { nivel: null, zero: true, data: hoje() };
    salvar();
    if (CONFIG.contas || location.protocol !== "file:") {
      fetch("/api/questionario", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ anon: E.anon, respostas: perfilParaServidor() }) }).catch(() => {});
    }
    const obj = PERGUNTAS[1].opcoes.find(o => o[0] === resp.objetivo);
    const tempo = PERGUNTAS[3].opcoes.find(o => o[0] === resp.tempo);
    const comecaDoZero = resp.nivel === "nada";
    som("fim");
    confetes(90);
    render(`
      <div class="fim boasvindas-fim">
        <div class="dupla-fim">${desenharDrPolygo("festa", "grande pulando")}${lumi("festa", "media pulando")}</div>
        <h1><span class="destaque">Bem-vindo ao laboratório, Aprendiz!</span></h1>
        <p class="sub">Seu plano está pronto. O ${nomeMascote()} vai te acompanhar na missão.</p>
        <div class="plano-resumo">
          <div>${svgBandeira(E.idioma, "bandeira mini")}<b>${IDIOMAS[E.idioma].nome}</b></div>
          <div><span>${obj ? obj[1] : "🎯"}</span><b>${obj ? obj[2] : "Aprender"}</b></div>
          <div><span>⏱️</span><b>${tempo ? tempo[2] : "Todo dia"}</b></div>
        </div>
        <p class="sub">${comecaDoZero
          ? "Você vai começar do primeiro passo. Cada lição leva uns 3 minutos e o próprio site lembra o que revisar."
          : "Antes de começar, um teste rápido descobre seu nível. Sua trilha começa no ponto certo, sem perder tempo com o que você já sabe."}</p>
        <div class="acoes coluna" style="max-width:420px;margin:22px auto 0">
          <button class="btn grande" id="bvComecar">${comecaDoZero ? "▶ Começar minha primeira lição" : "📏 Fazer o teste de nível"}</button>
          <button class="btn texto" id="bvExplorar">Explorar o site primeiro</button>
        </div>
      </div>`);
    $("#bvComecar").onclick = () => {
      document.body.classList.remove("em-licao");
      if (comecaDoZero) { const p = proximaLicao(); if (p) return iniciarLicao({ tema: p.tema, nivel: p.nivel }); return ir("trilha"); }
      iniciarNivelamento();
    };
    $("#bvExplorar").onclick = () => { document.body.classList.remove("em-licao"); location.hash = "inicio"; mostrarRota(); };
  }
  mostrar();
}

// ---------- Login ----------
function carregarScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src; s.async = true; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}
function abrirLogin({ titulo = "Crie sua conta grátis", texto = "Salve seu progresso e continue de qualquer aparelho.", obrigatorio = false } = {}) {
  if (!CONFIG.contas) return;
  const m = abrirModal(`
    <div class="centro">${lumi("festa", "media")}</div>
    <h2>${titulo}</h2>
    <p class="sub">${texto}</p>
    <ul class="beneficios">
      <li>☁️ Progresso salvo na nuvem, no celular e no computador</li>
      <li>🔥 Sua ofensiva, moedas e mascotes nunca se perdem</li>
      <li>🤖 Acesso ao tutor com inteligência artificial</li>
    </ul>
    <div class="botoes-login">
      ${CONFIG.google ? `<div id="gBotao" class="g-botao"></div>` : ""}
      ${CONFIG.apple ? `<button class="btn-apple" id="aBotao"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9s-2-.9-3.4-.9c-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8s2 .8 3.4.8 2.2-1.3 3.1-2.5c1-1.4 1.4-2.8 1.4-2.9-.1 0-2.7-1-2.7-4.1zM13.9 5.1c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.1 1.1.1 2.3-.6 3-1.5z"/></svg> Continuar com Apple</button>` : ""}
      ${CONFIG.dev ? `<button class="btn secundario" id="devBotao">🧪 Login de teste</button>` : ""}
    </div>
    <p class="sub pequena">Ao continuar, você concorda com os <a href="/termos.html" target="_blank">Termos de uso</a> e a <a href="/privacidade.html" target="_blank">Política de privacidade</a>.</p>
    <button class="btn texto" data-fechar>${obrigatorio ? "Voltar ao início" : "Agora não"}</button>`,
    { aoFechar: () => { if (obrigatorio && !logado()) ir("inicio"); } });
  if (CONFIG.google) {
    carregarScript("https://accounts.google.com/gsi/client").then(() => {
      google.accounts.id.initialize({ client_id: CONFIG.google, callback: r => entrar("google", { credential: r.credential }, m), ux_mode: "popup" });
      google.accounts.id.renderButton($("#gBotao", m.el), { theme: "filled_blue", size: "large", text: "continue_with", shape: "pill", locale: "pt-BR", width: 280 });
    }).catch(() => { $("#gBotao", m.el).textContent = "Não consegui carregar o login do Google. Verifique sua conexão."; });
  }
  if (CONFIG.apple) {
    $("#aBotao", m.el).onclick = async () => {
      try {
        await carregarScript("https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/pt_BR/appleid.auth.js");
        AppleID.auth.init({ clientId: CONFIG.apple.clientId, scope: "name email", redirectURI: CONFIG.apple.redirectURI || location.origin + "/", usePopup: true });
        const r = await AppleID.auth.signIn();
        const n = r.user && r.user.name ? `${r.user.name.firstName || ""} ${r.user.name.lastName || ""}`.trim() : null;
        entrar("apple", { id_token: r.authorization.id_token, nome: n }, m);
      } catch (e) {
        if (!e || e.error !== "popup_closed_by_user") toast("⚠️", "Login com Apple", "Não deu certo. Tente de novo.");
      }
    };
  }
  if (CONFIG.dev) $("#devBotao", m.el).onclick = () => entrar("dev", { email: "teste@poliglota.dev", nome: "Pessoa de Teste" }, m);
  return m;
}
async function entrar(provedor, dados, modal) {
  try {
    const r = await fetch("/api/auth/" + provedor, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.assign({}, dados, { anon: E.anon, perfil: perfilParaServidor() })) });
    const j = await r.json();
    if (!r.ok) return toast("⚠️", "Não deu certo", j.erro || "Tente de novo.");
    aplicarConta(j);
    await sincronizarAoEntrar();
    if (modal) modal.fechar();
    const primeiroNome = (CONTA.usuario.nome || "").split(" ")[0];
    if (primeiroNome && (E.nome === "Você" || !E.nome)) { E.nome = primeiroNome; salvar(); }
    som("bau");
    confetes(60);
    toast("🎉", `${j.usuario.novo ? "Conta criada" : "Bem-vindo de volta"}${primeiroNome ? ", " + primeiroNome : ""}!`, "Seu progresso agora fica salvo na nuvem.");
    if (!E.onboarding) return telaBoasVindas();
    document.body.classList.remove("em-licao");
    mostrarRota();
  } catch {
    toast("⚠️", "Sem conexão", "Não consegui falar com o servidor.");
  }
}
async function sair() {
  if (!(await confirmar("Sair da conta?", "Seu progresso continua salvo na nuvem. É só entrar de novo.", "Sair", "Ficar"))) return;
  await enviarProgresso();
  await fetch("/api/auth/sair", { method: "POST" }).catch(() => {});
  const manter = { onboarding: E.onboarding, anon: E.anon, origemUtm: E.origemUtm, idioma: E.idioma };
  E = Object.assign(estadoPadrao(), manter);
  CONTA = { usuario: null, uso: {}, limites: null };
  salvar();
  location.hash = "inicio";
  location.reload();
}

// ---------- Progresso na nuvem ----------
async function sincronizarAoEntrar() {
  try {
    const r = await fetch("/api/progresso");
    if (!r.ok) return;
    const j = await r.json();
    const nuvem = j.estado;
    if (nuvem && (nuvem.xp || 0) >= (E.xp || 0)) {
      // A nuvem tem mais progresso: ela vale. Mantém a origem e o questionário deste aparelho se faltarem lá.
      E = Object.assign(estadoPadrao(), nuvem, {
        stats: Object.assign(estadoPadrao().stats, nuvem.stats),
        dia: Object.assign(estadoPadrao().dia, nuvem.dia),
        onboarding: nuvem.onboarding || E.onboarding, origemUtm: nuvem.origemUtm || E.origemUtm, anon: nuvem.anon || E.anon,
      });
      try { localStorage.setItem(CHAVE, JSON.stringify(E)); } catch {}
      garantirDia();
      aplicarTema();
      desenharMarca();
      atualizarTopo();
    } else {
      await enviarProgresso();
    }
  } catch {}
}
let timerSync = null;
function agendarSync() {
  if (!logado()) return;
  clearTimeout(timerSync);
  timerSync = setTimeout(enviarProgresso, 4000);
}
async function enviarProgresso() {
  if (!logado()) return;
  clearTimeout(timerSync);
  const corpo = JSON.stringify({ estado: E });
  try { await fetch("/api/progresso", { method: "PUT", headers: { "Content-Type": "application/json" }, body: corpo, keepalive: corpo.length < 60000 }); } catch {}
}
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") enviarProgresso(); });

// ---------- Planos ----------
function abrirPaywall(motivo = "") {
  const textos = {
    tutor: `Você usou suas ${CONFIG.limites.gratis.tutor} mensagens grátis do tutor hoje.`,
    licao: `Você usou sua lição sob medida grátis de hoje.`,
    jogos: "Este minijogo é exclusivo do " + NOME_PLANO() + ".",
  };
  const m = abrirModal(`
    <div class="selo-passaporte grande">🎫 ${NOME_PLANO()}</div>
    <h2>${textos[motivo] || "Desbloqueie tudo com o " + NOME_PLANO()}</h2>
    <p class="sub">Com o ${NOME_PLANO()} você conversa todo dia com o tutor de IA, cria lições sobre qualquer assunto e joga todos os minijogos.</p>
    <div class="acoes coluna">
      <button class="btn grande dourado" id="pwVer">Conhecer o ${NOME_PLANO()}</button>
      <button class="btn texto" data-fechar>${motivo === "tutor" || motivo === "licao" ? "Volto amanhã" : "Agora não"}</button>
    </div>`);
  $("#pwVer", m.el).onclick = () => { m.fechar(); ir("planos"); };
}

function telaPlanos() {
  const L = CONFIG.limites;
  const pro = logado() && ehPro() && CONFIG.contas;
  const linhas = [
    ["🗺️", "Trilha completa do A1 ao C1", "✔", "✔"],
    ["🧠", "Revisão inteligente", "✔", "✔"],
    ["🎤", "Pronúncia com nota", "✔", "✔"],
    ["📏", "Teste de nível", "✔", "✔"],
    ["🕹️", "Minijogos do fliperama", "2 jogos", "Todos os 4"],
    ["💬", "Tutor com inteligência artificial", `${L.gratis.tutor} mensagens por dia`, `${L.pro.tutor} mensagens por dia`],
    ["✨", "Lições sob medida sobre qualquer tema", `${L.gratis.licao} por dia`, `${L.pro.licao} por dia`],
    ["🎭", "Simulações de situações reais com IA", "Dentro do limite grátis", "✔"],
    ["🎫", `Selo ${NOME_PLANO()} no perfil`, "—", "✔"],
  ];
  render(`
    <section class="planos-topo">
      ${lumi("festa", "media flutua")}
      <span class="selo-passaporte">🎫 ${NOME_PLANO()}</span>
      <h1>Aprenda com um <span class="destaque">tutor particular de IA</span></h1>
      <p class="sub">A versão grátis já tem o método completo. O ${NOME_PLANO()} acrescenta conversa diária com a IA, lições sobre o que você quiser e todos os jogos.</p>
    </section>
    <div class="planos">
      <div class="plano">
        <h2>Grátis</h2><p class="preco">R$ 0</p><p class="sub">Para começar e criar o hábito</p>
        <button class="btn secundario" disabled>${pro ? "Plano básico" : "Seu plano atual"}</button>
      </div>
      <div class="plano destaque-plano">
        <span class="fita">Mais completo</span>
        <h2>🎫 ${NOME_PLANO()}</h2><p class="preco">${esc(CONFIG.preco || "Em breve")}</p><p class="sub">Para quem quer falar de verdade</p>
        ${pro
          ? `<button class="btn dourado" disabled>✔ Você é ${NOME_PLANO()}${CONTA.usuario.proAte ? " até " + new Date(CONTA.usuario.proAte).toLocaleDateString("pt-BR") : ""}</button>`
          : `<button class="btn grande dourado" id="plAssinar" ${CONFIG.checkout ? "" : "disabled"}>${CONFIG.checkout ? "Quero meu " + NOME_PLANO() : "Em breve"}</button>`}
        ${!pro && CONFIG.checkout ? `<button class="btn texto pequeno" id="plJaComprei">Já paguei, atualizar meu plano</button>` : ""}
      </div>
    </div>
    <div class="tabela-planos">
      <div class="tp-linha tp-cab"><span></span><b>Grátis</b><b>🎫 ${NOME_PLANO()}</b></div>
      ${linhas.map(([ic, nome, g, p]) => `<div class="tp-linha"><span>${ic} ${nome}</span><span>${g}</span><span class="tp-pro">${p}</span></div>`).join("")}
    </div>
    <p class="sub centro pequena">Use na compra o mesmo e-mail da sua conta do DrPolygo. O ${NOME_PLANO()} é liberado automaticamente depois da confirmação do pagamento.</p>`);
  const ba = $("#plAssinar");
  if (ba) ba.onclick = () => {
    if (!logado()) return abrirLogin({ titulo: "Primeiro, crie sua conta", texto: `Assim o ${NOME_PLANO()} fica ligado a ela e funciona em qualquer aparelho.` });
    const url = CONFIG.checkout + (CONFIG.checkout.includes("?") ? "&" : "?") + "email=" + encodeURIComponent(CONTA.usuario.email || "");
    window.open(url, "_blank", "noopener");
  };
  const bj = $("#plJaComprei");
  if (bj) bj.onclick = async () => {
    await carregarConta();
    if (ehPro()) { confetes(120); som("nivel"); toast("🎫", `Bem-vindo ao ${NOME_PLANO()}!`, "Tudo liberado."); telaPlanos(); }
    else toast("⏳", "Ainda não chegou", "A confirmação do pagamento pode levar alguns minutos. Pix costuma ser na hora.");
  };
}

// ---------- Painel do administrador ----------
async function telaAdmin() {
  if (!CONTA.usuario || !CONTA.usuario.admin) { render(`<div class="vazio">${lumi("triste", "media")}<p class="sub">Só para administradores.</p></div>`); return; }
  render(`<h1>📊 Painel</h1><p class="sub">Carregando...</p>`);
  const [resumo, usuarios, pagamentos] = await Promise.all(["resumo", "usuarios", "pagamentos"].map(r => fetch("/api/admin/" + r).then(x => x.json())));
  const barras = (titulo, lista, rotulo = k => esc(k)) => {
    const max = Math.max(1, ...lista.map(x => x[1]));
    return `<div class="cartao-p"><h3>${titulo}</h3>${lista.length ? lista.map(([k, v]) => `<div class="adm-barra"><span>${rotulo(k)}</span><div><i style="width:${(v / max) * 100}%"></i></div><b>${v}</b></div>`).join("") : `<p class="sub">Sem dados ainda.</p>`}</div>`;
  };
  const rotuloOrigem = k => ORIGENS[k] ? `${ORIGENS[k].ic.startsWith("<svg") ? iconeMarca(k, "mini") : ORIGENS[k].ic} ${esc(ORIGENS[k].rot)}` : esc(k);
  render(`
    <h1>📊 Painel do DrPolygo</h1>
    <div class="grade-stats">
      <div class="stat"><span>👥</span><b>${resumo.usuarios}</b><small>contas criadas</small></div>
      <div class="stat"><span>🎫</span><b>${resumo.pro}</b><small>${NOME_PLANO()} ativos</small></div>
      <div class="stat"><span>📝</span><b>${resumo.questionarios}</b><small>questionários respondidos</small></div>
      <div class="stat"><span>🔁</span><b>${resumo.questionarios ? Math.round((resumo.viraramConta / resumo.questionarios) * 100) : 0}%</b><small>do questionário viraram conta</small></div>
    </div>
    <div class="adm-grade">
      ${barras("Cadastros por dia (14 dias)", resumo.cadastrosPorDia.map(([d, n]) => [d.slice(5).split("-").reverse().join("/"), n]))}
      ${barras("Como conheceram", resumo.porOrigem, rotuloOrigem)}
      ${barras("Campanhas (utm_campaign)", resumo.porCampanha)}
      ${barras("Objetivo", resumo.porObjetivo)}
      ${barras("Idioma", resumo.porIdioma)}
      ${barras("Tempo por dia (min)", resumo.porTempo)}
      ${barras("Nível declarado", resumo.porNivel)}
    </div>
    <h2>Liberar ${NOME_PLANO()} manualmente</h2>
    <form class="cartao-p adm-form" id="admForm">
      <input class="campo" id="admEmail" type="email" placeholder="e-mail do aluno" required>
      <select class="campo pequeno" id="admDias"><option value="31">31 dias</option><option value="365">1 ano</option><option value="0">Vitalício</option></select>
      <button class="btn">Liberar</button>
      <button class="btn perigo" type="button" id="admRemover">Remover</button>
    </form>
    <h2>Usuários</h2>
    <input class="campo" id="admBusca" placeholder="Buscar por nome ou e-mail">
    <div class="adm-usuarios" id="admLista"></div>
    <h2>Avisos de pagamento recebidos</h2>
    <div class="adm-usuarios">${pagamentos.length ? pagamentos.map(p => `<div class="adm-u"><b>${esc(p.email || "sem e-mail")}</b><span>${esc(p.origem)} · ${esc(p.evento || "")}</span><span class="${/liberado/.test(p.acao) ? "ok" : /removido/.test(p.acao) ? "nao" : ""}">${esc(p.acao)}</span><small>${new Date(p.criado).toLocaleString("pt-BR")}</small></div>`).join("") : `<p class="sub">Nenhum aviso ainda. Configure o webhook da sua plataforma de vendas.</p>`}</div>`);
  const listar = lista => {
    $("#admLista").innerHTML = lista.length ? lista.map(u => `<div class="adm-u"><b>${esc(u.nome || "—")}</b><span>${esc(u.email || "")}</span>
      <span class="${u.plano === "pro" ? "ok" : ""}">${u.plano === "pro" ? "🎫 " + NOME_PLANO() + (u.pro_ate ? " até " + new Date(u.pro_ate).toLocaleDateString("pt-BR") : " vitalício") : "Grátis"}</span>
      <small>${esc((u.perfil || {}).origem || "")} ${esc((u.perfil || {}).objetivo || "")} · desde ${new Date(u.criado).toLocaleDateString("pt-BR")}</small></div>`).join("") : `<p class="sub">Nenhum usuário encontrado.</p>`;
  };
  listar(usuarios);
  let t = null;
  $("#admBusca").oninput = e => { clearTimeout(t); t = setTimeout(async () => listar(await (await fetch("/api/admin/usuarios?busca=" + encodeURIComponent(e.target.value))).json()), 300); };
  const enviarPlano = async corpo => {
    const r = await fetch("/api/admin/plano", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corpo) });
    const j = await r.json();
    if (!r.ok) return toast("⚠️", "Erro", j.erro);
    toast("✅", corpo.remover ? "Plano removido" : `${NOME_PLANO()} liberado`, corpo.email);
    telaAdmin();
  };
  $("#admForm").onsubmit = e => { e.preventDefault(); enviarPlano({ email: $("#admEmail").value, dias: +$("#admDias").value }); };
  $("#admRemover").onclick = () => { if ($("#admEmail").value) enviarPlano({ email: $("#admEmail").value, remover: true }); };
}

// ---------- Cartão da conta (no Perfil) ----------
function cartaoConta() {
  if (!CONFIG.contas) return "";
  const u = CONTA.usuario;
  if (!u) return `<div class="cartao-p conta-cartao">
    <div><b>☁️ Seu progresso está só neste aparelho</b><small>Crie uma conta grátis para salvar na nuvem e usar o tutor com IA.</small></div>
    <button class="btn" id="ccEntrar">Criar conta ou entrar</button></div>`;
  const pro = u.plano === "pro";
  const t = restanteIA("tutor"), l = restanteIA("licao");
  return `<div class="cartao-p conta-cartao ${pro ? "pro" : ""}">
    ${u.foto ? `<img class="conta-foto" src="${esc(u.foto)}" alt="" referrerpolicy="no-referrer">` : `<span class="conta-foto">${E.avatar}</span>`}
    <div><b>${esc(u.nome || "Sua conta")} ${pro ? `<span class="selo-passaporte">🎫 ${NOME_PLANO()}</span>` : ""}</b>
      <small>${esc(u.email || "")} · ${pro ? (u.proAte ? "válido até " + new Date(u.proAte).toLocaleDateString("pt-BR") : "vitalício") : "plano grátis"}</small>
      ${t ? `<small>Hoje: 💬 ${t.usados}/${t.limite} mensagens do tutor · ✨ ${l.usados}/${l.limite} lições sob medida</small>` : ""}</div>
    <div class="conta-acoes">
      ${pro ? "" : `<button class="btn dourado" id="ccPlano">🎫 Conhecer o ${NOME_PLANO()}</button>`}
      ${u.admin ? `<button class="btn secundario" id="ccAdmin">📊 Painel</button>` : ""}
      <button class="btn texto" id="ccSair">Sair</button>
    </div></div>`;
}
function ligarCartaoConta() {
  const e = $("#ccEntrar"); if (e) e.onclick = () => abrirLogin();
  const p = $("#ccPlano"); if (p) p.onclick = () => ir("planos");
  const a = $("#ccAdmin"); if (a) a.onclick = () => ir("admin");
  const s = $("#ccSair"); if (s) s.onclick = () => sair();
}
