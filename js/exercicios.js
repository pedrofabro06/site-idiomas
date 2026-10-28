// ============================================================
//  Lições: monta a sequência de exercícios e conduz a partida
// ============================================================
const alvo = p => p[IDIOMAS[E.idioma].col];             // palavra/frase no idioma estudado
let semMicrofone = false; // vira true quando a pessoa pede para pular a fala
const palavrasDoTema = tema => tema.palavras.map((p, i) => ({ p, i, tema }));

function distratores(w, n) {
  const a = normalizar(alvo(w.p)), pt = normalizar(w.p[0]);
  let pool = palavrasDoTema(w.tema).filter(x => normalizar(x.p[0]) !== pt && normalizar(alvo(x.p)) !== a);
  if (pool.length < n) pool = pool.concat(TEMAS.flatMap(palavrasDoTema).filter(x => x.tema !== w.tema && normalizar(alvo(x.p)) !== a));
  return sortear(pool, n);
}
// A primeira palavra da frase vem com maiúscula e entregaria a ordem; o alemão mantém (substantivos)
function minuscula(t) {
  if (E.idioma === "de" || t === "I" || /^I'/.test(t)) return t;
  return t.charAt(0).toLowerCase() + t.slice(1);
}
const fichasSemPista = frase => fichas(frase).map((t, i) => (i === 0 ? minuscula(t) : t));
function fichasExtras(frase, temas, n) {
  const usadas = new Set(fichas(alvo(frase)).map(normalizar));
  const todas = temas.flatMap(t => t.frases).filter(f => f !== frase).flatMap(f => fichasSemPista(alvo(f)));
  const unicas = [...new Map(todas.filter(t => !usadas.has(normalizar(t))).map(t => [normalizar(t), t])).values()];
  return sortear(unicas, n);
}

// ---------- Montagem da lição ----------
function montarLicao(tema, nivel) {
  const W = palavrasDoTema(tema);
  const fala = !!Reconhecimento && !semMicrofone;
  const frasesPool = embaralhar(tema.frases);
  let fi = 0;
  const proxFrase = () => frasesPool[fi++ % frasesPool.length];
  const item = (tipo, ws) => {
    if (["montar", "ditado", "completar", "falar"].includes(tipo)) return { tipo, f: proxFrase(), temas: [tema] };
    if (tipo === "letras") {
      const ok = ws.filter(w => !/\s/.test(alvo(w.p)) && alvo(w.p).length <= 10);
      if (ok.length) return { tipo, w: umDe(ok) };
      tipo = "escrever";
    }
    return { tipo, w: umDe(ws) };
  };
  const escolhaPalavra = w => ({ tipo: tema.imagens && Math.random() < 0.6 ? "imagem" : "traduzir", w });
  const lista = [];

  if (nivel === 0 || nivel === 1) {
    const novas = W.slice(nivel * 4, nivel * 4 + 4);
    novas.forEach(w => { lista.push({ tipo: "intro", w }); lista.push(escolhaPalavra(w)); });
    lista.push({ tipo: "pares", ws: novas });
    const extras = nivel === 0
      ? ["reverso", "ouvir", "letras", "traduzir", "escrever"]
      : ["escrever", "ouvir", "montar", "completar", "reverso", "letras"];
    extras.forEach(t => lista.push(item(t, nivel === 0 ? novas : W)));
    return lista;
  }
  const tipos = nivel === 2
    ? ["traduzir", "reverso", "ouvir", "escrever", "escrever", "montar", "montar", "ditado", "completar", "letras", fala ? "falar" : "ditado"]
    : ["escrever", "escrever", "escrever", "montar", "montar", "ditado", "ditado", "completar", "reverso", "letras", fala ? "falar" : "escrever"];
  tipos.forEach(t => lista.push(item(t, W)));
  const mist = embaralhar(lista);
  mist.splice(3, 0, { tipo: "pares", ws: sortear(W, 5) });
  return mist;
}

function montarTreino() {
  const liberados = TEMAS.filter((t, i) => temaDesbloqueado(i));
  const aprendidas = E.aprendidas[E.idioma] || {};
  let W = liberados.flatMap(t => palavrasDoTema(t).filter(w => (aprendidas[t.id] || []).includes(w.i)));
  if (W.length < 6) W = liberados.flatMap(palavrasDoTema).slice(0, Math.max(8, W.length));
  const tipos = ["traduzir", "reverso", "ouvir", "escrever", "montar", "letras", "completar", "imagem", "ditado"];
  const lista = sortear(tipos, 8).map(tipo => {
    if (["montar", "ditado", "completar"].includes(tipo)) {
      const t = umDe(liberados);
      return { tipo, f: umDe(t.frases), temas: liberados };
    }
    let ws = W;
    if (tipo === "imagem") ws = W.filter(w => w.tema.imagens);
    if (tipo === "letras") ws = W.filter(w => !/\s/.test(alvo(w.p)) && alvo(w.p).length <= 10);
    if (!ws.length) return { tipo: "traduzir", w: umDe(W) };
    return { tipo, w: umDe(ws) };
  });
  lista.splice(2, 0, { tipo: "pares", ws: sortear(W, Math.min(5, W.length)) });
  return lista;
}

// ---------- Partida ----------
function iniciarLicao({ tema = null, nivel = 0, treino = false } = {}) {
  atualizarVidas();
  if (!treino && E.vidas <= 0) return modalSemVidas();
  const itens = treino ? montarTreino() : montarLicao(tema, nivel);
  const S = {
    itens, pos: 0, total: itens.filter(i => i.tipo !== "intro").length, concluidos: 0,
    acertos: 0, erros: 0, combo: 0, comboMax: 0, inicio: Date.now(), treino, tema, nivel, estado: "verificar",
  };
  document.body.classList.add("em-licao");
  render(`
    <div class="licao">
      <div class="licao-topo">
        <button class="fechar" id="sair" title="Sair (Esc)">✕</button>
        <div class="barra grossa"><div id="lbarra" style="width:0%"></div></div>
        <span class="combo-chip" id="lcombo"></span>
        <span class="vidas-chip" id="lvidas">${treino ? "♾️" : "❤️ " + E.vidas}</span>
      </div>
      <div class="licao-corpo" id="lcorpo"></div>
    </div>
    <div class="licao-rodape" id="lrodape">
      <div class="rodape-interno">
        <div class="fb" id="lfb"></div>
        <div class="rodape-botoes">
          <button class="btn secundario" id="lpular" hidden>Pular</button>
          <button class="btn" id="lbtn" disabled>Verificar</button>
        </div>
      </div>
    </div>`);
  const corpo = $("#lcorpo"), btn = $("#lbtn"), rodape = $("#lrodape"), fb = $("#lfb"), btnPular = $("#lpular");
  let ctx = null;

  const sair = async () => {
    if (await confirmar("Sair da lição?", "Você vai perder o progresso desta lição.", "Sair", "Continuar estudando")) {
      window.speechSynthesis?.cancel();
      ir("trilha");
    }
  };
  $("#sair").onclick = sair;

  function atualizarBarra() {
    $("#lbarra").style.width = Math.min(100, (S.concluidos / S.total) * 100) + "%";
    const chip = $("#lcombo");
    if (S.combo >= 3) { chip.textContent = `🔥 ${S.combo}`; chip.classList.add("on"); pular(chip); }
    else chip.classList.remove("on");
  }

  function proximo() {
    if (S.pos >= S.itens.length) return fimLicao(S);
    const item = S.itens[S.pos];
    if (item.tipo === "falar" && semMicrofone) item.tipo = "ditado";
    S.estado = item.tipo === "intro" ? "neutro" : "verificar";
    corpo.innerHTML = "";
    corpo.classList.remove("travado");
    rodape.className = "licao-rodape";
    fb.innerHTML = "";
    btn.textContent = item.tipo === "intro" ? "Continuar" : "Verificar";
    btn.disabled = item.tipo !== "intro";
    btnPular.hidden = true;
    ctx = {
      verificar: null,
      tecla: null,
      pronto: b => { if (S.estado === "verificar") btn.disabled = !b; },
      concluir: r => responder(r),
      permitirPular: (rotulo, acao) => { btnPular.hidden = false; btnPular.textContent = rotulo; btnPular.onclick = acao; },
      pular: () => { S.concluidos++; S.pos++; atualizarBarra(); proximo(); },
    };
    const tela = el(`<div class="exercicio entra"></div>`);
    corpo.appendChild(tela);
    TIPOS[item.tipo](tela, item, ctx);
    teclas = e => {
      if (e.key === "Escape") return sair();
      if (e.key === "Enter") {
        if (e.target.matches("input") && S.estado === "verificar" && btn.disabled) return;
        e.preventDefault();
        if (!btn.disabled) btn.click();
        return;
      }
      if (e.target.matches("input")) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 9 && ctx.tecla && S.estado === "verificar") ctx.tecla(n);
    };
  }

  function responder({ certo, correta = "", aviso = "", falarTexto = "", significado = "" }) {
    if (S.estado !== "verificar") return;
    S.estado = "continuar";
    corpo.classList.add("travado");
    btnPular.hidden = true;
    const item = S.itens[S.pos];
    const elogios = IDIOMAS[E.idioma].elogios;
    if (certo) {
      S.acertos++; S.combo++; S.comboMax = Math.max(S.comboMax, S.combo); S.concluidos++;
      E.stats.acertos++;
      som("certo");
      if (item.w) marcarAprendida(item.w.tema.id, item.w.i);
      if (item.ws) item.ws.forEach(w => marcarAprendida(w.tema.id, w.i));
      if (item.tipo === "escrever") contar("escrita");
      if (item.tipo === "falar") contar("fala");
      rodape.className = "licao-rodape ok";
      fb.innerHTML = `<div class="fb-ic">${lumi("festa", "mini")}</div><div><b>${esc(umDe(elogios))}</b>
        ${aviso ? `<small>${aviso}</small>` : ""}${significado ? `<small>Significa: ${esc(significado)}</small>` : ""}</div>`;
      if (S.combo > 0 && S.combo % 5 === 0) { confetes(30); toast("🔥", `${S.combo} seguidas!`, "Você está pegando fogo."); }
    } else {
      S.erros++; S.combo = 0;
      E.stats.erros++;
      som("errado");
      tremer(corpo);
      if (!S.treino) { perderVida(); $("#lvidas").textContent = "❤️ " + E.vidas; pular($("#lvidas")); }
      rodape.className = "licao-rodape erro";
      fb.innerHTML = `<div class="fb-ic">${lumi("triste", "mini")}</div><div><b>Resposta correta:</b>
        <span class="fb-correta">${esc(correta)}</span>${significado ? `<small>Significa: ${esc(significado)}</small>` : ""}</div>`;
      // Errou? A questão volta no fim da lição (uma vez)
      if (!item.repetido && item.tipo !== "pares") S.itens.push(Object.assign({}, item, { repetido: true }));
      else S.concluidos++;
    }
    if (falarTexto) falar(falarTexto);
    btn.textContent = "Continuar";
    btn.disabled = false;
    btn.focus({ preventScroll: true });
    atualizarBarra();
  }

  btn.onclick = () => {
    if (S.estado === "neutro") { S.pos++; proximo(); return; }
    if (S.estado === "verificar") { if (!btn.disabled && ctx.verificar) responder(ctx.verificar()); return; }
    if (S.estado === "continuar") {
      if (!S.treino && E.vidas <= 0) return modalSemVidas(true);
      S.pos++; proximo();
    }
  };
  proximo();
}

function fimLicao(S) {
  teclas = null;
  const tempo = Math.round((Date.now() - S.inicio) / 1000);
  const precisao = Math.round((S.acertos / Math.max(1, S.acertos + S.erros)) * 100);
  const perfeita = S.erros === 0;
  const chefe = S.nivel === 3 && !S.treino;
  let xp = S.treino ? 8 : (chefe ? 20 : 10) + (perfeita ? 5 : 0) + Math.floor(S.comboMax / 5) * 2;
  let moedas = S.treino ? 3 : (perfeita ? 10 : 5) + (chefe ? 10 : 0);
  const estrelas = S.erros === 0 ? 3 : S.erros <= 2 ? 2 : 1;

  if (S.treino) ganharVidas(1);
  else {
    const p = progTema(S.tema.id);
    if (p.licao === S.nivel) p.licao++;
    p.estrelas[S.nivel] = Math.max(p.estrelas[S.nivel] || 0, estrelas);
    contar("licoes");
  }
  if (perfeita) contar("perfeitas");
  contar("combo", S.comboMax);
  E.moedas += moedas;
  ganharXP(xp);
  som("fim");
  confetes(perfeita ? 140 : 70);

  document.body.classList.remove("em-licao");
  const titulo = S.treino ? "Treino concluído!" : chefe ? "Unidade dominada! 👑" : perfeita ? "Lição perfeita!" : "Lição concluída!";
  render(`
    <div class="fim">
      ${lumi("festa", "grande pulando")}
      <h1><span class="destaque">${titulo}</span></h1>
      ${S.treino ? `<p class="sub">Você recuperou 1 ❤️ e reforçou o que já aprendeu.</p>` :
        `<div class="estrelas">${[1, 2, 3].map(n => `<span class="${n <= estrelas ? "on" : ""}" style="animation-delay:${n * 150}ms">★</span>`).join("")}</div>`}
      <div class="placar">
        <div class="placa amarela"><small>XP ganho</small><b>⚡ ${xp}</b></div>
        <div class="placa verde"><small>Precisão</small><b>🎯 ${precisao}%</b></div>
        <div class="placa azul"><small>Tempo</small><b>⏱️ ${formatarTempo(tempo)}</b></div>
        <div class="placa laranja"><small>Moedas</small><b>🪙 ${moedas}</b></div>
      </div>
      ${S.comboMax >= 3 ? `<p class="sub">Melhor sequência: 🔥 ${S.comboMax}</p>` : ""}
      ${chefe ? `<p class="sub">Um baú apareceu no fim da unidade. Vá abrir! 🎁</p>` : ""}
      <div class="acoes"><button class="btn grande" id="fimOk">Continuar</button></div>
    </div>`);
  $("#fimOk").onclick = () => ir("trilha");
  $("#fimOk").focus();
  teclas = e => { if (e.key === "Enter") ir("trilha"); };
}

function modalSemVidas(naLicao = false) {
  atualizarVidas();
  const min = Math.ceil(proximaVidaEm() / 60000);
  const m = abrirModal(`
    <div class="centro">${lumi("triste", "media")}</div>
    <h2>Suas vidas acabaram 💔</h2>
    <p class="sub">Uma nova vida chega em ${min} min. Você pode recarregar com moedas ou treinar para ganhar uma vida.</p>
    <div class="acoes coluna">
      <button class="btn" id="svComprar" ${E.moedas < 40 ? "disabled" : ""}>Recarregar tudo · 🪙 40</button>
      <button class="btn secundario" id="svTreinar">💪 Treinar para ganhar 1 ❤️</button>
      <button class="btn texto" data-fechar>${naLicao ? "Sair da lição" : "Agora não"}</button>
    </div>`, { aoFechar: () => { if (naLicao && E.vidas <= 0) ir("trilha"); } });
  $("#svComprar", m.el).onclick = () => {
    if (!gastarMoedas(40)) return;
    ganharVidas(VIDAS_MAX);
    som("moeda");
    toast("❤️", "Vidas recarregadas!", "Bora continuar.");
    m.fechar();
    if (naLicao) { const v = $("#lvidas"); if (v) v.textContent = "❤️ " + E.vidas; }
  };
  $("#svTreinar", m.el).onclick = () => { m.fechar(); iniciarLicao({ treino: true }); };
}

// ============================================================
//  Tipos de exercício
// ============================================================
function botaoSom(texto, lento = false) {
  const b = el(`<button class="som-btn ${lento ? "lento" : ""}" type="button" title="${lento ? "Ouvir devagar" : "Ouvir"}">${lento ? "🐢" : "🔊"}</button>`);
  b.onclick = e => { e.stopPropagation(); falar(texto, lento); };
  return b;
}
function balao(area, html, texto) {
  const linha = el(`<div class="balao-linha">${lumi("feliz", "mini")}<div class="balao"><span>${html}</span></div></div>`);
  if (texto) $(".balao", linha).prepend(botaoSom(texto));
  area.appendChild(linha);
  return linha;
}
function escolhas(area, opcoes, ctx, { classe = "opcoes-lista", desenhar = o => esc(o.rotulo) } = {}) {
  const box = el(`<div class="${classe}"></div>`);
  let sel = null;
  opcoes.forEach((o, n) => {
    const b = el(`<button class="escolha" type="button"><span class="tecla">${n + 1}</span>${desenhar(o)}</button>`);
    b.onclick = () => {
      if (box.closest(".travado")) return;
      $$(".escolha", box).forEach(x => x.classList.remove("sel"));
      b.classList.add("sel");
      sel = o;
      som("clique");
      if (o.falar) falar(o.falar);
      ctx.pronto(true);
    };
    o.btn = b;
    box.appendChild(b);
  });
  area.appendChild(box);
  ctx.tecla = n => opcoes[n - 1] && opcoes[n - 1].btn.click();
  return {
    get: () => sel,
    marcar: valorCerto => {
      opcoes.forEach(o => { if (o.valor === valorCerto) o.btn.classList.add("certa"); });
      if (sel && sel.valor !== valorCerto) sel.btn.classList.add("errada");
    },
  };
}
function tecladoEspecial(input) {
  const letras = IDIOMAS[E.idioma].especiais;
  if (!letras.length) return null;
  const box = el(`<div class="teclado-especial"></div>`);
  letras.forEach(l => {
    const b = el(`<button type="button">${l}</button>`);
    b.onclick = () => {
      const i = input.selectionStart ?? input.value.length;
      input.value = input.value.slice(0, i) + l + input.value.slice(input.selectionEnd ?? i);
      input.focus();
      input.setSelectionRange(i + 1, i + 1);
      input.dispatchEvent(new Event("input"));
    };
    box.appendChild(b);
  });
  return box;
}
// Banco de fichas usado por "montar" e "ditado"
function bancoDeFichas(area, corretas, extras, ctx) {
  const resposta = el(`<div class="linha-resposta"></div>`);
  const banco = el(`<div class="banco"></div>`);
  const todas = embaralhar([...corretas, ...extras]);
  todas.forEach(txt => {
    const vaga = el(`<span class="vaga"></span>`);
    const f = el(`<button class="ficha" type="button"></button>`);
    f.textContent = txt;
    f.onclick = () => {
      if (area.closest(".travado")) return;
      som("clique");
      if (f.parentElement === vaga) {
        resposta.appendChild(f);
        if (E.idioma) falar(txt);
      } else {
        vaga.appendChild(f);
      }
      ctx.pronto(resposta.children.length > 0);
    };
    vaga.appendChild(f);
    banco.appendChild(vaga);
  });
  area.appendChild(resposta);
  area.appendChild(banco);
  return () => $$(".ficha", resposta).map(f => f.textContent);
}

const TIPOS = {
  // Apresenta uma palavra nova
  intro(area, { w }) {
    const t = alvo(w.p);
    area.innerHTML = `<div class="intro">
      <span class="selo brilho">✨ Palavra nova</span>
      <div class="intro-emoji">${w.p[6]}</div>
      <div class="intro-palavra"><span>${esc(t)}</span></div>
      <div class="intro-trad">${esc(w.p[0])}</div>
      <p class="dica-pequena">Ouça, repita em voz alta e toque em Continuar.</p>
    </div>`;
    const linha = $(".intro-palavra", area);
    linha.append(botaoSom(t), botaoSom(t, true));
    setTimeout(() => falar(t), 250);
  },

  // Escolha a figura certa
  imagem(area, { w }, ctx) {
    area.innerHTML = `<h2 class="enunciado">Qual destas é “${esc(w.p[0])}”?</h2>`;
    const ops = embaralhar([w, ...distratores(w, 3)]).map(x => ({ valor: x.p[0], rotulo: alvo(x.p), emoji: x.p[6], falar: alvo(x.p) }));
    const c = escolhas(area, ops, ctx, {
      classe: "opcoes-cartas",
      desenhar: o => `<span class="carta-emoji">${o.emoji}</span><span class="carta-txt">${esc(o.rotulo)}</span>`,
    });
    ctx.verificar = () => { const s = c.get(); c.marcar(w.p[0]); return { certo: s.valor === w.p[0], correta: alvo(w.p), falarTexto: alvo(w.p) }; };
  },

  // Português → idioma
  traduzir(area, { w }, ctx) {
    area.innerHTML = `<h2 class="enunciado">Como se diz em ${IDIOMAS[E.idioma].nome}?</h2>`;
    balao(area, `${w.tema.imagens ? w.p[6] + " " : ""}${esc(w.p[0])}`);
    const ops = embaralhar([w, ...distratores(w, 3)]).map(x => ({ valor: alvo(x.p), rotulo: alvo(x.p), falar: alvo(x.p) }));
    const c = escolhas(area, ops, ctx);
    ctx.verificar = () => { const s = c.get(); c.marcar(alvo(w.p)); return { certo: s.valor === alvo(w.p), correta: alvo(w.p), falarTexto: alvo(w.p) }; };
  },

  // Idioma → português
  reverso(area, { w }, ctx) {
    area.innerHTML = `<h2 class="enunciado">O que significa?</h2>`;
    balao(area, esc(alvo(w.p)), alvo(w.p));
    setTimeout(() => falar(alvo(w.p)), 250);
    const ops = embaralhar([w, ...distratores(w, 3)]).map(x => ({ valor: x.p[0], rotulo: x.p[0] }));
    const c = escolhas(area, ops, ctx);
    ctx.verificar = () => { const s = c.get(); c.marcar(w.p[0]); return { certo: s.valor === w.p[0], correta: w.p[0] }; };
  },

  // Ouça e escolha a palavra escrita
  ouvir(area, { w }, ctx) {
    const t = alvo(w.p);
    area.innerHTML = `<h2 class="enunciado">Toque no que você ouvir</h2>
      <div class="caixa-audio"><button class="falar-grande" type="button">🔊</button></div>`;
    const caixa = $(".caixa-audio", area);
    $(".falar-grande", area).onclick = () => falar(t);
    caixa.appendChild(botaoSom(t, true));
    setTimeout(() => falar(t), 300);
    const ops = embaralhar([w, ...distratores(w, 3)]).map(x => ({ valor: alvo(x.p), rotulo: alvo(x.p) }));
    const c = escolhas(area, ops, ctx);
    ctx.verificar = () => { const s = c.get(); c.marcar(t); return { certo: s.valor === t, correta: t, significado: w.p[0] }; };
  },

  // Digite a tradução
  escrever(area, { w }, ctx) {
    const t = alvo(w.p);
    area.innerHTML = `<h2 class="enunciado">Escreva em ${IDIOMAS[E.idioma].nome}</h2>`;
    balao(area, `${w.p[6]} ${esc(w.p[0])}`);
    const input = el(`<input class="campo" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Digite aqui...">`);
    area.appendChild(input);
    const tec = tecladoEspecial(input);
    if (tec) area.appendChild(tec);
    let dicas = 0;
    const dica = el(`<button class="btn texto pequeno" type="button">💡 Dica</button>`);
    const textoDica = el(`<span class="texto-dica"></span>`);
    dica.onclick = () => { dicas = Math.min(t.length, dicas + 1); textoDica.textContent = "Começa com: " + t.slice(0, dicas) + "…"; };
    area.appendChild(el(`<div class="linha-dica"></div>`)).append(dica, textoDica);
    input.oninput = () => ctx.pronto(input.value.trim().length > 0);
    setTimeout(() => input.focus(), 50);
    ctx.verificar = () => {
      input.disabled = true;
      const n = normalizar(input.value), c = normalizar(t);
      const exato = semAcento(input.value) === semAcento(t);
      if (n === c) return { certo: true, aviso: exato ? "" : `Atenção aos acentos: <b>${esc(t)}</b>`, falarTexto: t };
      if (c.length >= 5 && similaridade(n, c) >= 0.85) return { certo: true, aviso: `Quase perfeito! A grafia certa é <b>${esc(t)}</b>`, falarTexto: t };
      return { certo: false, correta: t, falarTexto: t };
    };
  },

  // Monte a palavra com letras embaralhadas
  letras(area, { w }, ctx) {
    const t = alvo(w.p);
    area.innerHTML = `<h2 class="enunciado">Monte a palavra</h2>`;
    balao(area, `${w.p[6]} ${esc(w.p[0])}`);
    const casas = el(`<div class="casas"></div>`);
    const pecas = el(`<div class="pecas"></div>`);
    const letras = [...t];
    letras.forEach(() => casas.appendChild(el(`<span class="casa"></span>`)));
    let ordem = embaralhar(letras.map((l, i) => ({ l, i })));
    if (ordem.map(o => o.l).join("") === t && t.length > 1) ordem = ordem.reverse();
    ordem.forEach(({ l }) => {
      const p = el(`<button class="peca" type="button"></button>`);
      p.textContent = l.toLowerCase();
      p.onclick = () => {
        if (area.closest(".travado")) return;
        som("clique");
        if (p.parentElement.classList.contains("casa")) {
          pecas.appendChild(p);
        } else {
          const vazia = $$(".casa", casas).find(c => !c.firstChild);
          if (vazia) vazia.appendChild(p);
        }
        ctx.pronto($$(".casa", casas).every(c => c.firstChild));
      };
      pecas.appendChild(p);
    });
    area.append(casas, pecas);
    ctx.verificar = () => {
      const montada = $$(".casa", casas).map(c => c.textContent).join("");
      return { certo: montada.toLowerCase() === t.toLowerCase(), correta: t, falarTexto: t };
    };
  },

  // Ligue os pares
  pares(area, { ws }, ctx) {
    area.innerHTML = `<h2 class="enunciado">Toque nos pares correspondentes</h2>`;
    const grade = el(`<div class="pares"><div class="col"></div><div class="col"></div></div>`);
    const [colA, colB] = $$(".col", grade);
    let selA = null, selB = null, feitos = 0;
    const criar = (w, lado) => {
      const b = el(`<button class="par" type="button"></button>`);
      b.textContent = lado === "a" ? w.p[0] : alvo(w.p);
      b.dataset.i = w.tema.id + w.i;
      b.onclick = () => {
        if (b.disabled) return;
        if (lado === "b") falar(alvo(w.p));
        som("clique");
        if (lado === "a") { if (selA) selA.classList.remove("sel"); selA = b; } else { if (selB) selB.classList.remove("sel"); selB = b; }
        b.classList.add("sel");
        if (selA && selB) {
          const a = selA, bb = selB;
          selA = selB = null;
          if (a.dataset.i === bb.dataset.i) {
            [a, bb].forEach(x => { x.classList.remove("sel"); x.classList.add("feito"); x.disabled = true; });
            som("pop");
            if (++feitos === ws.length) setTimeout(() => ctx.concluir({ certo: true }), 350);
          } else {
            [a, bb].forEach(x => { x.classList.remove("sel"); x.classList.add("errado"); });
            som("errado");
            setTimeout(() => [a, bb].forEach(x => x.classList.remove("errado")), 450);
          }
        }
      };
      return b;
    };
    embaralhar(ws).forEach(w => colA.appendChild(criar(w, "a")));
    embaralhar(ws).forEach(w => colB.appendChild(criar(w, "b")));
    area.appendChild(grade);
  },

  // Monte a frase traduzida
  montar(area, { f, temas }, ctx) {
    const t = alvo(f);
    area.innerHTML = `<h2 class="enunciado">Traduza a frase</h2>`;
    balao(area, esc(f[0]));
    const corretas = fichasSemPista(t);
    const pegar = bancoDeFichas(area, corretas, fichasExtras(f, temas, 3), ctx);
    ctx.verificar = () => ({ certo: normalizar(pegar().join(" ")) === normalizar(corretas.join(" ")), correta: t, falarTexto: t });
  },

  // Ouça a frase e monte
  ditado(area, { f, temas }, ctx) {
    const t = alvo(f);
    area.innerHTML = `<h2 class="enunciado">Monte o que você ouvir</h2>
      <div class="caixa-audio"><button class="falar-grande" type="button">🔊</button></div>`;
    const caixa = $(".caixa-audio", area);
    $(".falar-grande", area).onclick = () => falar(t);
    caixa.appendChild(botaoSom(t, true));
    setTimeout(() => falar(t), 300);
    const corretas = fichasSemPista(t);
    const pegar = bancoDeFichas(area, corretas, fichasExtras(f, temas, 2), ctx);
    ctx.verificar = () => ({ certo: normalizar(pegar().join(" ")) === normalizar(corretas.join(" ")), correta: t, significado: f[0] });
  },

  // Complete a lacuna
  completar(area, { f, temas }, ctx) {
    const t = alvo(f);
    const fs = fichas(t);
    const candidatos = fs.map((x, i) => ({ x, i })).filter(o => normalizar(o.x).length >= 3);
    const { x: lacuna, i: pos } = umDe(candidatos.length ? candidatos : fs.map((x, i) => ({ x, i })));
    area.innerHTML = `<h2 class="enunciado">Complete a frase</h2>`;
    const frase = el(`<div class="frase-lacuna"></div>`);
    fs.forEach((x, i) => frase.appendChild(i === pos ? el(`<span class="lacuna">&nbsp;</span>`) : el(`<span>${esc(x)}</span>`)));
    area.appendChild(frase);
    area.appendChild(el(`<p class="traducao-dica">“${esc(f[0])}”</p>`));
    const ops = embaralhar([pos === 0 ? minuscula(lacuna) : lacuna, ...fichasExtras(f, temas, 2)]).map(x => ({ valor: x, rotulo: x }));
    const c = escolhas(area, ops, ctx, { classe: "opcoes-linha" });
    ops.forEach(o => o.btn.addEventListener("click", () => { $(".lacuna", frase).textContent = o.valor; }));
    ctx.verificar = () => { const s = c.get(); c.marcar(pos === 0 ? minuscula(lacuna) : lacuna); return { certo: normalizar(s.valor) === normalizar(lacuna), correta: t, falarTexto: t }; };
  },

  // Fale a frase no microfone
  falar(area, { f }, ctx) {
    const t = alvo(f);
    area.innerHTML = `<h2 class="enunciado">Fale esta frase</h2>`;
    balao(area, esc(t), t);
    area.appendChild(el(`<p class="traducao-dica">“${esc(f[0])}”</p>`));
    const mic = el(`<button class="mic" type="button"><span>🎤</span><b>Toque para falar</b></button>`);
    const ouvido = el(`<p class="ouvido"></p>`);
    area.append(mic, ouvido);
    let dito = "";
    mic.onclick = () => {
      if (area.closest(".travado")) return;
      const r = new Reconhecimento();
      r.lang = IDIOMAS[E.idioma].voz;
      r.interimResults = false;
      r.maxAlternatives = 3;
      mic.classList.add("ouvindo");
      $("b", mic).textContent = "Ouvindo...";
      r.onresult = e => {
        const alts = [...e.results[0]].map(a => a.transcript);
        dito = alts.reduce((m, a) => similaridade(normalizar(a), normalizar(t)) > similaridade(normalizar(m), normalizar(t)) ? a : m, alts[0]);
        ouvido.textContent = "Você disse: “" + dito + "”";
        ctx.pronto(true);
      };
      r.onerror = e => {
        ouvido.textContent = e.error === "not-allowed" ? "O microfone foi bloqueado. Libere o acesso no navegador ou pule." : "Não consegui ouvir. Tente de novo.";
      };
      r.onend = () => { mic.classList.remove("ouvindo"); $("b", mic).textContent = "Toque para falar de novo"; };
      try { r.start(); } catch { mic.classList.remove("ouvindo"); }
    };
    ctx.permitirPular("Não posso falar agora", () => {
      semMicrofone = true;
      ctx.pular();
    });
    ctx.verificar = () => {
      const s = similaridade(normalizar(dito), normalizar(t));
      return { certo: s >= 0.7, correta: t, aviso: s < 1 ? `Ouvi: “${esc(dito)}”` : "", falarTexto: t };
    };
  },
};
