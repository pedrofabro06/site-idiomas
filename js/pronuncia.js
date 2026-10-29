// ============================================================
//  Pronúncia: o aluno fala, o navegador transcreve e o site
//  compara palavra por palavra com a frase certa.
//  (Funciona no Chrome e no Edge; precisa de microfone.)
// ============================================================
function ouvirFala() {
  return new Promise((resolve, reject) => {
    if (!Reconhecimento) return reject("sem-suporte");
    const r = new Reconhecimento();
    r.lang = IDIOMAS[E.idioma].voz;
    r.interimResults = false;
    r.maxAlternatives = 4;
    let ok = false;
    r.onresult = e => { ok = true; resolve([...e.results[0]].map(a => a.transcript)); };
    r.onerror = e => { if (!ok) { ok = true; reject(e.error || "erro"); } };
    r.onend = () => { if (!ok) reject("no-speech"); };
    try { r.start(); } catch { reject("ocupado"); }
  });
}
const MSG_ERRO_FALA = {
  "sem-suporte": "Seu navegador não reconhece fala. Use o Chrome ou o Edge.",
  "not-allowed": "O microfone está bloqueado. Libere o acesso no cadeado ao lado do endereço do site.",
  "service-not-allowed": "O microfone está bloqueado. Libere o acesso no cadeado ao lado do endereço do site.",
  "no-speech": "Não ouvi nada. Toque no microfone e fale logo em seguida.",
  "audio-capture": "Nenhum microfone encontrado.",
  "network": "O reconhecimento de voz precisa de internet.",
  "ocupado": "O microfone já está ouvindo. Tente de novo em um segundo.",
};

// Nota de 0 a 100 e nota de cada palavra
function avaliarFala(textoAlvo, transcricao) {
  const ditas = normalizar(transcricao).split(" ").filter(Boolean);
  const usadas = new Set();
  const palavras = fichas(textoAlvo).map(orig => {
    const partes = normalizar(orig).split(" ").filter(Boolean);
    let soma = 0;
    partes.forEach(parte => {
      let melhor = 0, idx = -1;
      ditas.forEach((d, j) => {
        if (usadas.has(j)) return;
        const s = similaridade(parte, d);
        if (s > melhor) { melhor = s; idx = j; }
      });
      if (idx >= 0 && melhor >= 0.5) usadas.add(idx);
      soma += melhor;
    });
    return { orig, nota: partes.length ? soma / partes.length : 0 };
  });
  const media = palavras.reduce((s, p) => s + p.nota, 0) / Math.max(1, palavras.length);
  // Palavras a mais ditas pelo aluno tiram um pouco de nota
  const sobra = Math.max(0, ditas.length - usadas.size);
  const nota = Math.max(0, Math.round(media * 100 - sobra * 4));
  return { nota, palavras };
}
function melhorAvaliacao(textoAlvo, alternativas) {
  return alternativas.map(a => ({ dito: a, ...avaliarFala(textoAlvo, a) })).sort((x, y) => y.nota - x.nota)[0];
}
function mensagemNota(n) {
  if (n >= 90) return "Pronúncia excelente! 🌟";
  if (n >= 75) return "Muito bom! 👏";
  if (n >= 50) return "Quase lá! Ouça de novo e repita 💪";
  return "Vamos de novo. Ouça devagar com a tartaruga 🐢";
}
function guardarNotaPronuncia(texto, nota) {
  const p = (E.pronuncia[E.idioma] = E.pronuncia[E.idioma] || {});
  p[texto] = Math.max(p[texto] || 0, nota);
  if (nota >= 80) contar("fala");
  salvar();
}

// Componente reutilizável: frase + ouvir + falar + resultado colorido
function painelPronuncia(texto, traducao = "", { aoAvaliar } = {}) {
  const box = el(`<div class="pronuncia">
    <div class="pr-frase">${fichas(texto).map(f => `<span class="pr-palavra">${esc(f)}</span>`).join(" ")}</div>
    ${traducao ? `<p class="pr-trad">“${esc(traducao)}”</p>` : ""}
    <div class="pr-botoes">
      <button class="som-btn" data-a="ouvir" title="Ouvir">🔊</button>
      <button class="som-btn lento" data-a="lento" title="Ouvir devagar">🐢</button>
      <button class="mic pequeno" data-a="falar"><span>🎤</span><b>Falar</b></button>
    </div>
    <div class="pr-resultado"></div>
  </div>`);
  const res = $(".pr-resultado", box), mic = $('[data-a="falar"]', box);
  $('[data-a="ouvir"]', box).onclick = () => falar(texto);
  $('[data-a="lento"]', box).onclick = () => falar(texto, true);
  if (!Reconhecimento) {
    mic.disabled = true;
    res.innerHTML = `<p class="pr-aviso">${MSG_ERRO_FALA["sem-suporte"]}</p>`;
  }
  mic.onclick = async () => {
    if (mic.classList.contains("ouvindo")) return;
    window.speechSynthesis?.cancel();
    mic.classList.add("ouvindo");
    $("b", mic).textContent = "Ouvindo...";
    res.innerHTML = "";
    try {
      const alts = await ouvirFala();
      const r = melhorAvaliacao(texto, alts);
      $$(".pr-palavra", box).forEach((s, i) => {
        const n = r.palavras[i] ? r.palavras[i].nota : 0;
        s.className = "pr-palavra " + (n >= 0.8 ? "boa" : n >= 0.55 ? "media" : "ruim");
      });
      const cor = r.nota >= 75 ? "boa" : r.nota >= 50 ? "media" : "ruim";
      res.innerHTML = `<div class="pr-nota ${cor}"><b>${r.nota}%</b><span>${mensagemNota(r.nota)}</span></div>
        <p class="pr-dito">Ouvi: “${esc(r.dito)}”</p>`;
      som(r.nota >= 75 ? "certo" : r.nota >= 50 ? "pop" : "errado");
      if (r.nota >= 90) confetes(30);
      guardarNotaPronuncia(texto, r.nota);
      if (aoAvaliar) aoAvaliar(r);
    } catch (erro) {
      res.innerHTML = `<p class="pr-aviso">${MSG_ERRO_FALA[erro] || "Não consegui ouvir. Tente de novo."}</p>`;
    } finally {
      mic.classList.remove("ouvindo");
      $("b", mic).textContent = "Falar de novo";
    }
  };
  return box;
}

function abrirPronuncia(texto, traducao = "") {
  const m = abrirModal(`<h2>🎤 Pratique a pronúncia</h2>
    <p class="sub">Ouça, toque no microfone e repita. Cada palavra fica verde, amarela ou vermelha.</p>
    <div id="mPron"></div>
    <div class="acoes"><button class="btn secundario" data-fechar>Fechar</button></div>`, { classe: "larga" });
  $("#mPron", m.el).appendChild(painelPronuncia(texto, traducao));
  setTimeout(() => falar(texto), 300);
}
function botaoPronunciar(texto, traducao = "", rotulo = "🎤") {
  const b = el(`<button class="som-btn mic-btn" type="button" title="Praticar pronúncia">${rotulo}</button>`);
  b.onclick = e => { e.stopPropagation(); abrirPronuncia(texto, traducao); };
  return b;
}

// ---------- Laboratório de pronúncia (shadowing) ----------
let abaPronuncia = "unidade"; // "unidade" (palavras da trilha) ou "sons" (guia dos sons difíceis)
function telaPronuncia(temaId) {
  const liberados = TEMAS.filter((t, i) => temaDesbloqueado(i));
  const tema = TEMAS.find(t => t.id === temaId) || liberados[liberados.length - 1] || TEMAS[0];
  const notas = E.pronuncia[E.idioma] || {};
  const itens = [...tema.palavras.map(p => ({ t: alvo(p), pt: p[0], e: p[6] })), ...tema.frases.map(f => ({ t: alvo(f), pt: f[0], e: "💬" }))];
  const sons = GUIA_SONS[E.idioma] || [];
  const verSons = abaPronuncia === "sons" && sons.length;
  render(`
    <button class="voltar" id="pVoltar">← Praticar</button>
    <section class="secao-topo">
      <div><span class="selo">🎤 Laboratório de pronúncia</span>
      <h1>Fale e veja sua <span class="destaque">nota</span></h1>
      <p class="sub">Técnica <b>shadowing</b>: ouça a voz nativa, repita na hora imitando o ritmo e a entonação. O site mostra quais palavras saíram certas.</p></div>
      ${lumi("uau", "media flutua")}
    </section>
    <div class="abas-trilha">
      <button class="aba ${verSons ? "" : "on"}" data-pa="unidade">📚 Palavras da unidade <small>com nota em cada palavra</small></button>
      <button class="aba ${verSons ? "on" : ""}" data-pa="sons">🗣️ Sons difíceis <small>${sons.length} sons que pegam brasileiros</small></button>
    </div>
    ${Reconhecimento ? "" : `<p class="aviso-faixa">${MSG_ERRO_FALA["sem-suporte"]}</p>`}
    ${verSons ? `
    <p class="sub">Os sons em que quem fala português mais tropeça em ${IDIOMAS[E.idioma].nome.toLowerCase()}. Abra um, leia a dica, ouça 🔊 os exemplos e treine 🎤 com nota.</p>
    <div class="sons-lista">${sons.map(([titulo, explicacao, exemplos], i) => `
      <details class="som-card" ${i === 0 ? "open" : ""}>
        <summary><span class="som-num">${i + 1}</span><b>${esc(titulo)}</b></summary>
        <p>${esc(explicacao)}</p>
        <div class="som-exemplos">${exemplos.map((x, j) => `<button class="chip-som" data-s="${i}" data-x="${j}">🔊 ${esc(x)}</button>`).join("")}</div>
        <button class="btn secundario pequeno" data-treinar="${i}">🎤 Treinar com nota</button>
      </details>`).join("")}</div>` : `
    <div class="linha-filtro">
      <label for="pTema"><b>Unidade:</b></label>
      <select id="pTema" class="campo pequeno">${TEMAS.map((t, i) => `<option value="${t.id}" ${t.id === tema.id ? "selected" : ""} ${temaDesbloqueado(i) ? "" : "disabled"}>${t.nivel} · ${t.icone} ${t.titulo}${temaDesbloqueado(i) ? "" : " 🔒"}</option>`).join("")}</select>
      <button class="btn" id="pShadow">▶ Modo shadowing</button>
    </div>
    <div class="lista-pron">${itens.map((it, i) => `
      <button class="item-pron" data-i="${i}">
        <span class="ip-emoji">${it.e}</span>
        <span class="ip-txt"><b>${esc(it.t)}</b><small>${esc(it.pt)}</small></span>
        <span class="ip-nota ${notas[it.t] >= 75 ? "boa" : notas[it.t] >= 50 ? "media" : notas[it.t] ? "ruim" : ""}">${notas[it.t] ? notas[it.t] + "%" : "🎤"}</span>
      </button>`).join("")}</div>`}`);
  $("#pVoltar").onclick = () => ir("praticar");
  $$("[data-pa]").forEach(b => b.onclick = () => { abaPronuncia = b.dataset.pa; telaPronuncia(tema.id); });
  if (verSons) {
    $$(".chip-som").forEach(b => b.onclick = () => falar(sons[+b.dataset.s][2][+b.dataset.x]));
    $$("[data-treinar]").forEach(b => b.onclick = () => {
      const [titulo, , exemplos] = sons[+b.dataset.treinar];
      shadowing(exemplos.map(x => ({ t: x, pt: "", e: "🗣️" })), { icone: "🗣️", titulo });
    });
    return;
  }
  $("#pTema").onchange = e => telaPronuncia(e.target.value);
  $$(".item-pron").forEach(b => b.onclick = () => { const it = itens[+b.dataset.i]; abrirPronuncia(it.t, it.pt); });
  $("#pShadow").onclick = () => shadowing(itens, tema);
}

function shadowing(itens, tema) {
  let pos = 0, soma = 0, feitos = 0;
  const m = abrirModal(`<h2>▶ Shadowing · ${tema.icone} ${tema.titulo}</h2><p class="sub" id="shInfo"></p><div id="shCorpo"></div>
    <div class="acoes"><button class="btn secundario" data-fechar>Parar</button><button class="btn" id="shProx">Próxima →</button></div>`,
    { classe: "larga", aoFechar: () => { if (feitos) toast("🎤", `Média de pronúncia: ${Math.round(soma / feitos)}%`, `${feitos} frase${feitos > 1 ? "s" : ""} praticada${feitos > 1 ? "s" : ""}.`); } });
  function mostrar() {
    const it = itens[pos];
    $("#shInfo", m.el).textContent = `${pos + 1} de ${itens.length} · ouça e repita logo em seguida`;
    const corpo = $("#shCorpo", m.el);
    corpo.innerHTML = "";
    corpo.appendChild(painelPronuncia(it.t, it.pt, { aoAvaliar: r => { soma += r.nota; feitos++; } }));
    setTimeout(() => falar(it.t), 300);
  }
  $("#shProx", m.el).onclick = () => { pos = (pos + 1) % itens.length; mostrar(); };
  mostrar();
}
