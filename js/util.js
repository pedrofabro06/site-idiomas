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
const MASCOTES = {
  kiko: { nome: "Kiko", desc: "o papagaio poliglota", apresentacao: "Oi! Eu sou o Kiko.<br>Papagaio que fala 5 idiomas!" },
  lumi: { nome: "Lumi", desc: "a bolinha simpática", apresentacao: "Oi! Eu sou a Lumi.<br>Mudo de cor com o idioma!" },
};
const nomeMascote = () => (MASCOTES[E.mascote] || MASCOTES.kiko).nome;
let lumiId = 0;
function lumi(humor = "feliz", classe = "") {
  return (typeof E !== "undefined" && E.mascote === "lumi") ? desenharLumi(humor, classe) : desenharKiko(humor, classe);
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
