// ---------- Progresso salvo no navegador ----------
const CHAVE = "poliglota-progresso";
function carregar() {
  try { return JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch { return {}; }
}
let prog = Object.assign({ xp: 0, streak: 0, ultimoDia: null, idioma: null, aprendidas: {} }, carregar());
if (prog.idioma && !IDIOMAS[prog.idioma]) prog.idioma = null;

function salvar() {
  try { localStorage.setItem(CHAVE, JSON.stringify(prog)); } catch {}
  atualizarTopo();
}
function hoje() { return new Date().toLocaleDateString("sv"); }
function registrarEstudo(pontos) {
  const h = hoje();
  if (prog.ultimoDia !== h) {
    const ontem = new Date(Date.now() - 864e5).toLocaleDateString("sv");
    prog.streak = prog.ultimoDia === ontem ? prog.streak + 1 : 1;
    prog.ultimoDia = h;
    pular("streak-box");
  }
  prog.xp += pontos;
  salvar();
}
function ganharXP(pontos) { prog.xp += pontos; salvar(); pular("xp-box"); }
function marcarAprendida(temaId, indice) {
  const k = prog.idioma + ":" + temaId;
  const lista = new Set(prog.aprendidas[k] || []);
  lista.add(indice);
  prog.aprendidas[k] = [...lista];
}
function percentual(temaId, idioma = prog.idioma) {
  const tema = TEMAS.find(t => t.id === temaId);
  const n = (prog.aprendidas[idioma + ":" + temaId] || []).length;
  return Math.round((n / tema.palavras.length) * 100);
}
function percentualIdioma(idioma) {
  const total = TEMAS.reduce((s, t) => s + percentual(t.id, idioma), 0);
  return Math.round(total / TEMAS.length);
}
function atualizarTopo() {
  document.getElementById("xp").textContent = prog.xp;
  document.getElementById("streak").textContent = prog.streak;
}
function pular(id) {
  const e = document.getElementById(id);
  e.classList.remove("pulo"); void e.offsetWidth; e.classList.add("pulo");
}

// ---------- Utilidades ----------
const app = document.getElementById("app");
const embaralhar = arr => arr.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(v => v[1]);
const traducao = p => p[IDIOMAS[prog.idioma].col];
let teclas = null; // atalhos de teclado da tela atual

function aplicarTema() {
  if (prog.idioma) document.body.dataset.idioma = prog.idioma;
  else delete document.body.dataset.idioma;
}
function falar(texto) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = IDIOMAS[prog.idioma].voz;
  u.rate = 0.9;
  speechSynthesis.speak(u);
}
function normalizar(s) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss").replace(/[¿?¡!.,'’]/g, "").replace(/\s+/g, " ").trim();
}
function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
function render(html) {
  teclas = null;
  app.innerHTML = `<div class="tela">${html}</div>`;
  window.scrollTo(0, 0);
}
function confetes(qtd = 40) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const s = getComputedStyle(document.body);
  const cores = ["--c1", "--c2", "--c3", "--certo"].map(v => s.getPropertyValue(v).trim());
  for (let i = 0; i < qtd; i++) {
    const c = document.createElement("div");
    c.className = "confete";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = cores[i % cores.length];
    c.style.animationDuration = 1.6 + Math.random() * 1.6 + "s";
    c.style.animationDelay = Math.random() * 0.3 + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3600);
  }
}
document.addEventListener("keydown", e => {
  if (teclas && !e.target.matches("input")) teclas(e);
});

// ---------- Telas ----------
function telaIdiomas() {
  prog.idioma = null; salvar(); aplicarTema();
  render(`
    <h1>Qual idioma você quer <span class="destaque">aprender hoje?</span></h1>
    <p class="sub">Cada idioma tem suas próprias cores. Escolha um para começar.</p>
    <div class="grade" id="lista"></div>`);
  const lista = app.querySelector("#lista");
  Object.entries(IDIOMAS).forEach(([cod, i], n) => {
    const p = percentualIdioma(cod);
    const b = el(`<button class="opcao idioma" style="background:linear-gradient(135deg,${i.cores[0]},${i.cores[1]});animation-delay:${n * 70}ms">
      <span class="icone">${i.bandeira}</span>
      <span class="nome">${i.nome}</span>
      <span class="info">${p ? p + "% concluído" : i.frase}</span>
    </button>`);
    b.onclick = () => { prog.idioma = cod; salvar(); aplicarTema(); telaTemas(); };
    lista.appendChild(b);
  });
}

function telaTemas() {
  aplicarTema();
  const i = IDIOMAS[prog.idioma];
  render(`
    <button class="voltar" id="trocar">← Trocar idioma</button>
    <h1>${i.bandeira} <span class="destaque">${i.nome}</span></h1>
    <p class="sub">${i.frase} Escolha um tema para estudar.</p>
    <div class="grade" id="temas"></div>`);
  app.querySelector("#trocar").onclick = telaIdiomas;
  const grade = app.querySelector("#temas");
  TEMAS.forEach((t, n) => {
    const p = percentual(t.id);
    const b = el(`<button class="opcao" style="animation-delay:${n * 60}ms">
      <span class="icone">${t.icone}</span>
      <span class="nome">${t.titulo} ${p === 100 ? "🏅" : ""}</span>
      <span class="info">${t.palavras.length} palavras · ${p}% aprendido</span>
      <div class="barra"><div style="width:${p}%"></div></div>
    </button>`);
    b.onclick = () => telaTema(t);
    grade.appendChild(b);
  });
}

function telaTema(tema) {
  render(`
    <button class="voltar" id="voltar">← Temas</button>
    <h1>${tema.icone} <span class="destaque">${tema.titulo}</span></h1>
    <p class="sub">Como você quer praticar?</p>
    <div class="modos">
      <button class="opcao" data-m="flash"><span class="icone">🃏</span><span class="nome">Flashcards</span><span class="info">Vire e ouça as palavras</span></button>
      <button class="opcao" data-m="quiz" style="animation-delay:60ms"><span class="icone">🎯</span><span class="nome">Múltipla escolha</span><span class="info">Escolha a tradução certa</span></button>
      <button class="opcao" data-m="escrever" style="animation-delay:120ms"><span class="icone">⌨️</span><span class="nome">Escrever</span><span class="info">Digite a tradução</span></button>
      <button class="opcao" data-m="ouvir" style="animation-delay:180ms"><span class="icone">🎧</span><span class="nome">Ouvir</span><span class="info">Ouça e adivinhe</span></button>
    </div>
    <h2>Vocabulário · toque para ouvir</h2>
    <div class="grade" id="vocab"></div>`);
  app.querySelector("#voltar").onclick = telaTemas;
  const modos = { flash: flashcards, quiz, escrever, ouvir };
  app.querySelectorAll("[data-m]").forEach(b => { b.onclick = () => modos[b.dataset.m](tema); });
  const vocab = app.querySelector("#vocab");
  const aprendidas = new Set(prog.aprendidas[prog.idioma + ":" + tema.id] || []);
  tema.palavras.forEach((p, i) => {
    const b = el(`<button class="opcao chip-vocab" style="animation-delay:${i * 40}ms">
      <span class="nome">${traducao(p)} ${aprendidas.has(i) ? "✅" : "🔊"}</span><span class="info">${p[0]}</span></button>`);
    b.onclick = () => falar(traducao(p));
    vocab.appendChild(b);
  });
}

// Flashcards: clique ou espaço para virar, setas para navegar
function flashcards(tema) {
  const cartas = embaralhar(tema.palavras);
  let pos = 0;
  function mostrar() {
    const p = cartas[pos];
    render(`
      <button class="voltar" id="voltar">← ${tema.titulo}</button>
      <p class="contador">${pos + 1} de ${cartas.length} · clique ou aperte espaço para virar</p>
      <div class="barra"><div style="width:${((pos + 1) / cartas.length) * 100}%"></div></div>
      <div class="flash" id="carta"><div class="flash-interno">
        <div class="face">${p[0]}<small>Português</small></div>
        <div class="face verso">${traducao(p)}<small>${IDIOMAS[prog.idioma].bandeira} ${IDIOMAS[prog.idioma].nome}</small></div>
      </div></div>
      <div class="acoes">
        ${pos > 0 ? `<button class="btn secundario" id="ant">← Anterior</button>` : ""}
        <button class="btn secundario" id="ouvir">🔊 Ouvir</button>
        <button class="btn" id="prox">${pos < cartas.length - 1 ? "Próxima →" : "Concluir 🎉"}</button>
      </div>`);
    const carta = app.querySelector("#carta");
    const virar = () => {
      carta.classList.toggle("virado");
      if (carta.classList.contains("virado")) falar(traducao(p));
    };
    const prox = () => {
      if (pos < cartas.length - 1) { pos++; mostrar(); }
      else { registrarEstudo(5); confetes(); resultado(tema, null, "Você revisou todas as palavras! +5 XP"); }
    };
    const ant = () => { if (pos > 0) { pos--; mostrar(); } };
    carta.onclick = virar;
    app.querySelector("#ouvir").onclick = () => falar(traducao(p));
    app.querySelector("#voltar").onclick = () => telaTema(tema);
    app.querySelector("#prox").onclick = prox;
    if (pos > 0) app.querySelector("#ant").onclick = ant;
    teclas = e => {
      if (e.key === " ") { e.preventDefault(); virar(); }
      else if (e.key === "ArrowRight" || e.key === "Enter") prox();
      else if (e.key === "ArrowLeft") ant();
    };
  }
  mostrar();
}

// Motor comum dos exercícios com pontuação e sequência de acertos
function exercicio(tema, montarRodada) {
  const rodadas = embaralhar(tema.palavras.map((p, i) => ({ p, i })));
  let pos = 0, acertos = 0, combo = 0, melhorCombo = 0, xpGanho = 0;
  function proxima() {
    if (pos >= rodadas.length) {
      salvar();
      registrarEstudo(0);
      if (acertos >= rodadas.length / 2) confetes(acertos === rodadas.length ? 120 : 50);
      return resultado(tema, { acertos, total: rodadas.length, melhorCombo, xpGanho });
    }
    const atual = rodadas[pos];
    render(`
      <button class="voltar" id="voltar">← ${tema.titulo}</button>
      <p class="contador">Pergunta ${pos + 1} de ${rodadas.length} · ${acertos} acertos
        ${combo >= 2 ? `<span class="combo">🔥 ${combo} seguidas</span>` : ""}</p>
      <div class="barra"><div style="width:${(pos / rodadas.length) * 100}%"></div></div>
      <div id="area"></div>
      <div class="feedback" id="fb"></div>
      <div class="acoes" id="acoes"></div>`);
    app.querySelector("#voltar").onclick = () => telaTema(tema);
    montarRodada(app.querySelector("#area"), atual, (certo, correta) => {
      const fb = app.querySelector("#fb");
      const caixa = app.querySelector(".pergunta");
      if (certo) {
        acertos++; combo++; melhorCombo = Math.max(melhorCombo, combo);
        const pontos = 10 + Math.min(combo - 1, 5) * 2; // bônus por sequência
        marcarAprendida(tema.id, atual.i);
        xpGanho += pontos; ganharXP(pontos);
        fb.className = "feedback ok";
        fb.textContent = ["Correto! 🎉", "Mandou bem! ✨", "Isso aí! 🙌", "Perfeito! 💯"][Math.floor(Math.random() * 4)] + ` +${pontos} XP`;
        caixa.classList.add("brilhar");
        if (combo % 3 === 0) confetes(25);
      } else {
        combo = 0;
        fb.className = "feedback nao";
        fb.textContent = "Quase! A resposta certa é: " + correta;
        caixa.classList.add("tremer");
      }
      falar(traducao(atual.p));
      const b = el(`<button class="btn">Continuar →</button>`);
      b.onclick = () => { pos++; proxima(); };
      app.querySelector("#acoes").appendChild(b);
      b.focus();
      teclas = e => { if (e.key === "Enter") { e.preventDefault(); b.click(); } };
    });
  }
  proxima();
}

function opcoesDe(tema, atual, coluna) {
  const correta = atual.p[coluna];
  const erradas = embaralhar(tema.palavras.filter(p => p[coluna] !== correta)).slice(0, 3);
  return embaralhar([atual.p, ...erradas]).map(p => p[coluna]);
}

function botoesResposta(area, opcoes, correta, responder) {
  const box = el(`<div class="respostas"></div>`);
  const botoes = opcoes.map((texto, n) => {
    const b = el(`<button class="resposta"><span class="tecla">${n + 1}</span><span class="txt"></span></button>`);
    b.querySelector(".txt").textContent = texto;
    b.onclick = () => {
      box.querySelectorAll("button").forEach(x => {
        x.disabled = true;
        if (x.querySelector(".txt").textContent === correta) x.classList.add("certa");
      });
      if (texto !== correta) b.classList.add("errada");
      responder(texto === correta, correta);
    };
    box.appendChild(b);
    return b;
  });
  area.appendChild(box);
  teclas = e => { const n = parseInt(e.key, 10); if (n >= 1 && n <= botoes.length) botoes[n - 1].click(); };
}

function quiz(tema) {
  exercicio(tema, (area, atual, responder) => {
    area.innerHTML = `<div class="pergunta"><small>Como se diz em ${IDIOMAS[prog.idioma].nome}?</small>${atual.p[0]}</div>`;
    botoesResposta(area, opcoesDe(tema, atual, IDIOMAS[prog.idioma].col), traducao(atual.p), responder);
  });
}

function ouvir(tema) {
  exercicio(tema, (area, atual, responder) => {
    area.innerHTML = `<div class="pergunta"><small>Ouça e escolha o significado</small>
      <button class="falar-grande" id="tocar" title="Ouvir de novo">🔊</button></div>`;
    area.querySelector("#tocar").onclick = () => falar(traducao(atual.p));
    setTimeout(() => falar(traducao(atual.p)), 300);
    botoesResposta(area, opcoesDe(tema, atual, 0), atual.p[0], responder);
  });
}

function escrever(tema) {
  exercicio(tema, (area, atual, responder) => {
    area.innerHTML = `
      <div class="pergunta"><small>Escreva em ${IDIOMAS[prog.idioma].nome}</small>${atual.p[0]}</div>
      <form id="f"><input class="campo" id="campo" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Digite aqui...">
      <div class="acoes"><button class="btn" type="submit">Verificar</button></div></form>
      <p class="contador">Acentos e maiúsculas não contam.</p>`;
    const campo = area.querySelector("#campo");
    campo.focus();
    area.querySelector("#f").onsubmit = e => {
      e.preventDefault();
      if (!campo.value.trim()) return;
      campo.disabled = true;
      area.querySelector("button[type=submit]").remove();
      responder(normalizar(campo.value) === normalizar(traducao(atual.p)), traducao(atual.p));
    };
  });
}

function resultado(tema, placar, msg) {
  const emoji = !placar ? "🎉" : placar.acertos === placar.total ? "🏆" : placar.acertos >= placar.total / 2 ? "👏" : "💪";
  const titulo = !placar ? "Muito bem!" : placar.acertos === placar.total ? "Perfeito!" : `${placar.acertos} de ${placar.total} acertos`;
  const detalhe = msg || `+${placar.xpGanho} XP · melhor sequência: ${placar.melhorCombo}` +
    (placar.acertos < placar.total / 2 ? "<br>Continue praticando, você chega lá!" : "");
  render(`
    <div class="resultado">
      <div class="grande">${emoji}</div>
      <h1><span class="destaque">${titulo}</span></h1>
      <p class="sub">${detalhe}</p>
      <div class="acoes">
        <button class="btn secundario" id="temas">Outros temas</button>
        <button class="btn" id="denovo">Praticar ${tema.titulo} de novo</button>
      </div>
    </div>`);
  app.querySelector("#temas").onclick = telaTemas;
  app.querySelector("#denovo").onclick = () => telaTema(tema);
}

// ---------- Início ----------
document.getElementById("marca").onclick = () => (prog.idioma ? telaTemas() : telaIdiomas());
atualizarTopo();
prog.idioma ? telaTemas() : telaIdiomas();
