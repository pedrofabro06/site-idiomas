// ============================================================
//  Telas: navegação, início, idiomas, trilha, fliperama, loja, perfil
// ============================================================
const TELAS = {
  inicio: () => telaInicio(),
  idiomas: () => telaIdiomas(),
  trilha: () => telaTrilha(),
  fliperama: () => telaFliperama(),
  loja: () => telaLoja(),
  perfil: () => telaPerfil(),
};

function ir(nome) {
  if (location.hash !== "#" + nome) location.hash = nome;
  else mostrarRota();
}
function mostrarRota() {
  const nome = location.hash.slice(1) || "inicio";
  document.body.classList.remove("em-licao", "em-jogo");
  window.speechSynthesis?.cancel();
  garantirDia();
  aplicarTema();
  if ((nome === "trilha" || nome === "fliperama") && !E.idioma) { telaIdiomas(); marcarNav("trilha"); return; }
  (TELAS[nome] || TELAS.inicio)();
  marcarNav(nome);
  atualizarTopo();
}
addEventListener("hashchange", mostrarRota);

function marcarNav(nome) {
  $$("#nav a").forEach(a => a.classList.toggle("ativo", a.dataset.r === nome));
}

function atualizarTopo() {
  const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  set("streak", E.streak);
  set("moedas", E.moedas);
  set("vidas", E.vidas);
  const pv = $("#pillVidas");
  if (pv) pv.title = E.vidas >= VIDAS_MAX ? "Vidas cheias" : `Próxima vida em ${Math.ceil(proximaVidaEm() / 60000)} min`;
  const pi = $("#pillIdioma");
  if (pi) pi.innerHTML = E.idioma ? `${svgBandeira(E.idioma, "bandeira mini")}<b>${IDIOMAS[E.idioma].nome}</b>` : `🌐 <b>Idioma</b>`;
  $("#pillStreak")?.classList.toggle("apagado", E.ultimoDia !== hoje());
}

function selecionarIdioma(cod) {
  E.idioma = cod;
  salvar();
  aplicarTema(cod);
  som("pop");
  toast("🎨", `${IDIOMAS[cod].nome} selecionado`, `${IDIOMAS[cod].ola}! Tudo ganhou as cores da bandeira.`);
  ir("trilha");
}

// ---------- Componentes ----------
function cardsIdiomas() {
  return Object.entries(IDIOMAS).map(([cod, i], n) => {
    const p = percentualIdioma(cod);
    return `<button class="card-idioma ${E.idioma === cod ? "atual" : ""}" data-idioma="${cod}"
        style="--k1:${i.tema.c1};--k2:${i.tema.c2};animation-delay:${n * 70}ms">
      <div class="ci-bandeira">${svgBandeira(cod, "bandeira grande")}<span class="ci-brilho"></span></div>
      <div class="ci-info">
        <b>${i.nome}</b>
        <small>${i.nativo} · “${esc(i.ola.replace("¡", ""))}”</small>
        <div class="barra fina"><div style="width:${p}%"></div></div>
        <span class="ci-p">${p ? p + "% concluído" : "Começar do zero"}</span>
      </div>
      ${E.idioma === cod ? `<span class="ci-atual">Atual</span>` : ""}
    </button>`;
  }).join("");
}
function ligarCardsIdiomas(raiz = app) {
  $$("[data-idioma]", raiz).forEach(b => b.onclick = () => selecionarIdioma(b.dataset.idioma));
}
function anelMeta() {
  const p = Math.min(1, E.dia.xp / E.meta);
  const C = 2 * Math.PI * 34;
  return `<svg class="anel" viewBox="0 0 80 80">
    <circle cx="40" cy="40" r="34" class="anel-fundo"/>
    <circle cx="40" cy="40" r="34" class="anel-valor" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - p)}"/>
    <text x="40" y="38" text-anchor="middle" class="anel-num">${E.dia.xp}</text>
    <text x="40" y="52" text-anchor="middle" class="anel-meta">/ ${E.meta} XP</text>
  </svg>`;
}
function graficoSemana() {
  const dias = [];
  for (let k = 6; k >= 0; k--) {
    const d = new Date(); d.setDate(d.getDate() - k);
    dias.push({ data: dataLocal(d), rot: d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""), xp: E.historico[dataLocal(d)] || 0 });
  }
  const max = Math.max(E.meta, ...dias.map(d => d.xp));
  return `<div class="semana">${dias.map((d, i) => `
    <div class="sem-col ${i === 6 ? "hoje" : ""}" title="${d.xp} XP">
      <span class="sem-val">${d.xp || ""}</span>
      <div class="sem-barra"><div style="height:${Math.max(4, (d.xp / max) * 100)}%"></div></div>
      <small>${d.rot}</small>
    </div>`).join("")}</div>`;
}
function painelDesafios() {
  return desafiosDoDia().map(d => {
    const v = Math.min(d.meta, E.dia[d.campo] || 0);
    const feito = E.dia.feitos.includes(d.id);
    return `<div class="desafio ${feito ? "feito" : ""}">
      <span class="d-ic">${feito ? "✅" : "🎯"}</span>
      <div class="d-info"><b>${d.texto}</b><div class="barra fina"><div style="width:${(v / d.meta) * 100}%"></div></div></div>
      <span class="d-premio">${v}/${d.meta}<small>🪙 ${d.moedas}</small></span>
    </div>`;
  }).join("");
}
function palavraDoDia() {
  const todas = TEMAS.flatMap(palavrasDoTema);
  const r = aleatorioComSemente(hashTexto(hoje() + E.idioma));
  return todas[Math.floor(r() * todas.length)];
}

// ---------- Início ----------
function telaInicio() {
  const idi = E.idioma ? IDIOMAS[E.idioma] : null;
  const prox = idi ? proximaLicao() : null;
  const nivel = nivelDe(E.xp);
  const novo = !idi && E.xp === 0;
  const pw = idi ? palavraDoDia() : null;

  render(`
    <section class="hero ${novo ? "hero-novo" : ""}">
      <div class="hero-texto">
        <span class="selo">${idi ? `${svgBandeira(E.idioma, "bandeira mini")} Estudando ${idi.nome}` : "🎮 Aprender idiomas jogando"}</span>
        <h1>${idi
          ? `${esc(idi.ola)}, <span class="destaque">${esc(E.nome)}</span>!`
          : `Aprenda idiomas como quem <span class="destaque">zera um jogo</span>`}</h1>
        <p class="sub">${idi
          ? (prox ? `Sua próxima fase é <b>${prox.tema.icone} ${prox.tema.titulo}</b>. Mantenha a ofensiva acesa e suba de nível.` : "Você completou a trilha inteira! Que tal o fliperama ou um idioma novo?")
          : "Trilha de fases, vidas, moedas, conquistas e minijogos. Cinco idiomas, cada um com as cores reais da sua bandeira."}</p>
        <div class="hero-acoes">
          ${idi
            ? `<button class="btn grande" id="hContinuar">${prox ? "▶ Continuar trilha" : "🕹️ Ir ao fliperama"}</button>
               <button class="btn secundario" id="hTrocar">Trocar idioma</button>`
            : `<button class="btn grande" id="hComecar">Começar agora — é grátis</button>`}
        </div>
        ${idi ? `<div class="hero-mini">
          <span>⚡ Nível <b>${nivel}</b></span><span>🔥 <b>${E.streak}</b> dia${E.streak === 1 ? "" : "s"}</span><span>📚 <b>${totalAprendidas()}</b> palavras</span>
        </div>` : `<div class="hero-mini"><span>🗺️ 8 unidades</span><span>🧩 12 tipos de exercício</span><span>🕹️ 4 minijogos</span></div>`}
      </div>
      <div class="hero-palco">
        <div class="orbita">${Object.keys(IDIOMAS).map((c, i) => `<span class="orb" style="--i:${i}">${svgBandeira(c, "bandeira")}</span>`).join("")}</div>
        ${lumi("feliz", "grande flutua")}
        <div class="balao-lumi">${idi ? esc(idi.vamos) : "Oi! Eu sou a Lumi.<br>Mudo de cor com o idioma!"}</div>
      </div>
    </section>

    ${idi ? `
    <section class="painel">
      <div class="cartao-p meta">
        <h3>Meta diária</h3>
        ${anelMeta()}
        <p class="sub">${E.dia.xp >= E.meta ? "Meta batida! 🎉" : `Faltam ${E.meta - E.dia.xp} XP`}</p>
      </div>
      <div class="cartao-p fogo ${E.ultimoDia === hoje() ? "aceso" : ""}">
        <h3>Ofensiva</h3>
        <div class="fogo-grande">🔥</div>
        <b class="fogo-num">${E.streak} dia${E.streak === 1 ? "" : "s"}</b>
        <p class="sub">${E.ultimoDia === hoje() ? "Você já estudou hoje." : "Estude hoje para não perder!"}${E.protetor ? ` · 🧊 ${E.protetor}` : ""}</p>
      </div>
      <div class="cartao-p desafios">
        <h3>Desafios do dia</h3>
        ${painelDesafios()}
      </div>
      <div class="cartao-p palavra-dia">
        <h3>Palavra do dia</h3>
        <div class="pd-emoji">${pw.p[6]}</div>
        <div class="pd-palavra">${esc(alvo(pw.p))} <button class="som-btn" id="pdSom">🔊</button></div>
        <p class="sub">${esc(pw.p[0])}</p>
      </div>
      <div class="cartao-p semana-p">
        <h3>Sua semana</h3>
        ${graficoSemana()}
      </div>
    </section>` : ""}

    <section>
      <div class="titulo-secao"><h2>${idi ? "Seus idiomas" : "Escolha seu idioma"}</h2><p class="sub">Cada idioma pinta o site com as cores da própria bandeira.</p></div>
      <div class="grade-idiomas">${cardsIdiomas()}</div>
    </section>

    <section>
      <div class="titulo-secao"><h2>Como funciona</h2></div>
      <div class="grade-como">
        <div class="como-card" style="--d:0"><span>🗺️</span><b>Trilha de fases</b><p>Cada unidade tem 3 lições, um desafio final valendo coroa e um baú de moedas.</p></div>
        <div class="como-card" style="--d:1"><span>🧩</span><b>12 tipos de exercício</b><p>Imagens, pares, letras, montar frases, ditado, completar e até falar no microfone.</p></div>
        <div class="como-card" style="--d:2"><span>❤️</span><b>Vidas e moedas</b><p>Errou, perde uma vida. Ganhe moedas e troque por vidas, protetores e avatares.</p></div>
        <div class="como-card" style="--d:3"><span>🕹️</span><b>Fliperama</b><p>Minijogos rápidos como Chuva de Palavras e Relâmpago para bater recordes.</p></div>
        <div class="como-card" style="--d:4"><span>🏅</span><b>Conquistas</b><p>Desafios diários, medalhas, nível e ofensiva para você voltar todo dia.</p></div>
        <div class="como-card" style="--d:5"><span>🔊</span><b>Pronúncia nativa</b><p>Ouça cada palavra na voz do idioma, também em velocidade lenta.</p></div>
      </div>
    </section>`);

  ligarCardsIdiomas();
  if (idi) {
    $("#hContinuar").onclick = () => {
      if (!prox) return ir("fliperama");
      if (prox.nivel === 4) return ir("trilha");
      iniciarLicao({ tema: prox.tema, nivel: prox.nivel });
    };
    $("#hTrocar").onclick = () => ir("idiomas");
    $("#pdSom").onclick = () => falar(alvo(pw.p));
  } else {
    $("#hComecar").onclick = () => $(".grade-idiomas").scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

// ---------- Escolha de idioma ----------
function telaIdiomas() {
  render(`
    <div class="titulo-secao centro">
      ${lumi("uau", "media flutua")}
      <h1>Qual idioma você quer <span class="destaque">aprender?</span></h1>
      <p class="sub">Seu progresso fica salvo separado para cada idioma.</p>
    </div>
    <div class="grade-idiomas">${cardsIdiomas()}</div>`);
  ligarCardsIdiomas();
}

// ---------- Trilha ----------
const NOS = [
  { ic: "★", nome: "Lição 1", desc: "Conheça 4 palavras novas com imagens, áudio e pares." },
  { ic: "★", nome: "Lição 2", desc: "Mais 4 palavras e suas primeiras frases." },
  { ic: "★", nome: "Lição 3", desc: "Misture tudo: escrita, ditado, frases e fala." },
  { ic: "👑", nome: "Desafio", desc: "Prova final da unidade. Mais difícil, vale coroa e mais XP." },
  { ic: "🎁", nome: "Baú", desc: "Abra para ganhar moedas." },
];
const DESLOCAMENTO = [0, 70, 100, 70, 0];

function telaTrilha() {
  const idi = IDIOMAS[E.idioma];
  const prox = proximaLicao();
  let html = `
    <section class="trilha-topo">
      <div class="tt-bandeira">${svgBandeira(E.idioma, "bandeira grande")}</div>
      <div class="tt-info">
        <small>Trilha de</small>
        <h1>${idi.nome}</h1>
        <div class="barra"><div style="width:${percentualIdioma(E.idioma)}%"></div></div>
        <p class="sub">${percentualIdioma(E.idioma)}% concluído · ${totalAprendidas()} palavras aprendidas</p>
      </div>
      <div class="tt-acoes">
        <button class="btn secundario" id="tTreinar">💪 Treinar <small>+1 ❤️</small></button>
        <button class="btn secundario" id="tTrocar">Trocar idioma</button>
      </div>
    </section>`;

  TEMAS.forEach((t, i) => {
    const p = progTema(t.id);
    const lib = temaDesbloqueado(i);
    const lado = i % 2 ? -1 : 1;
    html += `<section class="unidade ${lib ? "" : "bloqueada"}" id="u${i}">
      <div class="unidade-banner ${i % 2 ? "alt" : ""}">
        <div>
          <small>Unidade ${i + 1} ${p.licao >= 4 ? "· 👑 dominada" : ""}</small>
          <h2>${t.icone} ${t.titulo}</h2>
          <p>${t.desc}</p>
        </div>
        <button class="btn-vocab" data-vocab="${i}">📖 Palavras</button>
      </div>
      <div class="caminho">`;
    NOS.forEach((no, k) => {
      let estado;
      if (!lib) estado = "bloqueado";
      else if (k < 4) estado = k < p.licao ? "feito" : k === p.licao ? "atual" : "bloqueado";
      else estado = p.bau ? "feito" : p.licao >= 4 ? "atual" : "bloqueado";
      const estrelas = k < 3 && estado === "feito" ? `<span class="no-estrelas">${[0, 1, 2].map(s => `<i class="${s < (p.estrelas[k] || 0) ? "on" : ""}">★</i>`).join("")}</span>` : "";
      const icone = estado === "bloqueado" ? "🔒" : estado === "feito" && k < 4 ? (k === 3 ? "👑" : "✔") : no.ic;
      html += `<div class="no-linha" style="--x:${DESLOCAMENTO[k] * lado}">
        <button class="no ${estado} tipo-${k}" data-t="${i}" data-k="${k}" aria-label="${no.nome}">
          ${estado === "atual" ? `<span class="no-rotulo">${k === 4 ? "ABRIR" : "COMEÇAR"}</span>` : ""}
          <span class="no-ic">${icone}</span>
        </button>
        ${estrelas}
        ${estado === "atual" && k === p.licao && prox && prox.i === i ? `<div class="no-lumi">${lumi("feliz", "mini flutua")}</div>` : ""}
      </div>`;
    });
    html += `</div></section>`;
  });
  render(html);

  $("#tTreinar").onclick = () => iniciarLicao({ treino: true });
  $("#tTrocar").onclick = () => ir("idiomas");
  $$("[data-vocab]").forEach(b => b.onclick = () => modalVocabulario(TEMAS[+b.dataset.vocab]));
  $$(".no").forEach(b => b.onclick = () => clicarNo(+b.dataset.t, +b.dataset.k, b));

  // Rola até a fase atual
  const atual = $(".no.atual");
  if (atual) setTimeout(() => atual.scrollIntoView({ behavior: "smooth", block: "center" }), 250);
}

function clicarNo(i, k, botao) {
  const t = TEMAS[i];
  const p = progTema(t.id);
  if (botao.classList.contains("bloqueado")) {
    tremer(botao);
    som("errado");
    toast("🔒", "Fase bloqueada", temaDesbloqueado(i) ? "Conclua a fase anterior primeiro." : `Vença o desafio da unidade ${i} para liberar.`);
    return;
  }
  if (k === 4) return abrirBau(t);
  const feito = k < p.licao;
  const no = NOS[k];
  const m = abrirModal(`
    <div class="no-modal-topo tipo-${k}"><span>${no.ic === "★" ? "⭐" : no.ic}</span></div>
    <small class="sub">Unidade ${i + 1} · ${t.icone} ${t.titulo}</small>
    <h2>${no.nome}</h2>
    <p class="sub">${no.desc}</p>
    ${feito ? `<div class="estrelas pequenas">${[1, 2, 3].map(n => `<span class="${n <= (p.estrelas[k] || 0) ? "on" : ""}">★</span>`).join("")}</div>` : ""}
    <div class="acoes coluna">
      <button class="btn grande" id="nComecar">${feito ? "Praticar de novo" : "Começar"} · +${k === 3 ? 20 : 10} XP</button>
      <button class="btn texto" data-fechar>Agora não</button>
    </div>`);
  $("#nComecar", m.el).onclick = () => { m.fechar(); iniciarLicao({ tema: t, nivel: k }); };
}

function abrirBau(t) {
  const p = progTema(t.id);
  if (p.bau) return toast("🎁", "Baú já aberto", "Você já pegou as moedas desta unidade.");
  const premio = 20 + Math.floor(Math.random() * 21);
  const m = abrirModal(`
    <div class="bau-palco"><div class="bau" id="bau">🎁</div></div>
    <h2 id="bauTitulo">Toque no baú!</h2>
    <p class="sub" id="bauTexto">Recompensa da unidade ${t.titulo}.</p>
    <div class="acoes"><button class="btn" id="bauOk" hidden data-fechar>Pegar</button></div>`,
    { aoFechar: () => { if (p.bau) telaTrilha(); } });
  const bau = $("#bau", m.el);
  bau.onclick = () => {
    if (p.bau) return;
    p.bau = true;
    bau.classList.add("abrindo");
    som("bau");
    setTimeout(() => {
      bau.textContent = "🪙";
      bau.classList.add("aberto");
      $("#bauTitulo", m.el).textContent = `+${premio} moedas!`;
      $("#bauTexto", m.el).textContent = "Gaste na loja com vidas, protetores e avatares.";
      $("#bauOk", m.el).hidden = false;
      E.moedas += premio;
      salvar();
      checarTudo();
      confetes(80);
      som("moeda");
    }, 900);
  };
}

function modalVocabulario(t) {
  const aprendidas = new Set(((E.aprendidas[E.idioma] || {})[t.id]) || []);
  const m = abrirModal(`
    <h2>${t.icone} ${t.titulo}</h2>
    <p class="sub">Toque para ouvir. ✅ = palavra que você já acertou.</p>
    <div class="vocab-lista">${t.palavras.map((p, i) => `
      <button class="vocab-item" data-i="${i}">
        <span class="vi-emoji">${p[6]}</span>
        <span class="vi-txt"><b>${esc(alvo(p))}</b><small>${esc(p[0])}</small></span>
        <span>${aprendidas.has(i) ? "✅" : "🔊"}</span>
      </button>`).join("")}</div>
    <h3>Frases</h3>
    <div class="vocab-lista">${t.frases.map((f, i) => `
      <button class="vocab-item frase" data-f="${i}">
        <span class="vi-txt"><b>${esc(alvo(f))}</b><small>${esc(f[0])}</small></span><span>🔊</span>
      </button>`).join("")}</div>
    <div class="acoes"><button class="btn" data-fechar>Fechar</button></div>`, { classe: "larga" });
  $$("[data-i]", m.el).forEach(b => b.onclick = () => falar(alvo(t.palavras[+b.dataset.i])));
  $$("[data-f]", m.el).forEach(b => b.onclick = () => falar(alvo(t.frases[+b.dataset.f])));
}

// ---------- Fliperama ----------
function telaFliperama() {
  render(`
    <section class="flip-topo">
      <div>
        <span class="selo">🕹️ Fliperama</span>
        <h1>Jogue, pontue e <span class="destaque">bata recordes</span></h1>
        <p class="sub">Os minijogos usam as palavras das unidades que você já liberou em ${IDIOMAS[E.idioma].nome}. Cada partida rende XP e moedas.</p>
      </div>
      ${lumi("festa", "media flutua")}
    </section>
    <div class="grade-jogos">${JOGOS.map((j, n) => `
      <button class="card-jogo" data-jogo="${j.id}" style="--g1:${j.cor[0]};--g2:${j.cor[1]};animation-delay:${n * 80}ms">
        <span class="cj-ic">${j.icone}</span>
        <b>${j.nome}</b>
        <p>${j.desc}</p>
        <span class="cj-rodape"><span>🏆 Recorde: <b>${E.recordes[j.id] || 0}</b></span><span class="cj-play">Jogar ▶</span></span>
      </button>`).join("")}
    </div>`);
  $$("[data-jogo]").forEach(b => b.onclick = () => abrirJogo(b.dataset.jogo));
}

// ---------- Loja ----------
function telaLoja() {
  atualizarVidas();
  const itens = [
    { id: "vidas", ic: "❤️", nome: "Recarregar vidas", desc: `Volte para ${VIDAS_MAX} vidas na hora.`, preco: 40, pode: E.vidas < VIDAS_MAX, motivo: "Vidas já estão cheias" },
    { id: "protetor", ic: "🧊", nome: "Protetor de ofensiva", desc: "Salva sua ofensiva se você esquecer um dia. Máximo de 2.", preco: 80, pode: E.protetor < 2, motivo: "Você já tem 2" },
    { id: "vida1", ic: "💗", nome: "Uma vida", desc: "Só uma vidinha para terminar aquela lição.", preco: 12, pode: E.vidas < VIDAS_MAX, motivo: "Vidas já estão cheias" },
  ];
  render(`
    <section class="loja-topo">
      <div><span class="selo">🛍️ Loja</span><h1>Gaste suas <span class="destaque">moedas</span></h1>
      <p class="sub">Ganhe moedas em lições, baús, desafios do dia, conquistas e no fliperama.</p></div>
      <div class="saldo">🪙 <b>${E.moedas}</b><small>moedas</small></div>
    </section>
    <h2>Itens</h2>
    <div class="grade-loja">${itens.map(it => `
      <div class="item-loja">
        <span class="il-ic">${it.ic}</span>
        <div><b>${it.nome}</b><p class="sub">${it.desc}</p>
        ${it.id === "protetor" ? `<small>Você tem: ${E.protetor}</small>` : ""}${it.id.startsWith("vida") ? `<small>Vidas: ${E.vidas}/${VIDAS_MAX}</small>` : ""}</div>
        <button class="btn" data-comprar="${it.id}" ${!it.pode || E.moedas < it.preco ? "disabled" : ""} title="${!it.pode ? it.motivo : ""}">🪙 ${it.preco}</button>
      </div>`).join("")}
    </div>
    <h2>Avatares</h2>
    <div class="grade-avatares">${AVATARES.map(a => {
      const tem = E.avatares.includes(a.e);
      const usando = E.avatar === a.e;
      return `<button class="avatar-loja ${usando ? "usando" : ""} ${tem ? "tem" : ""}" data-avatar="${a.e}">
        <span class="av">${a.e}</span>
        <small>${usando ? "Usando" : tem ? "Usar" : "🪙 " + a.preco}</small>
      </button>`;
    }).join("")}</div>`);

  $$("[data-comprar]").forEach(b => b.onclick = () => {
    const it = itens.find(x => x.id === b.dataset.comprar);
    if (!gastarMoedas(it.preco)) return;
    if (it.id === "vidas") ganharVidas(VIDAS_MAX);
    if (it.id === "vida1") ganharVidas(1);
    if (it.id === "protetor") { E.protetor++; salvar(); }
    som("moeda");
    toast(it.ic, "Comprado!", it.nome);
    telaLoja();
  });
  $$("[data-avatar]").forEach(b => b.onclick = () => {
    const a = AVATARES.find(x => x.e === b.dataset.avatar);
    if (!E.avatares.includes(a.e)) {
      if (E.moedas < a.preco) { tremer(b); som("errado"); return toast("🪙", "Moedas insuficientes", `Faltam ${a.preco - E.moedas} moedas.`); }
      gastarMoedas(a.preco);
      E.avatares.push(a.e);
      som("moeda");
      toast(a.e, "Novo avatar!", "Já está equipado.");
    }
    E.avatar = a.e;
    checarTudo();
    salvar();
    telaLoja();
  });
}

// ---------- Perfil ----------
function telaPerfil() {
  const nivel = nivelDe(E.xp);
  const ini = xpDoNivel(nivel), fim = xpDoNivel(nivel + 1);
  const precisao = Math.round((E.stats.acertos / Math.max(1, E.stats.acertos + E.stats.erros)) * 100);
  const totalConq = Object.keys(E.conquistas).length;
  render(`
    <section class="perfil-topo">
      <div class="avatar-grande">${E.avatar}<span class="nivel-selo">${nivel}</span></div>
      <div class="pt-info">
        <input class="nome-input" id="pNome" value="${esc(E.nome)}" maxlength="20" aria-label="Seu nome">
        <p class="sub">Nível ${nivel} · ${E.xp} XP no total</p>
        <div class="barra"><div style="width:${((E.xp - ini) / (fim - ini)) * 100}%"></div></div>
        <small class="sub">${fim - E.xp} XP para o nível ${nivel + 1}</small>
      </div>
    </section>

    <div class="grade-stats">
      <div class="stat"><span>🔥</span><b>${E.streak}</b><small>dias de ofensiva</small></div>
      <div class="stat"><span>⚡</span><b>${E.xp}</b><small>XP total</small></div>
      <div class="stat"><span>📚</span><b>${E.stats.licoes}</b><small>lições</small></div>
      <div class="stat"><span>🎯</span><b>${precisao}%</b><small>precisão</small></div>
      <div class="stat"><span>💯</span><b>${E.stats.perfeitas}</b><small>lições perfeitas</small></div>
      <div class="stat"><span>⚡</span><b>${E.stats.comboMax}</b><small>maior sequência</small></div>
    </div>

    <div class="duas-colunas">
      <div class="cartao-p">
        <h3>Sua semana</h3>
        ${graficoSemana()}
      </div>
      <div class="cartao-p">
        <h3>Idiomas</h3>
        ${Object.entries(IDIOMAS).map(([c, i]) => `
          <div class="linha-idioma">${svgBandeira(c, "bandeira mini")}<b>${i.nome}</b>
            <div class="barra fina" style="--c1:${i.tema.c1};--c2:${i.tema.c2}"><div style="width:${percentualIdioma(c)}%"></div></div>
            <small>${totalAprendidas(c)} palavras</small></div>`).join("")}
        <h3>Recordes do fliperama</h3>
        ${JOGOS.map(j => `<div class="linha-recorde"><span>${j.icone} ${j.nome}</span><b>${E.recordes[j.id] || 0}</b></div>`).join("")}
      </div>
    </div>

    <h2>Conquistas <small class="sub">${totalConq}/${CONQUISTAS.length}</small></h2>
    <div class="grade-conquistas">${CONQUISTAS.map(c => `
      <div class="conquista ${E.conquistas[c.id] ? "ganha" : ""}" title="${c.desc}">
        <span>${c.icone}</span><b>${c.nome}</b><small>${c.desc}</small>
      </div>`).join("")}
    </div>

    <h2>Configurações</h2>
    <div class="cartao-p config">
      <div class="cfg-linha"><div><b>Meta diária</b><small>Quanto XP você quer ganhar por dia</small></div>
        <div class="segmentado" id="pMeta">${[10, 30, 50, 100].map(v => `<button class="${E.meta === v ? "on" : ""}" data-v="${v}">${v}</button>`).join("")}</div></div>
      <div class="cfg-linha"><div><b>Efeitos sonoros</b><small>Sons de acerto, erro e recompensas</small></div>
        <button class="interruptor ${E.som ? "on" : ""}" id="pSom" aria-label="Som"><span></span></button></div>
      <div class="cfg-linha"><div><b>Apagar progresso</b><small>Zera XP, moedas, trilhas e conquistas</small></div>
        <button class="btn perigo pequeno" id="pReset">Apagar tudo</button></div>
    </div>`);

  $("#pNome").onchange = e => { E.nome = e.target.value.trim() || "Você"; salvar(); toast("✏️", "Nome salvo", E.nome); };
  $$("#pMeta button").forEach(b => b.onclick = () => { E.meta = +b.dataset.v; salvar(); telaPerfil(); });
  $("#pSom").onclick = () => { E.som = !E.som; salvar(); som("clique"); telaPerfil(); };
  $("#pReset").onclick = async () => {
    if (!(await confirmar("Apagar todo o progresso?", "Isso não pode ser desfeito.", "Apagar tudo"))) return;
    E = estadoPadrao();
    salvar();
    ir("inicio");
  };
}
