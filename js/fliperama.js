// ============================================================
//  Fliperama: minijogos rápidos para treinar vocabulário
// ============================================================
const JOGOS = [
  { id: "chuva", nome: "Chuva de Palavras", icone: "🌧️", desc: "As palavras caem do céu. Digite a tradução antes que cheguem ao chão.", cor: ["#0EA5E9", "#6366F1"], fn: () => jogoChuva() },
  { id: "relampago", nome: "Relâmpago", icone: "⚡", desc: "60 segundos de certo ou errado. Use as setas do teclado e vá rápido.", cor: ["#F59E0B", "#EF4444"], fn: () => jogoRelampago() },
  { id: "memoria", nome: "Memória", icone: "🧠", desc: "Vire as cartas e encontre cada palavra com sua tradução.", cor: ["#10B981", "#0EA5E9"], fn: () => jogoMemoria(), pro: true },
  { id: "turbo", nome: "Pares Turbo", icone: "🏎️", desc: "Ligue o máximo de pares que conseguir em 45 segundos.", cor: ["#EC4899", "#8B5CF6"], fn: () => jogoTurbo(), pro: true },
];

// Palavras dos jogos: tudo o que já foi liberado + todas as unidades até o nível do aluno
// (muito mais variedade). Só entram palavras curtas: nada de frases ou expressões longas.
function poolFliperama() {
  const ate = ORDEM_NIVEIS.indexOf(nivelAtual());
  const temas = TEMAS.filter((t, i) => temaDesbloqueado(i) || ORDEM_NIVEIS.indexOf(t.nivel) <= ate);
  const curta = w => {
    const a = alvo(w.p), pt = w.p[0];
    return a.length <= 13 && pt.length <= 16 && a.split(" ").length <= 2 && !/[.…?!]/.test(a + pt);
  };
  const vistos = new Set();
  const lista = temas.flatMap(palavrasDoTema).filter(w => {
    if (!curta(w)) return false;
    const k = normalizar(alvo(w.p)), k2 = normalizar(w.p[0]);
    if (vistos.has(k) || vistos.has("pt:" + k2)) return false;
    vistos.add(k); vistos.add("pt:" + k2);
    return true;
  });
  return lista.length >= 12 ? lista : TEMAS.slice(0, 4).flatMap(palavrasDoTema).filter(curta);
}

function cabecalhoJogo(jogo, hud) {
  return `<div class="jogo-topo">
    <button class="fechar" id="jSair" title="Sair">✕</button>
    <div class="jogo-nome">${jogo.icone} ${jogo.nome}</div>
    <div class="hud">${hud}</div>
  </div>`;
}
function abrirJogo(id) {
  const jogo = JOGOS.find(j => j.id === id);
  if (jogo.pro && !ehPro()) { ir("fliperama"); return abrirPaywall("jogos"); }
  document.body.classList.add("em-jogo");
  JOGOS.find(j => j.id === id).fn();
}
function fimJogo(id, pontos, detalhe = "") {
  document.body.classList.remove("em-jogo");
  const jogo = JOGOS.find(j => j.id === id);
  const recorde = E.recordes[id] || 0;
  const novo = pontos > recorde;
  if (novo) E.recordes[id] = pontos;
  const moedas = Math.max(1, Math.floor(pontos / 3));
  const xp = Math.max(2, Math.min(40, pontos));
  contar("arcade");
  E.moedas += moedas;
  ganharXP(xp);
  som(novo && pontos > 0 ? "nivel" : "fim");
  if (novo && pontos > 0) confetes(120);
  render(`
    <div class="fim">
      ${lumi(pontos > 0 ? "festa" : "triste", "grande pulando")}
      <span class="selo">${jogo.icone} ${jogo.nome}</span>
      <h1><span class="destaque">${pontos} ponto${pontos === 1 ? "" : "s"}</span></h1>
      ${novo && pontos > 0 ? `<p class="recorde-novo">🏆 Novo recorde!</p>` : `<p class="sub">Recorde: ${recorde}</p>`}
      ${detalhe ? `<p class="sub">${detalhe}</p>` : ""}
      <div class="placar">
        <div class="placa amarela"><small>XP</small><b>⚡ ${xp}</b></div>
        <div class="placa laranja"><small>Moedas</small><b>🪙 ${moedas}</b></div>
      </div>
      <div class="acoes">
        <button class="btn secundario" id="fjVoltar">Fliperama</button>
        <button class="btn grande" id="fjDenovo">Jogar de novo</button>
      </div>
    </div>`);
  $("#fjVoltar").onclick = () => ir("fliperama");
  $("#fjDenovo").onclick = () => abrirJogo(id);
}
function contagem(area, aoTerminar) {
  const c = el(`<div class="contagem">3</div>`);
  area.appendChild(c);
  let n = 3;
  som("clique");
  const t = setInterval(() => {
    n--;
    if (n > 0) { c.textContent = n; pular(c); som("clique"); }
    else if (n === 0) { c.textContent = "Já!"; pular(c); som("pop"); }
    else { clearInterval(t); c.remove(); aoTerminar(); }
  }, 650);
}

// ---------- Chuva de Palavras ----------
function jogoChuva() {
  const jogo = JOGOS[0];
  const pool = poolFliperama();
  render(`<div class="jogo">
    ${cabecalhoJogo(jogo, `<span>⭐ <b id="jPontos">0</b></span><span id="jVidas">❤️❤️❤️</span>`)}
    <div class="arena" id="arena"></div>
    <div class="jogo-entrada">
      <input class="campo" id="jInput" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Digite a tradução em ${IDIOMAS[E.idioma].nome}...">
    </div>
  </div>`);
  const arena = $("#arena"), input = $("#jInput");
  const tec = tecladoEspecial(input);
  if (tec) $(".jogo-entrada").appendChild(tec);
  let pontos = 0, vidas = 3, vivo = false, gotas = [], ultimo = 0, t0 = 0, antes = 0;
  const recentes = [];

  const sair = () => { vivo = false; ir("fliperama"); };
  $("#jSair").onclick = sair;

  function criar() {
    const evitar = new Set([...gotas.map(g => g.w), ...recentes]);
    const opcoes = pool.filter(w => !evitar.has(w));
    const w = umDe(opcoes.length ? opcoes : pool);
    recentes.push(w);
    if (recentes.length > Math.min(20, Math.floor(pool.length / 2))) recentes.shift();
    const d = el(`<div class="gota"><span class="gota-emoji">${w.p[6]}</span><span>${esc(w.p[0])}</span><small></small></div>`);
    arena.appendChild(d);
    const x = 8 + Math.random() * Math.max(10, arena.clientWidth - d.offsetWidth - 16);
    gotas.push({ w, d, x, y: -50, alvo: normalizar(alvo(w.p)) });
  }
  function laco(t) {
    if (!vivo) return;
    if (!document.body.contains(arena)) { vivo = false; return; }
    const dt = Math.min(0.05, (t - antes) / 1000);
    antes = t;
    const s = (t - t0) / 1000;
    // Começa devagar e acelera pouco (no máximo 4 palavras na tela ao mesmo tempo)
    const vel = Math.min(60, 20 + s * 0.35 + pontos * 0.6);
    const intervalo = Math.max(2000, 3600 - s * 12 - pontos * 20);
    if (t - ultimo > intervalo && gotas.length < 4) { criar(); ultimo = t; }
    const H = arena.clientHeight;
    for (const g of gotas) {
      g.y += vel * dt;
      g.d.style.transform = `translate(${g.x}px, ${g.y}px)`;
      if (!g.dica && g.y > H * 0.4) { g.dica = true; $("small", g.d).textContent = alvo(g.w.p).slice(0, 2) + "…"; }
      if (g.dica === true && g.y > H * 0.65) { g.dica = 2; $("small", g.d).textContent = alvo(g.w.p).slice(0, Math.ceil(alvo(g.w.p).length / 2)) + "…"; }
      if (g.y > H - g.d.offsetHeight) {
        g.morta = true;
        g.d.classList.add("caiu");
        setTimeout(() => g.d.remove(), 400);
        vidas--;
        som("errado");
        tremer(arena);
        $("#jVidas").textContent = "❤️".repeat(Math.max(0, vidas)) + "🖤".repeat(3 - Math.max(0, vidas));
      }
    }
    gotas = gotas.filter(g => !g.morta);
    if (vidas <= 0) { vivo = false; return setTimeout(() => fimJogo("chuva", pontos, `Você acertou ${pontos} palavra${pontos === 1 ? "" : "s"}.`), 500); }
    requestAnimationFrame(laco);
  }
  input.oninput = () => {
    const v = normalizar(input.value);
    const i = gotas.findIndex(g => g.alvo === v);
    if (i >= 0) {
      const g = gotas[i];
      gotas.splice(i, 1);
      g.d.classList.add("estourou");
      setTimeout(() => g.d.remove(), 350);
      pontos++;
      $("#jPontos").textContent = pontos;
      som("pop");
      falar(alvo(g.w.p));
      input.value = "";
    }
  };
  // Enter aceita um errinho de digitação em palavras maiores
  input.onkeydown = e => {
    if (e.key !== "Enter" || !input.value) return;
    const v = normalizar(input.value);
    const g = gotas.find(x => x.alvo.length >= 5 && similaridade(v, x.alvo) >= 0.8);
    if (g) { input.value = g.alvo; input.oninput(); return; }
    tremer(input); input.value = "";
  };
  teclas = e => { if (e.key === "Escape") sair(); };
  contagem(arena, () => {
    vivo = true;
    t0 = antes = ultimo = performance.now() - 2000;
    input.focus();
    requestAnimationFrame(laco);
  });
}

// ---------- Relâmpago (certo ou errado em 60s) ----------
function jogoRelampago() {
  const jogo = JOGOS[1];
  const pool = poolFliperama();
  const DURACAO = 60;
  render(`<div class="jogo">
    ${cabecalhoJogo(jogo, `<span>⭐ <b id="jPontos">0</b></span><span id="jMult"></span>`)}
    <div class="barra tempo"><div id="jTempo" style="width:100%"></div></div>
    <div class="relampago" id="area">
      <div class="rl-carta" id="carta"></div>
      <div class="rl-botoes">
        <button class="rl-btn nao" id="bNao"><span>✘</span>Errado<small>←</small></button>
        <button class="rl-btn sim" id="bSim"><span>✔</span>Certo<small>→</small></button>
      </div>
    </div>
  </div>`);
  let pontos = 0, seq = 0, restante = DURACAO, vivo = false, atual = null, timer = null, acertos = 0, total = 0;
  const sair = () => { vivo = false; clearInterval(timer); ir("fliperama"); };
  $("#jSair").onclick = sair;

  function nova() {
    const w = umDe(pool);
    const verdade = Math.random() < 0.5;
    const mostrado = verdade ? w : umDe(pool.filter(x => normalizar(alvo(x.p)) !== normalizar(alvo(w.p))));
    atual = { verdade };
    const c = $("#carta");
    c.innerHTML = `<div class="rl-emoji">${w.p[6]}</div><div class="rl-pt">${esc(w.p[0])}</div><div class="rl-igual">=</div><div class="rl-alvo">${esc(alvo(mostrado.p))}</div>`;
    c.classList.remove("entra"); void c.offsetWidth; c.classList.add("entra");
  }
  function responder(sim) {
    if (!vivo) return;
    total++;
    const c = $("#carta");
    if (sim === atual.verdade) {
      seq++; acertos++;
      const mult = 1 + Math.floor(seq / 5);
      pontos += mult;
      som("certo");
      c.classList.add("ok");
      $("#jMult").textContent = mult > 1 ? `🔥 x${mult}` : "";
    } else {
      seq = 0;
      restante = Math.max(0, restante - 3);
      som("errado");
      tremer(c);
      c.classList.add("nao");
      $("#jMult").textContent = "−3s";
    }
    $("#jPontos").textContent = pontos;
    setTimeout(() => { c.classList.remove("ok", "nao"); if (vivo) nova(); }, 180);
  }
  $("#bSim").onclick = () => responder(true);
  $("#bNao").onclick = () => responder(false);
  teclas = e => {
    if (e.key === "Escape") return sair();
    if (e.key === "ArrowRight") responder(true);
    if (e.key === "ArrowLeft") responder(false);
  };
  contagem($("#area"), () => {
    vivo = true;
    nova();
    timer = setInterval(() => {
      const barra = $("#jTempo");
      if (!barra) { clearInterval(timer); vivo = false; return; }
      restante -= 0.1;
      barra.style.width = Math.max(0, (restante / DURACAO) * 100) + "%";
      if (restante <= 0) {
        clearInterval(timer); vivo = false;
        fimJogo("relampago", pontos, `${acertos} de ${total} respostas certas.`);
      }
    }, 100);
  });
}

// ---------- Memória ----------
function jogoMemoria() {
  const jogo = JOGOS[2];
  const ws = sortear(poolFliperama(), 6);
  render(`<div class="jogo">
    ${cabecalhoJogo(jogo, `<span>🔄 <b id="jMov">0</b></span><span>⏱️ <b id="jTempo">0:00</b></span>`)}
    <div class="memoria" id="grade"></div>
  </div>`);
  const cartas = embaralhar(ws.flatMap((w, i) => [
    { par: i, txt: w.p[0], emoji: w.p[6], lado: "pt" },
    { par: i, txt: alvo(w.p), emoji: "", lado: "alvo", w },
  ]));
  let abertas = [], travado = false, movimentos = 0, achados = 0, inicio = Date.now();
  const timer = setInterval(() => {
    const t = $("#jTempo");
    if (!t) return clearInterval(timer);
    t.textContent = formatarTempo(Math.floor((Date.now() - inicio) / 1000));
  }, 500);
  const sair = () => { clearInterval(timer); ir("fliperama"); };
  $("#jSair").onclick = sair;
  teclas = e => { if (e.key === "Escape") sair(); };

  const grade = $("#grade");
  cartas.forEach((c, n) => {
    const b = el(`<button class="mcarta ${c.lado}" type="button" style="animation-delay:${n * 30}ms">
      <span class="mface frente">?</span>
      <span class="mface verso">${c.emoji ? `<span class="m-emoji">${c.emoji}</span>` : ""}<span>${esc(c.txt)}</span></span>
    </button>`);
    b.onclick = () => {
      if (travado || b.classList.contains("virada")) return;
      b.classList.add("virada");
      som("clique");
      if (c.lado === "alvo") falar(c.txt);
      abertas.push({ c, b });
      if (abertas.length === 2) {
        movimentos++;
        $("#jMov").textContent = movimentos;
        const [x, y] = abertas;
        abertas = [];
        if (x.c.par === y.c.par && x.c.lado !== y.c.lado) {
          setTimeout(() => { x.b.classList.add("achada"); y.b.classList.add("achada"); som("pop"); }, 250);
          if (++achados === ws.length) {
            clearInterval(timer);
            const seg = Math.floor((Date.now() - inicio) / 1000);
            const pontos = Math.max(10, 120 - movimentos * 4 - seg);
            setTimeout(() => fimJogo("memoria", pontos, `${movimentos} jogadas em ${formatarTempo(seg)}.`), 900);
          }
        } else {
          travado = true;
          setTimeout(() => { x.b.classList.remove("virada"); y.b.classList.remove("virada"); travado = false; }, 850);
        }
      }
    };
    grade.appendChild(b);
  });
}

// ---------- Pares Turbo ----------
function jogoTurbo() {
  const jogo = JOGOS[3];
  const pool = poolFliperama();
  const DURACAO = 45;
  render(`<div class="jogo">
    ${cabecalhoJogo(jogo, `<span>⭐ <b id="jPontos">0</b></span><span>🏁 <b id="jRodada">1</b></span>`)}
    <div class="barra tempo"><div id="jTempo" style="width:100%"></div></div>
    <div id="area" class="turbo"></div>
  </div>`);
  let pontos = 0, rodada = 0, restante = DURACAO, vivo = false, timer = null;
  const sair = () => { vivo = false; clearInterval(timer); ir("fliperama"); };
  $("#jSair").onclick = sair;
  teclas = e => { if (e.key === "Escape") sair(); };

  function novaRodada() {
    rodada++;
    $("#jRodada").textContent = rodada;
    const ws = sortear(pool, 5);
    const area = $("#area");
    area.innerHTML = "";
    const grade = el(`<div class="pares"><div class="col"></div><div class="col"></div></div>`);
    const [A, B] = $$(".col", grade);
    let selA = null, selB = null, feitos = 0;
    const criar = (w, lado) => {
      const b = el(`<button class="par" type="button"></button>`);
      b.textContent = lado === "a" ? w.p[0] : alvo(w.p);
      b.dataset.k = normalizar(alvo(w.p));
      b.onclick = () => {
        if (!vivo || b.disabled) return;
        if (lado === "a") { if (selA) selA.classList.remove("sel"); selA = b; } else { if (selB) selB.classList.remove("sel"); selB = b; }
        b.classList.add("sel");
        if (selA && selB) {
          const a = selA, bb = selB;
          selA = selB = null;
          if (a.dataset.k === bb.dataset.k) {
            [a, bb].forEach(x => { x.classList.remove("sel"); x.classList.add("feito"); x.disabled = true; });
            pontos++; som("pop");
            $("#jPontos").textContent = pontos;
            if (++feitos === ws.length) { pontos += 3; $("#jPontos").textContent = pontos; som("certo"); setTimeout(() => vivo && novaRodada(), 300); }
          } else {
            [a, bb].forEach(x => { x.classList.remove("sel"); x.classList.add("errado"); });
            restante = Math.max(0, restante - 2);
            som("errado");
            setTimeout(() => [a, bb].forEach(x => x.classList.remove("errado")), 400);
          }
        }
      };
      return b;
    };
    embaralhar(ws).forEach(w => A.appendChild(criar(w, "a")));
    embaralhar(ws).forEach(w => B.appendChild(criar(w, "b")));
    area.appendChild(grade);
  }
  contagem($("#area"), () => {
    vivo = true;
    novaRodada();
    timer = setInterval(() => {
      const t = $("#jTempo");
      if (!t) { clearInterval(timer); vivo = false; return; }
      restante -= 0.1;
      t.style.width = Math.max(0, (restante / DURACAO) * 100) + "%";
      if (restante <= 0) {
        clearInterval(timer); vivo = false;
        fimJogo("turbo", pontos, `Você chegou à rodada ${rodada}.`);
      }
    }, 100);
  });
}
