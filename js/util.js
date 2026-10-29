// ============================================================
//  Utilidades gerais: DOM, sorteio, texto, som, voz, efeitos
// ============================================================
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const app = document.getElementById("app");

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
const embaralhar = arr => arr.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(v => v[1]);
const sortear = (arr, n) => embaralhar(arr).slice(0, n);
const umDe = arr => arr[Math.floor(Math.random() * arr.length)];

function hashTexto(s) {
  let h = 2166136261;
  for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function aleatorioComSemente(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Compara respostas sem ligar para acentos, maiúsculas e pontuação
function normalizar(s) {
  return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss").replace(/œ/g, "oe").replace(/[’']/g, " ")
    .replace(/[¿?¡!.,;:"«»]/g, "").replace(/\s+/g, " ").trim();
}
function semAcento(s) {
  return String(s).toLowerCase().replace(/[’']/g, "'").replace(/[¿?¡!.,;:"«»]/g, "").replace(/\s+/g, " ").trim();
}
function similaridade(a, b) {
  if (a === b) return 1;
  const m = a.length, n = b.length;
  if (!m || !n) return 0;
  let ant = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const at = [i];
    for (let j = 1; j <= n; j++) {
      at[j] = Math.min(ant[j] + 1, at[j - 1] + 1, ant[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    ant = at;
  }
  return 1 - ant[n] / Math.max(m, n);
}
// Quebra uma frase em fichas para os exercícios de montar
function fichas(frase) {
  return frase.split(/\s+/)
    .map(t => t.replace(/^[¿¡"«]+|[.,!?;:"»]+$/g, ""))
    .filter(t => t && !/^[?!.,;:]+$/.test(t));
}
function formatarTempo(seg) {
  const m = Math.floor(seg / 60), s = seg % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ---------- Sons gerados na hora (sem arquivos) ----------
let audioCtx = null;
const NOTAS = {
  certo: [[660, 0, .09], [880, .09, .16]],
  errado: [[230, 0, .16], [185, .13, .24]],
  clique: [[540, 0, .035]],
  pop: [[760, 0, .05], [1020, .05, .07]],
  fim: [[523, 0, .12], [659, .12, .12], [784, .24, .12], [1047, .36, .3]],
  nivel: [[392, 0, .1], [523, .1, .1], [659, .2, .1], [784, .3, .1], [1047, .4, .35]],
  moeda: [[988, 0, .07], [1319, .07, .2]],
  bau: [[330, 0, .08], [440, .08, .08], [554, .16, .08], [659, .24, .08], [880, .32, .3]],
};
function som(tipo) {
  if (!E.som || !NOTAS[tipo]) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const t0 = audioCtx.currentTime;
    NOTAS[tipo].forEach(([f, ini, dur]) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = tipo === "errado" ? "sawtooth" : "triangle";
      o.frequency.value = f;
      const vol = tipo === "errado" ? 0.06 : 0.16;
      g.gain.setValueAtTime(0.0001, t0 + ini);
      g.gain.exponentialRampToValueAtTime(vol, t0 + ini + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + ini + dur);
      o.connect(g).connect(audioCtx.destination);
      o.start(t0 + ini); o.stop(t0 + ini + dur + 0.03);
    });
  } catch {}
}

// ---------- Voz (pronúncia) ----------
// Todas as vozes instaladas para um idioma (as "Natural"/"Online" soam mais humanas)
function vozesDoIdioma(idioma) {
  if (!("speechSynthesis" in window)) return [];
  const prefixo = IDIOMAS[idioma].voz.slice(0, 2);
  return speechSynthesis.getVoices()
    .filter(v => v.lang.replace("_", "-").toLowerCase().startsWith(prefixo))
    .sort((a, b) => (/Natural|Online|Google/i.test(b.name) ? 1 : 0) - (/Natural|Online|Google/i.test(a.name) ? 1 : 0));
}
function vozPara(lang, idioma) {
  const vs = speechSynthesis.getVoices();
  const escolhida = idioma && E.vozes && E.vozes[idioma];
  if (escolhida) { const v = vs.find(x => x.name === escolhida); if (v) return v; }
  return vs.find(v => v.lang === lang && /Natural|Online|Google/i.test(v.name))
    || vs.find(v => v.lang === lang)
    || vs.find(v => v.lang.replace("_", "-").startsWith(lang.slice(0, 2)));
}
function falar(texto, lento = false, idioma = E.idioma) {
  if (!("speechSynthesis" in window) || !idioma || !texto) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = IDIOMAS[idioma].voz;
  const v = vozPara(u.lang, idioma);
  if (v) { u.voice = v; u.lang = v.lang; }
  u.rate = (lento ? 0.6 : 0.95) * (E.velocidade || 1);
  speechSynthesis.speak(u);
}
if ("speechSynthesis" in window) speechSynthesis.getVoices();
const Reconhecimento = window.SpeechRecognition || window.webkitSpeechRecognition;

// ---------- Efeitos visuais ----------
function confetes(qtd = 50) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const s = getComputedStyle(document.documentElement);
  const cores = ["--c1", "--c2", "--c3"].map(v => s.getPropertyValue(v).trim()).concat(["#FFD43B", "#22C55E"]);
  for (let i = 0; i < qtd; i++) {
    const c = document.createElement("div");
    c.className = "confete";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = cores[i % cores.length];
    c.style.animationDuration = 1.6 + Math.random() * 1.8 + "s";
    c.style.animationDelay = Math.random() * 0.35 + "s";
    if (i % 3 === 0) c.style.borderRadius = "50%";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4000);
  }
}
function toast(icone, titulo, texto = "") {
  const box = document.getElementById("toasts");
  const t = el(`<div class="toast"><span class="toast-ic">${icone}</span><div><b>${esc(titulo)}</b><small>${esc(texto)}</small></div></div>`);
  box.appendChild(t);
  setTimeout(() => t.classList.add("saindo"), 3400);
  setTimeout(() => t.remove(), 3900);
}
function tremer(elm) {
  elm.classList.remove("tremer"); void elm.offsetWidth; elm.classList.add("tremer");
}
function pular(elm) {
  if (!elm) return;
  elm.classList.remove("pulo"); void elm.offsetWidth; elm.classList.add("pulo");
}

function abrirModal(html, { aoFechar, classe = "" } = {}) {
  const fundo = el(`<div class="modal-fundo"><div class="modal ${classe}" role="dialog" aria-modal="true">${html}</div></div>`);
  document.body.appendChild(fundo);
  let fechado = false;
  const fechar = () => {
    if (fechado) return; fechado = true;
    fundo.classList.add("saindo");
    setTimeout(() => fundo.remove(), 200);
    if (aoFechar) aoFechar();
  };
  fundo.addEventListener("click", e => { if (e.target === fundo || e.target.closest("[data-fechar]")) fechar(); });
  return { el: fundo.firstElementChild, fechar };
}
function confirmar(titulo, texto, sim = "Sim", nao = "Cancelar") {
  return new Promise(res => {
    let resposta = false;
    const m = abrirModal(`<h2>${titulo}</h2><p class="sub">${texto}</p>
      <div class="acoes"><button class="btn secundario" data-fechar>${nao}</button><button class="btn perigo" id="mSim">${sim}</button></div>`,
      { aoFechar: () => res(resposta) });
    $("#mSim", m.el).onclick = () => { resposta = true; m.fechar(); };
  });
}

// ---------- Tema de cores ----------
const TEMA_PADRAO = {
  c1: "#6D28D9", c2: "#EC4899", c3: "#F59E0B", sobreC2: "#FFFFFF",
  faixa: "linear-gradient(90deg,#6D28D9,#EC4899,#F59E0B)",
};
function aplicarTema(idioma = E.idioma) {
  const t = idioma ? IDIOMAS[idioma].tema : TEMA_PADRAO;
  const r = document.documentElement.style;
  r.setProperty("--c1", t.c1);
  r.setProperty("--c2", t.c2);
  r.setProperty("--c3", t.c3);
  r.setProperty("--sobre-c2", t.sobreC2);
  r.setProperty("--faixa", t.faixa);
  document.body.dataset.idioma = idioma || "";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = t.c1;
}

// ---------- Mascotes: os dois mudam de cor com o idioma ----------
// nivel = nível do jogador em que o mascote aparece na loja; preco = moedas
const MASCOTES = {
  kiko: { nome: "Kiko", desc: "o papagaio poliglota", nivel: 1, preco: 0, apresentacao: "Oi! Eu sou o Kiko.<br>Papagaio que fala 5 idiomas!" },
  lumi: { nome: "Lumi", desc: "a bolinha simpática", nivel: 1, preco: 0, apresentacao: "Oi! Eu sou a Lumi.<br>Mudo de cor com o idioma!" },
  tito: { nome: "Tito", desc: "a raposa esperta", nivel: 2, preco: 60, apresentacao: "Oi! Eu sou o Tito.<br>Esperto para aprender!" },
  bubu: { nome: "Bubu", desc: "o urso abraçador", nivel: 3, preco: 100, apresentacao: "Oi! Eu sou o Bubu.<br>Vamos estudar juntos?" },
  mia: { nome: "Mia", desc: "a gata curiosa", nivel: 4, preco: 140, apresentacao: "Miau! Eu sou a Mia.<br>Curiosa por idiomas!" },
  pingo: { nome: "Pingo", desc: "o pinguim viajante", nivel: 5, preco: 180, apresentacao: "Oi! Eu sou o Pingo.<br>Já viajei o mundo todo!" },
  bit: { nome: "Bit", desc: "o robô tradutor", nivel: 6, preco: 220, apresentacao: "Bip! Eu sou o Bit.<br>Traduzo tudo!" },
  draco: { nome: "Draco", desc: "o dragão corajoso", nivel: 8, preco: 320, apresentacao: "Oi! Eu sou o Draco.<br>Sem medo de errar!" },
  luna: { nome: "Luna", desc: "a unicórnio mágica", nivel: 10, preco: 420, apresentacao: "Oi! Eu sou a Luna.<br>Aprender é mágico!" },
  oto: { nome: "Oto", desc: "o polvo de 8 idiomas", nivel: 12, preco: 520, apresentacao: "Oi! Eu sou o Oto.<br>Um idioma por braço!" },
};
const nomeMascote = () => (MASCOTES[E.mascote] || MASCOTES.kiko).nome;

// A origem de cada mascote na história do Doutor Polygo
const HISTORIA_MASCOTES = {
  kiko: "O papagaio de estimação do Doutor. Na hora da explosão, estava bicando um dicionário e engoliu as 5 línguas de uma vez. Quando fica nervoso, mistura todas na mesma frase.",
  lumi: "Uma gota de Tinta Poliglota que pulou do tubo de ensaio. Ela muda de cor conforme o idioma que está por perto, e é por isso que o laboratório inteiro muda de cor junto.",
  tito: "Uma raposa que vivia roubando biscoitos do laboratório. A explosão deixou ele esperto demais: agora decora palavras só de cheirar o livro.",
  bubu: "O ursinho de pelúcia que o Doutor tinha desde criança. Ganhou vida com o raio da máquina e virou o oficial de abraços: todo erro merece um.",
  mia: "Estava dormindo em cima da Máquina Babelatrônica quando ela explodiu. Acordou entendendo francês e fingindo que não entende português.",
  pingo: "O pinguim carteiro do Poliedro. Viaja de face em face entregando as palavras que você recupera, sempre de gravata e sempre atrasado.",
  bit: "O robô que o Doutor construiu para catalogar cada palavra perdida. Traduz qualquer coisa, menos piada: ainda está aprendendo humor.",
  draco: "O guardião do Cofre das Palavras Difíceis, lá no último andar do Poliedro. Cospe fogo em quem tenta pular de nível sem estudar.",
  luna: "Uma unicórnio feita de gramática pura, nascida de um raio que atravessou a biblioteca. Seu chifre brilha quando alguém acerta o verbo.",
  oto: "O polvo do aquário do laboratório. Cada tentáculo absorveu um idioma na explosão, e sobraram três braços que ele quer preencher com você.",
};

// ---------- O Doutor Polygo (cabeça de hexágono, óculos enormes, cabelo de cientista maluco) ----------
function desenharDrPolygo(humor = "feliz", classe = "") {
  const bocas = {
    feliz: '<path d="M52 79 Q60 86 68 79" fill="none" stroke="#7A3E1C" stroke-width="3" stroke-linecap="round"/>',
    triste: '<path d="M53 84 Q60 78 67 84" fill="none" stroke="#7A3E1C" stroke-width="3" stroke-linecap="round"/>',
    uau: '<ellipse cx="60" cy="82" rx="4.5" ry="5.5" fill="#7A3E1C"/>',
    festa: '<path d="M50 78 Q60 94 70 78 Z" fill="#7A3E1C"/><path d="M54 84 Q60 89 66 84" fill="#FF6B81"/>',
  };
  return `<svg class="lumi drpolygo humor-${humor} ${classe}" viewBox="0 0 120 130" aria-hidden="true">
    <ellipse cx="60" cy="126" rx="30" ry="4" class="lumi-sombra"/>
    <g class="lumi-corpo">
      <path d="M26 130 L33 100 Q60 88 87 100 L94 130Z" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>
      <path d="M50 96 L60 116 L70 96Z" style="fill:var(--c1)"/>
      <path d="M48 99 L58 104 L48 109Z M72 99 L62 104 L72 109Z" style="fill:var(--c2)"/><circle cx="60" cy="104" r="3" style="fill:var(--c2)"/>
      <polygon points="80,108 86,111 86,117 80,120 74,117 74,111" style="fill:var(--c2)" opacity=".85"/>
      <path d="M26 46 C10 40 12 20 28 26 C24 10 42 6 46 20 C48 4 70 4 72 20 C76 6 96 10 92 26 C108 20 110 40 94 46 C100 34 90 30 86 34 C84 24 74 24 72 30 C66 22 54 22 48 30 C46 24 36 24 34 34 C30 30 20 34 26 46Z" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5"/>
      <polygon points="60,24 90,41 90,75 60,92 30,75 30,41" fill="#FFD8B5" stroke="#E8A877" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="31" cy="60" r="5" fill="#FFC79A" stroke="#E8A877" stroke-width="1.5"/><circle cx="89" cy="60" r="5" fill="#FFC79A" stroke="#E8A877" stroke-width="1.5"/>
      <g class="lumi-olho"><circle cx="46" cy="57" r="11" fill="#fff" opacity=".85"/><circle class="pupila" cx="46" cy="57" r="4.5" fill="#1b1530"/></g>
      <g class="lumi-olho"><circle cx="74" cy="57" r="11" fill="#fff" opacity=".85"/><circle class="pupila" cx="74" cy="57" r="4.5" fill="#1b1530"/></g>
      <circle cx="46" cy="57" r="11.5" fill="none" stroke="#1b1530" stroke-width="3"/><circle cx="74" cy="57" r="11.5" fill="none" stroke="#1b1530" stroke-width="3"/>
      <path d="M57.5 56 Q60 53 62.5 56" fill="none" stroke="#1b1530" stroke-width="3"/>
      ${humor === "triste" ? '<path d="M35 42 L53 38 M85 42 L67 38" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>' : humor === "uau" ? '<path d="M36 40 Q46 32 56 40 M64 40 Q74 32 84 40" fill="none" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>' : ""}
      <circle cx="38" cy="73" r="4.5" fill="#ff7aa8" opacity=".45"/><circle cx="82" cy="73" r="4.5" fill="#ff7aa8" opacity=".45"/>
      <path d="M47 73 Q53 67 60 72 Q67 67 73 73 Q67 76 60 74 Q53 76 47 73Z" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.2"/>
      ${bocas[humor] || bocas.feliz}
    </g>
  </svg>`;
}
// Logo oficial no topo (o Poliedro com os óculos do Doutor)
function desenharMarca() {
  const m = document.getElementById("marcaLumi");
  if (m) m.innerHTML = '<img src="logo/drpolygo-simbolo.svg" alt="" width="40" height="40">';
}
let lumiId = 0;
function desenharMascote(chave, humor = "feliz", classe = "") {
  if (chave === "lumi") return desenharLumi(humor, classe);
  if (BICHOS[chave]) return desenharBicho(chave, humor, classe);
  return desenharKiko(humor, classe);
}
function lumi(humor = "feliz", classe = "") {
  return desenharMascote(typeof E !== "undefined" ? E.mascote : "kiko", humor, classe);
}

// Rosto padrão (olhos que seguem o mouse, sobrancelhas e boca conforme o humor)
function rostoMascote(humor, { olhos, r = 12, pr = 6.5, boca, branco = true, corPupila = "#1b1530", corBoca = "#1b1530", bochechas = true }) {
  let s = olhos.map(([x, y]) => `<g class="lumi-olho">${branco ? `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>` : ""}
    <circle class="pupila" cx="${x}" cy="${y}" r="${pr}" fill="${corPupila}"/></g>
    <circle cx="${x + 2.6}" cy="${y - 3}" r="1.9" fill="#fff" opacity=".9"/>`).join("");
  const [[x1, y1], [x2, y2]] = olhos;
  if (humor === "triste") s += `<path d="M${x1 - r} ${y1 - r + 1} L${x1 + r * 0.7} ${y1 - r - 5}" class="kiko-traco"/><path d="M${x2 + r} ${y2 - r + 1} L${x2 - r * 0.7} ${y2 - r - 5}" class="kiko-traco"/>`;
  if (humor === "uau") s += `<path d="M${x1 - r} ${y1 - r - 3} Q${x1} ${y1 - r - 10} ${x1 + r} ${y1 - r - 3}" class="kiko-traco"/><path d="M${x2 - r} ${y2 - r - 3} Q${x2} ${y2 - r - 10} ${x2 + r} ${y2 - r - 3}" class="kiko-traco"/>`;
  if (bochechas) s += `<circle cx="${x1 - 5}" cy="${y1 + r + 6}" r="5.5" fill="#ff7aa8" opacity=".55"/><circle cx="${x2 + 5}" cy="${y2 + r + 6}" r="5.5" fill="#ff7aa8" opacity=".55"/>`;
  if (boca) {
    const [mx, my] = boca;
    if (humor === "feliz") s += `<path d="M${mx - 9} ${my} Q${mx} ${my + 8} ${mx + 9} ${my}" fill="none" stroke="${corBoca}" stroke-width="3.5" stroke-linecap="round"/>`;
    if (humor === "triste") s += `<path d="M${mx - 8} ${my + 5} Q${mx} ${my - 3} ${mx + 8} ${my + 5}" fill="none" stroke="${corBoca}" stroke-width="3.5" stroke-linecap="round"/>`;
    if (humor === "uau") s += `<ellipse cx="${mx}" cy="${my + 2}" rx="5.5" ry="6.5" fill="${corBoca}"/>`;
    if (humor === "festa") s += `<path d="M${mx - 11} ${my - 2} Q${mx} ${my + 17} ${mx + 11} ${my - 2} Z" fill="${corBoca}"/><path d="M${mx - 6} ${my + 6} Q${mx} ${my + 12} ${mx + 6} ${my + 6}" fill="#FF6B81"/>`;
  }
  return s;
}

const CORPO_OVO = "M60 24 C90 24 104 48 102 74 C100 102 82 116 60 116 C38 116 20 102 18 74 C16 48 30 24 60 24Z";
// Cada bicho: o que fica atrás do corpo, o corpo, os detalhes e o rosto
const BICHOS = {
  tito: g => ({
    atras: `<path d="M96 104 C122 100 122 62 104 54 C110 74 102 92 86 98Z" fill="url(#${g})"/><circle cx="105" cy="59" r="6" fill="#fff"/>
      <path d="M26 46 L32 8 L58 32Z" fill="url(#${g})"/><path d="M94 46 L88 8 L62 32Z" fill="url(#${g})"/>
      <path d="M33 38 L36 18 L50 32Z" fill="#fff" opacity=".55"/><path d="M87 38 L84 18 L70 32Z" fill="#fff" opacity=".55"/>`,
    corpo: CORPO_OVO,
    frente: `<path d="M22 66 C30 92 46 100 60 100 C74 100 90 92 98 66 C86 80 74 84 60 84 C46 84 34 80 22 66Z" fill="#fff" opacity=".92"/>
      <ellipse cx="60" cy="82" rx="5" ry="3.6" fill="#1b1530"/>`,
    rosto: { olhos: [[44, 62], [76, 62]], r: 11, pr: 6, boca: [60, 90] },
  }),
  bubu: g => ({
    atras: `<circle cx="30" cy="34" r="15" fill="url(#${g})"/><circle cx="90" cy="34" r="15" fill="url(#${g})"/>
      <circle cx="30" cy="34" r="8" fill="#fff" opacity=".35"/><circle cx="90" cy="34" r="8" fill="#fff" opacity=".35"/>`,
    corpo: "M60 22 C92 22 106 46 104 74 C102 104 84 118 60 118 C36 118 18 104 16 74 C14 46 28 22 60 22Z",
    frente: `<ellipse cx="60" cy="102" rx="24" ry="12" fill="#fff" opacity=".2"/><ellipse cx="60" cy="80" rx="19" ry="14" fill="#fff" opacity=".9"/>
      <ellipse cx="60" cy="74" rx="6.5" ry="4.5" fill="#1b1530"/>`,
    rosto: { olhos: [[42, 56], [78, 56]], r: 9, pr: 5.5, boca: [60, 85] },
  }),
  mia: g => ({
    atras: `<path d="M94 108 C116 108 118 80 108 70 C106 86 100 96 88 100Z" style="fill:var(--c2)"/>
      <path d="M24 50 L30 12 L54 32Z" fill="url(#${g})"/><path d="M96 50 L90 12 L66 32Z" fill="url(#${g})"/>
      <path d="M31 42 L33 22 L46 33Z" fill="#ff9ec0"/><path d="M89 42 L87 22 L74 33Z" fill="#ff9ec0"/>`,
    corpo: CORPO_OVO,
    frente: `<path d="M55 76 L65 76 L60 81Z" fill="#ff7aa8"/>
      <path d="M40 80 L16 75 M40 84 L16 86 M80 80 L104 75 M80 84 L104 86" stroke="#1b1530" stroke-width="1.6" opacity=".55" stroke-linecap="round"/>`,
    rosto: { olhos: [[44, 60], [76, 60]], r: 11, pr: 6, boca: [60, 87] },
  }),
  pingo: (g, humor) => ({
    atras: `<path d="M22 64 C8 76 10 92 20 98 C22 86 24 76 28 68Z" fill="url(#${g})"/><path d="M98 64 C112 76 110 92 100 98 C98 86 96 76 92 68Z" fill="url(#${g})"/>
      <ellipse cx="48" cy="118" rx="9" ry="4" fill="#FFB020"/><ellipse cx="72" cy="118" rx="9" ry="4" fill="#FFB020"/>`,
    corpo: "M60 14 C88 14 100 44 100 76 C100 104 84 118 60 118 C36 118 20 104 20 76 C20 44 32 14 60 14Z",
    frente: `<path d="M60 40 C80 40 88 60 88 80 C88 102 76 112 60 112 C44 112 32 102 32 80 C32 60 40 40 60 40Z" fill="#fff"/>` +
      (humor === "festa" || humor === "uau"
        ? `<path d="M51 58 L69 58 L60 65Z" class="kiko-bico"/><path d="M53 67 L67 67 L60 ${humor === "festa" ? 78 : 73}Z" class="kiko-bico"/>`
        : `<path d="M51 59 L69 59 L60 70Z" class="kiko-bico"/>`),
    rosto: { olhos: [[47, 44], [73, 44]], r: 9, pr: 5 },
  }),
  bit: g => ({
    atras: `<line x1="60" y1="24" x2="60" y2="9" stroke="#94A3B8" stroke-width="4" stroke-linecap="round"/>
      <circle cx="60" cy="8" r="6" class="bit-luz" style="fill:var(--c2)"/>
      <rect x="9" y="52" width="11" height="24" rx="4" style="fill:var(--c2)"/><rect x="100" y="52" width="11" height="24" rx="4" style="fill:var(--c2)"/>
      <rect x="34" y="96" width="52" height="22" rx="8" style="fill:var(--c2)"/><circle cx="60" cy="107" r="4.5" fill="#FDE047"/>`,
    corpo: "M40 22 H80 Q102 22 102 44 V74 Q102 96 80 96 H40 Q18 96 18 74 V44 Q18 22 40 22Z",
    frente: `<rect x="28" y="34" width="64" height="50" rx="14" fill="#0F172A" opacity=".88"/>`,
    rosto: { olhos: [[46, 54], [74, 54]], r: 8, pr: 7, branco: false, corPupila: "#67E8F9", boca: [60, 70], corBoca: "#67E8F9", bochechas: false },
  }),
  draco: g => ({
    atras: `<path d="M24 62 L2 34 L10 64 L0 78 L22 80Z" style="fill:var(--c2)" opacity=".92"/><path d="M96 62 L118 34 L110 64 L120 78 L98 80Z" style="fill:var(--c2)" opacity=".92"/>
      <path d="M90 104 C112 110 118 96 116 86 L108 96 C104 102 98 104 88 100Z" fill="url(#${g})"/>
      <path d="M40 30 L33 6 L52 24Z" fill="#FDE68A"/><path d="M80 30 L87 6 L68 24Z" fill="#FDE68A"/>
      <path d="M48 24 L54 12 L60 22 L66 12 L72 24Z" style="fill:var(--c2)"/>`,
    corpo: CORPO_OVO,
    frente: `<ellipse cx="60" cy="98" rx="22" ry="16" fill="#FDE68A" opacity=".6"/>
      <path d="M44 92 H76 M42 100 H78 M46 108 H74" stroke="#D97706" stroke-width="1.5" opacity=".45"/>
      <circle cx="54" cy="79" r="2" fill="#1b1530"/><circle cx="66" cy="79" r="2" fill="#1b1530"/>`,
    rosto: { olhos: [[44, 58], [76, 58]], r: 12, pr: 6, boca: [60, 87] },
  }),
  luna: g => ({
    atras: `<path d="M30 42 C12 52 14 82 26 96 C28 74 34 60 44 48Z" style="fill:var(--c2)"/><path d="M90 42 C108 52 106 82 94 96 C92 74 86 60 76 48Z" style="fill:var(--c2)"/>
      <path d="M36 36 L38 14 L52 30Z" fill="url(#${g})"/><path d="M84 36 L82 14 L68 30Z" fill="url(#${g})"/>
      <path d="M54 28 L60 -2 L66 28Z" fill="#FCD34D" stroke="#D97706" stroke-width="1.5"/><path d="M56 19 L64 16 M57 10 L63 8" stroke="#D97706" stroke-width="1.5"/>`,
    corpo: CORPO_OVO,
    frente: `<path d="M46 28 C52 16 68 14 74 28 C66 22 56 24 46 32Z" style="fill:var(--c2)"/>
      <ellipse cx="60" cy="92" rx="20" ry="13" fill="#fff" opacity=".35"/><circle cx="53" cy="92" r="2" fill="#1b1530"/><circle cx="67" cy="92" r="2" fill="#1b1530"/>`,
    rosto: { olhos: [[44, 62], [76, 62]], r: 11, pr: 6, boca: [60, 99] },
  }),
  oto: g => ({
    atras: [["M26 88 Q12 110 24 124 Q30 112 40 94Z"], ["M40 96 Q34 116 44 128 Q50 114 52 98Z"], ["M55 98 Q54 118 60 130 Q66 118 65 98Z"], ["M68 98 Q70 114 76 128 Q86 116 80 96Z"], ["M80 94 Q90 112 96 124 Q108 110 94 88Z"]]
      .map(([d]) => `<path d="${d}" fill="url(#${g})"/>`).join("") +
      `<circle cx="28" cy="112" r="2.5" style="fill:var(--c2)"/><circle cx="46" cy="118" r="2.5" style="fill:var(--c2)"/><circle cx="60" cy="120" r="2.5" style="fill:var(--c2)"/><circle cx="76" cy="118" r="2.5" style="fill:var(--c2)"/><circle cx="94" cy="112" r="2.5" style="fill:var(--c2)"/>`,
    corpo: "M60 14 C92 14 104 40 102 66 C100 90 84 102 60 102 C36 102 20 90 18 66 C16 40 28 14 60 14Z",
    frente: `<circle cx="40" cy="30" r="5" style="fill:var(--c2)" opacity=".55"/><circle cx="78" cy="26" r="4" style="fill:var(--c2)" opacity=".55"/><circle cx="88" cy="44" r="3" style="fill:var(--c2)" opacity=".55"/>`,
    rosto: { olhos: [[44, 58], [76, 58]], r: 12, pr: 6.5, boca: [60, 80] },
  }),
};
function desenharBicho(chave, humor = "feliz", classe = "") {
  const id = "bichoGrad" + (++lumiId);
  const b = BICHOS[chave](id, humor);
  return `<svg class="lumi bicho bicho-${chave} humor-${humor} ${classe}" viewBox="0 0 120 130" aria-hidden="true">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" style="stop-color:var(--c1)"/><stop offset="1" style="stop-color:color-mix(in srgb, var(--c1) 70%, #000)"/>
    </linearGradient></defs>
    <ellipse cx="60" cy="125" rx="30" ry="4.5" class="lumi-sombra"/>
    <g class="lumi-corpo">${b.atras || ""}<path d="${b.corpo}" fill="url(#${id})"/>${b.frente || ""}${rostoMascote(humor, b.rosto)}</g>
  </svg>`;
}

// Kiko: um papagaio com as cores da bandeira do idioma
function desenharKiko(humor = "feliz", classe = "") {
  const id = "kikoGrad" + (++lumiId);
  const sobrancelhas = {
    triste: '<path d="M30 42 Q42 38 53 45" class="kiko-traco"/><path d="M90 42 Q78 38 67 45" class="kiko-traco"/>',
    uau: '<path d="M31 38 Q43 32 54 38" class="kiko-traco"/><path d="M89 38 Q77 32 66 38" class="kiko-traco"/>',
    festa: "", feliz: "",
  };
  const bico = (humor === "festa" || humor === "uau")
    ? `<path d="M50 72 Q60 ${humor === "festa" ? 96 : 88} 70 72 Z" fill="#7A1F2B"/><path d="M53 76 Q60 ${humor === "festa" ? 90 : 84} 67 76" fill="#FF6B81"/>
       <path d="M47 64 Q60 54 73 64 Q67 74 60 76 Q53 74 47 64Z" class="kiko-bico"/>`
    : `<path d="M47 64 Q60 54 73 64 Q68 80 60 86 Q52 80 47 64Z" class="kiko-bico"/>
       <path d="M53 74 Q60 ${humor === "triste" ? 72 : 79} 67 74" class="kiko-boca"/>`;
  return `<svg class="lumi kiko humor-${humor} ${classe}" viewBox="0 0 120 130" aria-hidden="true">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" style="stop-color:var(--c1)"/><stop offset="1" style="stop-color:color-mix(in srgb, var(--c1) 72%, #000)"/>
    </linearGradient></defs>
    <ellipse cx="60" cy="125" rx="30" ry="4.5" class="lumi-sombra"/>
    <g class="lumi-corpo">
      <path d="M50 100 L41 127 L54 119 L60 129 L66 119 L79 127 L70 100Z" class="kiko-cauda"/>
      <path d="M55 24 C47 7 34 6 28 13 C39 12 45 19 49 28Z" class="kiko-crista"/>
      <path d="M62 22 C62 5 73 0 82 5 C73 8 69 15 67 26Z" class="kiko-crista"/>
      <path d="M60 18 C90 18 106 44 104 72 C102 100 84 116 60 116 C36 116 18 100 16 72 C14 44 30 18 60 18Z" fill="url(#${id})"/>
      <ellipse cx="60" cy="94" rx="25" ry="19" fill="#fff" opacity=".22"/>
      <path d="M21 60 C6 74 8 98 27 108 C24 92 28 76 33 64Z" class="kiko-asa esq"/>
      <path d="M99 60 C114 74 112 98 93 108 C96 92 92 76 87 64Z" class="kiko-asa dir"/>
      <g class="lumi-olho"><ellipse cx="43" cy="55" rx="15" ry="14" fill="#fff"/><circle class="pupila" cx="44" cy="56" r="7" fill="#1b1530"/></g>
      <g class="lumi-olho"><ellipse cx="77" cy="55" rx="15" ry="14" fill="#fff"/><circle class="pupila" cx="76" cy="56" r="7" fill="#1b1530"/></g>
      <circle cx="47" cy="52" r="2.2" fill="#fff"/><circle cx="79" cy="52" r="2.2" fill="#fff"/>
      ${sobrancelhas[humor] || ""}
      <circle cx="27" cy="73" r="6" fill="#ff7aa8" opacity=".55"/><circle cx="93" cy="73" r="6" fill="#ff7aa8" opacity=".55"/>
      ${bico}
      <path d="M49 114 l-5 8 M49 114 l0 9 M49 114 l5 8 M71 114 l-5 8 M71 114 l0 9 M71 114 l5 8" class="kiko-pes"/>
    </g>
  </svg>`;
}

// Lumi: a bolinha da versão anterior (continua disponível no perfil)
function desenharLumi(humor = "feliz", classe = "") {
  const id = "lumiGrad" + (++lumiId);
  const bocas = {
    feliz: '<path d="M46 80 Q60 93 74 80" class="lumi-boca"/>',
    triste: '<path d="M48 88 Q60 78 72 88" class="lumi-boca"/>',
    uau: '<ellipse cx="60" cy="84" rx="7" ry="8" class="lumi-boca cheia"/>',
    festa: '<path d="M44 78 Q60 100 76 78 Z" class="lumi-boca cheia"/>',
  };
  return `<svg class="lumi ${classe}" viewBox="0 0 120 130" aria-hidden="true">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" style="stop-color:var(--c1)"/><stop offset="1" style="stop-color:var(--c2)"/>
    </linearGradient></defs>
    <ellipse cx="60" cy="125" rx="32" ry="4.5" class="lumi-sombra"/>
    <g class="lumi-corpo">
      <path d="M60 17 Q63 3 77 2 Q72 11 65 18" class="lumi-folha"/>
      <path d="M60 16 C92 16 110 40 110 70 C110 100 90 118 60 118 C30 118 10 100 10 70 C10 40 28 16 60 16Z" fill="url(#${id})"/>
      <ellipse cx="60" cy="94" rx="30" ry="19" fill="#fff" opacity=".2"/>
      <g class="lumi-olho"><circle cx="42" cy="60" r="14" fill="#fff"/><circle class="pupila" cx="42" cy="60" r="6.5" fill="#1b1530"/></g>
      <g class="lumi-olho"><circle cx="78" cy="60" r="14" fill="#fff"/><circle class="pupila" cx="78" cy="60" r="6.5" fill="#1b1530"/></g>
      <circle cx="29" cy="80" r="6" fill="#ff7aa8" opacity=".6"/><circle cx="91" cy="80" r="6" fill="#ff7aa8" opacity=".6"/>
      ${bocas[humor] || bocas.feliz}
    </g>
  </svg>`;
}
// Os olhos da Lumi seguem o mouse ou o dedo
let olharPendente = false, ponteiroX = 0, ponteiroY = 0;
addEventListener("pointermove", e => {
  ponteiroX = e.clientX; ponteiroY = e.clientY;
  if (olharPendente) return;
  olharPendente = true;
  requestAnimationFrame(() => {
    olharPendente = false;
    $$(".lumi .pupila").forEach(p => {
      const svg = p.ownerSVGElement;
      const r = svg.getBoundingClientRect();
      if (!r.width) return;
      const k = r.width / 120;
      const cx = r.left + +p.getAttribute("cx") * k, cy = r.top + +p.getAttribute("cy") * k;
      const dx = ponteiroX - cx, dy = ponteiroY - cy;
      const d = Math.hypot(dx, dy) || 1, m = Math.min(5, d / 25);
      p.style.transform = `translate(${(dx / d) * m}px, ${(dy / d) * m}px)`;
    });
  });
});

// ---------- Atalhos de teclado da tela atual ----------
let teclas = null;
document.addEventListener("keydown", e => { if (teclas) teclas(e); });

function render(html) {
  teclas = null;
  app.innerHTML = `<div class="tela">${html}</div>`;
  window.scrollTo(0, 0);
}
