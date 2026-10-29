// ============================================================
//  Telas: navegação, início, idiomas, trilha, fliperama, loja, perfil
// ============================================================
const TELAS = {
  inicio: () => telaInicio(),
  idiomas: () => telaIdiomas(),
  trilha: () => telaTrilha(),
  fundamentos: () => telaTrilha("fundamentos"),
  praticar: () => telaPraticar(),
  revisao: () => {
    if (cartoesVencidos().length) return iniciarLicao({ revisao: true });
    telaPraticar();
    toast("🧠", "Nada para revisar agora", "As palavras reaparecem na hora certa.");
  },
  pronuncia: () => telaPronuncia(),
  tutor: () => telaTutor(),
  licaoia: () => telaLicaoIA(),
  metodo: () => telaMetodo(),
  planos: () => telaPlanos(),
  historia: () => telaHistoria(),
  admin: () => telaAdmin(),
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
  const precisaIdioma = ["trilha", "fundamentos", "fliperama", "praticar", "revisao", "pronuncia", "tutor", "licaoia"];
  if (precisaIdioma.includes(nome) && !E.idioma) { telaIdiomas(); marcarNav("trilha"); return; }
  (TELAS[nome] || TELAS.inicio)();
  marcarNav(["revisao", "pronuncia", "tutor", "licaoia", "metodo"].includes(nome) ? "praticar" : nome === "fundamentos" ? "trilha" : nome);
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
  // Botão da conta: aparece só quando o servidor tem contas ligadas
  const pc = $("#pillConta");
  if (pc && typeof CONFIG !== "undefined") {
    pc.hidden = !CONFIG.contas;
    if (CONFIG.contas) {
      const u = CONTA.usuario;
      pc.classList.toggle("pro", !!u && u.plano === "pro");
      pc.innerHTML = u
        ? (u.foto ? `<img src="${esc(u.foto)}" alt="" referrerpolicy="no-referrer">` : `<span>${E.avatar}</span>`) + (u.plano === "pro" ? `<b class="mini-selo">🎫</b>` : "")
        : `👤 <b>Entrar</b>`;
    }
  }
}

function selecionarIdioma(cod) {
  E.idioma = cod;
  salvar();
  aplicarTema(cod);
  som("pop");
  toast("🎨", `${IDIOMAS[cod].nome} selecionado`, `${IDIOMAS[cod].ola}! Tudo ganhou as cores da bandeira.`);
  ir("trilha");
  // Primeira vez neste idioma: a trilha mostra o portão do teste de nível
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
          : "Uma explosão espalhou as palavras do mundo e o Doutor Polygo precisa de um aprendiz para recuperá-las. Trilha de fases, mascotes, minijogos e um tutor com IA, em cinco idiomas."}</p>
        <div class="hero-acoes">
          ${idi
            ? `<button class="btn grande" id="hContinuar">${prox ? "▶ Continuar trilha" : "🕹️ Ir ao fliperama"}</button>
               <button class="btn secundario" id="hTrocar">Trocar idioma</button>`
            : `<button class="btn grande" id="hComecar">Começar agora — é grátis</button>`}
        </div>
        ${idi ? `<div class="hero-mini">
          <span>📏 Estudando <b>${nivelAtual()}</b></span><span>⚡ Nível <b>${nivel}</b></span><span>🔥 <b>${E.streak}</b> dia${E.streak === 1 ? "" : "s"}</span><span>📚 <b>${totalAprendidas()}</b> palavras</span>
        </div>` : `<div class="hero-mini"><span>🗺️ ${TEMAS.length} unidades do A1 ao C1</span><span>🧠 Repetição espaçada</span><span>🤖 Tutor com IA</span><span>🎤 Nota de pronúncia</span></div>`}
      </div>
      <div class="hero-palco">
        <div class="orbita">${Object.keys(IDIOMAS).map((c, i) => `<span class="orb" style="--i:${i}">${svgBandeira(c, "bandeira")}</span>`).join("")}</div>
        ${desenharDrPolygo("feliz", "grande flutua")}
        <div class="hero-mascote">${lumi("festa", "mini flutua")}</div>
        <div class="balao-lumi">${idi ? esc(idi.vamos) : "Olá, Aprendiz! Eu sou o Doutor Polygo.<br>Preciso da sua ajuda!"}</div>
      </div>
    </section>

    ${idi ? `
    <section class="painel">
      ${(() => { const r = resumoSRS(); return `<div class="cartao-p revisao-card ${r.vencidos ? "tem" : ""}">
        <div><h3>🧠 Revisão inteligente</h3>
        <p class="sub">${r.vencidos ? `<b>${r.vencidos} palavra${r.vencidos > 1 ? "s" : ""}</b> no ponto certo de revisar. Revisar agora é o que fixa na memória.` : r.total ? `Nada para revisar agora. ${r.dominados} de ${r.total} palavras já estão na memória de longo prazo.` : "Conforme você acerta palavras, elas entram aqui e voltam na hora certa para você não esquecer."}</p></div>
        <button class="btn ${r.vencidos ? "" : "secundario"}" id="hRevisar" ${r.vencidos ? "" : "disabled"}>${r.vencidos ? `Revisar ${r.vencidos}` : "Em dia ✔"}</button>
      </div>`; })()}
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

    <section class="teaser-historia">
      <div class="th-arte">${desenharDrPolygo("uau", "media")}${desenharMascote("kiko", "festa", "mini")}${desenharMascote("bit", "feliz", "mini")}${desenharMascote("draco", "uau", "mini")}</div>
      <div>
        <span class="selo">📖 A história</span>
        <h2>KABUM! As palavras do mundo fugiram</h2>
        <p class="sub">O Doutor Polygo tentou criar uma máquina que ensinava qualquer idioma em um segundo. Ela explodiu, espalhou as palavras pelo mundo e deu vida aos mascotes do laboratório. Cada lição sua recupera um pedaço do que foi perdido.</p>
        <a class="btn secundario" href="#historia">Ler a história completa</a>
      </div>
    </section>

    <section>
      <div class="titulo-secao"><h2>O método Dr. Polygo</h2><p class="sub">Não existe uma mágica única. O que a pesquisa mostra é que algumas técnicas funcionam muito melhor que as outras, e o DrPolygo junta todas elas.</p></div>
      <div class="grade-como">${PILARES.slice(0, 6).map((p, i) => `
        <div class="como-card" style="--d:${i}"><span>${p.ic}</span><b>${p.nome}</b><p>${p.curto}</p></div>`).join("")}
      </div>
      <div class="acoes"><a class="btn secundario" href="#metodo">Ver o método completo e a ciência por trás</a></div>
    </section>`);

  ligarCardsIdiomas();
  if (idi) {
    $("#hContinuar").onclick = () => {
      if (!E.nivelamento[E.idioma]) return ir("trilha"); // passa pelo teste de nível primeiro
      if (!prox) return ir("fliperama");
      if (prox.nivel === 4) return ir("trilha");
      iniciarLicao({ tema: prox.tema, nivel: prox.nivel });
    };
    $("#hTrocar").onclick = () => ir("idiomas");
    $("#pdSom").onclick = () => falar(alvo(pw.p));
    $("#hRevisar").onclick = () => iniciarLicao({ revisao: true });
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
  { ic: "★", nome: "Lição 2", desc: "Entenda como o idioma funciona, aprenda mais 4 palavras e as primeiras frases." },
  { ic: "★", nome: "Lição 3", desc: "As últimas 4 palavras, um diálogo de verdade e um erro clássico de brasileiro para não cometer." },
  { ic: "👑", nome: "Desafio", desc: "Prova final da unidade: escrita, ditado, diálogo e fala. Vale coroa e mais XP." },
  { ic: "🎁", nome: "Baú", desc: "Abra para ganhar moedas." },
];
const DESLOCAMENTO = [0, 70, 100, 70, 0];

function telaTrilha(modo = "trilha") {
  const idi = IDIOMAS[E.idioma];
  // Sem teste ainda: quem já tem progresso (versão antiga) segue normal; os novos passam pelo teste
  if (!E.nivelamento[E.idioma]) {
    const temProgresso = Object.values(E.prog[E.idioma] || {}).some(p => p.licao > 0);
    if (!temProgresso) return telaPortaoNivel();
    E.nivelamento[E.idioma] = { nivel: null, legado: true, data: hoje() };
    salvar();
  }
  const prox = proximaLicao();
  const fundamentos = modo === "fundamentos";
  const nFund = temasFundamentos().length;
  const teste = E.nivelamento[E.idioma];
  const comeca = ORDEM_NIVEIS[inicioTrilha()];
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
        ${(() => { const v = resumoSRS().vencidos; return `<button class="btn ${v ? "" : "secundario"}" id="tRevisar">🧠 Revisar${v ? ` <span class="bolinha">${v}</span>` : ""}</button>`; })()}
        <button class="btn secundario" id="tTreinar">💪 Treinar <small>+1 ❤️</small></button>
        <button class="btn secundario" id="tNivel">📏 ${teste.nivel ? "Nível " + teste.nivel + " · refazer teste" : "Refazer teste de nível"}</button>
        <button class="btn secundario" id="tTrocar">Trocar idioma</button>
      </div>
    </section>
    <div class="abas-trilha">
      <a class="aba ${fundamentos ? "" : "on"}" href="#trilha">🗺️ Minha trilha <small>a partir do ${comeca}</small></a>
      <a class="aba ${fundamentos ? "on" : ""}" href="#fundamentos">🧱 Fundamentos <small>${nFund ? nFund + " unidades básicas" : "está na sua trilha"}</small></a>
    </div>
    ${fundamentos ? `<div class="aviso-trilha">${nFund
      ? `🧱 Aqui fica o básico que o teste mostrou que você já sabe. Está tudo liberado, sem ordem: use para revisar ou tirar uma dúvida. Isso não muda sua trilha.`
      : `🌱 Você começou do zero, então todo o básico já está na sua trilha principal. Quando você fizer o teste de novo e subir de nível, as unidades fáceis aparecem aqui.`}</div>`
      : `<div class="aviso-trilha">${teste.nivel ? `📏 Seu teste deu <b>${teste.nivel}</b>, então sua trilha começa no <b>${comeca}</b>. O básico está na aba Fundamentos.` : teste.zero ? `🌱 Começando do zero: sua trilha vai do primeiro passo até o avançado.` : `🗺️ Sua trilha completa, do A1 ao C1. Faça o teste de nível para pular o que você já sabe.`}</div>`}`;

  let nivelAnterior = null, numero = 0;
  TEMAS.forEach((t, i) => {
    if (naTrilha(t) === fundamentos) return; // cada aba mostra só as suas unidades
    numero++;
    const p = progTema(t.id);
    const lib = temaDesbloqueado(i);
    const lado = numero % 2 ? 1 : -1;
    if (t.nivel !== nivelAnterior) {
      nivelAnterior = t.nivel;
      const info = NIVEIS.find(n => n.id === t.nivel);
      const temasNivel = TEMAS.filter(x => x.nivel === t.nivel && naTrilha(x) !== fundamentos);
      const feitos = temasNivel.filter(x => progTema(x.id).licao >= 4).length;
      html += `<div class="cabecalho-nivel" id="nivel-${t.nivel}">
        <span class="selo-nivel pequeno">${t.nivel}</span>
        <div><b>Face ${ORDEM_NIVEIS.indexOf(t.nivel) + 1} do Poliedro · ${info.nome}</b><small>${info.desc}</small></div>
        <span class="cn-progresso">${feitos}/${temasNivel.length} unidades</span>
      </div>`;
    }
    html += `<section class="unidade ${lib ? "" : "bloqueada"}" id="u${i}">
      <div class="unidade-banner ${numero % 2 ? "" : "alt"}">
        <div>
          <small>${fundamentos ? "Fundamentos" : "Unidade " + numero} · ${t.nivel} ${p.licao >= 4 ? "· 👑 dominada" : ""}</small>
          <h2>${t.icone} ${t.titulo}</h2>
          <p>${t.desc}</p>
        </div>
        <button class="btn-vocab" data-vocab="${i}">📖 Estudar</button>
      </div>
      <div class="caminho">`;
    // Unidade ainda bloqueada: mostra só uma linha compacta de cadeados, sem o caminho inteiro
    if (!lib) {
      html += `<button class="caminho-travado bloqueado" data-t="${i}" data-k="0">
        <span class="ct-pontos">${NOS.map((no, k) => `<i class="tipo-${k}">${k === 3 ? "👑" : k === 4 ? "🎁" : "🔒"}</i>`).join("")}</span>
        <small>Vença o desafio 👑 da unidade anterior para liberar</small>
      </button></div></section>`;
      return;
    }
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
  if (!numero) html += `<div class="vazio">${lumi("feliz", "media")}<p class="sub">Nada por aqui ainda.</p></div>`;
  render(html);

  $("#tTreinar").onclick = () => iniciarLicao({ treino: true });
  $("#tRevisar").onclick = () => iniciarLicao({ revisao: true });
  $("#tNivel").onclick = () => iniciarNivelamento();
  $("#tTrocar").onclick = () => ir("idiomas");
  $$("[data-vocab]").forEach(b => b.onclick = () => modalEstudar(TEMAS[+b.dataset.vocab]));
  $$(".no, .caminho-travado").forEach(b => b.onclick = () => clicarNo(+b.dataset.t, +b.dataset.k, b));

  // Rola até a fase atual (só na trilha principal)
  const atual = $(".no.atual");
  if (atual && !fundamentos) setTimeout(() => atual.scrollIntoView({ behavior: "smooth", block: "center" }), 250);
}

function clicarNo(i, k, botao) {
  const t = TEMAS[i];
  const p = progTema(t.id);
  if (botao.classList.contains("bloqueado")) {
    tremer(botao);
    som("errado");
    toast("🔒", "Fase bloqueada", temaDesbloqueado(i) ? "Conclua a fase anterior primeiro." : "Vença o desafio 👑 da unidade anterior para liberar.");
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
    { aoFechar: () => { if (p.bau) mostrarRota(); } });
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

// "Estudar": explicação, diálogo, palavras e frases da unidade, tudo com áudio
function modalEstudar(t) {
  const aprendidas = new Set(((E.aprendidas[E.idioma] || {})[t.id]) || []);
  const nota = t.notas && t.notas[E.idioma];
  const abas = [
    nota && ["nota", "💡 Como funciona"],
    t.dialogo && ["dialogo", "🎭 Diálogo"],
    ["palavras", `🔤 Palavras <small>${t.palavras.length}</small>`],
    ["frases", `💬 Frases <small>${t.frases.length}</small>`],
  ].filter(Boolean);
  const m = abrirModal(`
    <h2>${t.icone} ${t.titulo}</h2>
    <div class="estudar-abas">${abas.map(([id, rotulo]) => `<button class="estudar-aba" data-aba="${id}">${rotulo}</button>`).join("")}</div>
    <div class="estudar-corpo" id="eCorpo"></div>
    <div class="acoes"><button class="btn" data-fechar>Fechar</button></div>`,
    { classe: "larga", aoFechar: () => window.speechSynthesis?.cancel() });
  const corpo = $("#eCorpo", m.el);
  const mic = (tipo, i) => Reconhecimento ? `<button class="som-btn mic-btn" data-${tipo}="${i}">🎤</button>` : "";
  const desenhar = {
    nota: () => `<div class="nota-card"><h3>${esc(nota[0])}</h3><p class="nota-texto">${nota[1]}</p>
      <div class="nota-ex">${nota[2].map(([a, pt], i) => `<div class="ex-linha"><button class="som-btn" data-ex="${i}">🔊</button><span><b>${esc(a)}</b><small>${esc(pt)}</small></span></div>`).join("")}</div></div>`,
    dialogo: () => `<div class="dlg-acoes"><button class="btn pequeno" id="dTocar">▶ Ouvir o diálogo</button><button class="btn secundario pequeno" id="dLento">🐢 Devagar</button></div>
      <div class="dlg">${t.dialogo.map((l, i) => `
        <div class="dlg-linha ${l[0] === "A" ? "a" : "b"}">
          <span class="dlg-av">${l[0] === "A" ? "🦊" : "🐼"}</span>
          <div class="dlg-balao"><b>${esc(alvoFala(l))}</b><small>${esc(l[1])}</small></div>
          <button class="som-btn" data-fala="${i}">🔊</button>
          ${mic("pd", i)}
        </div>`).join("")}</div>
      <p class="sub pequena">Ouça uma vez lendo a tradução. Depois, tente entender só de ouvido e repita as falas em voz alta.</p>`,
    palavras: () => `<p class="sub">🔊 ouvir · 🎤 treinar a pronúncia · ✅ palavra que você já acertou.</p>
      <div class="vocab-lista">${t.palavras.map((p, i) => `
        <div class="vocab-item">
          <span class="vi-emoji">${p[6]}</span>
          <span class="vi-txt"><b>${esc(alvo(p))} ${aprendidas.has(i) ? "✅" : ""}</b><small>${esc(p[0])}</small></span>
          <button class="som-btn" data-i="${i}">🔊</button>
          ${mic("pi", i)}
        </div>`).join("")}</div>`,
    frases: () => `<p class="sub">Frases-chave: blocos prontos que os nativos usam o tempo todo. Aprenda inteiras, não palavra por palavra.</p>
      <div class="vocab-lista">${t.frases.map((f, i) => `
        <div class="vocab-item frase">
          <span class="vi-txt"><b>${esc(alvo(f))}</b><small>${esc(f[0])}</small></span>
          <button class="som-btn" data-f="${i}">🔊</button>
          ${mic("pf", i)}
        </div>`).join("")}</div>`,
  };
  const pronunciar = (texto, pt) => { m.fechar(); abrirPronuncia(texto, pt); };
  function mostrar(id) {
    window.speechSynthesis?.cancel();
    $$(".estudar-aba", m.el).forEach(b => b.classList.toggle("on", b.dataset.aba === id));
    corpo.innerHTML = desenhar[id]();
    $$("[data-ex]", corpo).forEach(b => b.onclick = () => falar(nota[2][+b.dataset.ex][0]));
    $$("[data-i]", corpo).forEach(b => b.onclick = () => falar(alvo(t.palavras[+b.dataset.i])));
    $$("[data-f]", corpo).forEach(b => b.onclick = () => falar(alvo(t.frases[+b.dataset.f])));
    $$("[data-pi]", corpo).forEach(b => b.onclick = () => { const p = t.palavras[+b.dataset.pi]; pronunciar(alvo(p), p[0]); });
    $$("[data-pf]", corpo).forEach(b => b.onclick = () => { const f = t.frases[+b.dataset.pf]; pronunciar(alvo(f), f[0]); });
    $$("[data-pd]", corpo).forEach(b => b.onclick = () => { const l = t.dialogo[+b.dataset.pd]; pronunciar(alvoFala(l), l[1]); });
    if (id === "dialogo") {
      const linhas = $$(".dlg-linha", corpo);
      const marcar = i => linhas.forEach((x, k) => x.classList.toggle("falando", k === i));
      const tocar = lento => falarDialogo(t.dialogo, { lento, aoLinha: marcar, aoFim: () => marcar(-1) });
      $("#dTocar", corpo).onclick = () => tocar(false);
      $("#dLento", corpo).onclick = () => tocar(true);
      $$("[data-fala]", corpo).forEach(b => b.onclick = () => falarDialogo([t.dialogo[+b.dataset.fala]]));
    }
  }
  $$(".estudar-aba", m.el).forEach(b => b.onclick = () => mostrar(b.dataset.aba));
  mostrar(abas[0][0]);
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
    <div class="grade-jogos">${JOGOS.map((j, n) => {
      const travado = j.pro && !ehPro();
      return `
      <button class="card-jogo ${travado ? "so-pro" : ""}" data-jogo="${j.id}" style="--g1:${j.cor[0]};--g2:${j.cor[1]};animation-delay:${n * 80}ms">
        ${travado ? `<span class="selo-passaporte canto">🎫 ${NOME_PLANO()}</span>` : ""}
        <span class="cj-ic">${j.icone}</span>
        <b>${j.nome}</b>
        <p>${j.desc}</p>
        <span class="cj-rodape"><span>🏆 Recorde: <b>${E.recordes[j.id] || 0}</b></span><span class="cj-play">${travado ? "🔒 Desbloquear" : "Jogar ▶"}</span></span>
      </button>`;
    }).join("")}
    </div>`);
  $$("[data-jogo]").forEach(b => b.onclick = () => {
    const j = JOGOS.find(x => x.id === b.dataset.jogo);
    if (j.pro && !ehPro()) return abrirPaywall("jogos");
    abrirJogo(j.id);
  });
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
    <h2>Mascotes <small class="sub">liberam conforme você sobe de nível · você está no nível ${nivelDe(E.xp)}</small></h2>
    <div class="grade-mascotes">${Object.entries(MASCOTES).map(([k, m]) => {
      const tem = E.mascotes.includes(k);
      const usando = E.mascote === k;
      const liberado = nivelDe(E.xp) >= m.nivel;
      const estado = usando ? "usando" : tem ? "tem" : liberado ? "liberado" : "travado";
      return `<button class="mascote-loja ${estado}" data-mascote="${k}">
        <div class="ml-desenho">${desenharMascote(k, usando ? "festa" : "feliz", "media")}</div>
        <b>${m.nome}</b><small>${m.desc}</small>
        <span class="ml-estado">${usando ? "✔ Usando" : tem ? "Usar" : liberado ? `🪙 ${m.preco}` : `🔒 Nível ${m.nivel}`}</span>
      </button>`;
    }).join("")}</div>
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
  $$("[data-mascote]").forEach(b => b.onclick = () => {
    const k = b.dataset.mascote, m = MASCOTES[k];
    if (!E.mascotes.includes(k)) {
      if (nivelDe(E.xp) < m.nivel) { tremer(b); som("errado"); return toast("🔒", `${m.nome} libera no nível ${m.nivel}`, `Faltam ${xpDoNivel(m.nivel) - E.xp} XP. Continue estudando!`); }
      if (E.moedas < m.preco) { tremer(b); som("errado"); return toast("🪙", "Moedas insuficientes", `Faltam ${m.preco - E.moedas} moedas.`); }
      gastarMoedas(m.preco);
      E.mascotes.push(k);
      som("bau");
      confetes(80);
      toast("🎉", `${m.nome} é seu!`, m.desc);
    }
    E.mascote = k;
    desenharMarca();
    checarTudo();
    salvar();
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

    ${cartaoConta()}
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
      <div class="cfg-linha"><div><b>Mascote</b><small>Quem te acompanha nas lições</small></div>
        <div class="escolha-mascote">${E.mascotes.map(k => `
          <button class="opcao-mascote ${E.mascote === k ? "on" : ""}" data-masc="${k}">${desenharMascote(k, "feliz", "mini")}<b>${MASCOTES[k].nome}</b><small>${MASCOTES[k].desc}</small></button>`).join("")}
          <a class="opcao-mascote mais" href="#loja"><span>🛍️</span><b>Mais mascotes</b><small>${Object.keys(MASCOTES).length - E.mascotes.length} na loja</small></a></div></div>
      ${E.idioma ? `<div class="cfg-linha"><div><b>Voz do ${IDIOMAS[E.idioma].nome}</b><small>Escolha o sotaque e a velocidade da pronúncia</small></div>
        <div class="cfg-voz">
          <select class="campo pequeno" id="pVoz"></select>
          <label class="vel">🐢 <input type="range" id="pVel" min="0.6" max="1.3" step="0.05" value="${E.velocidade || 1}"> 🐇</label>
          <button class="btn secundario pequeno" id="pTestar">🔊 Testar</button>
        </div></div>` : ""}
      <div class="cfg-linha"><div><b>Efeitos sonoros</b><small>Sons de acerto, erro e recompensas</small></div>
        <button class="interruptor ${E.som ? "on" : ""}" id="pSom" aria-label="Som"><span></span></button></div>
      <div class="cfg-linha"><div><b>Apagar progresso</b><small>Zera XP, moedas, trilhas e conquistas</small></div>
        <button class="btn perigo pequeno" id="pReset">Apagar tudo</button></div>
    </div>`);

  ligarCartaoConta();
  $("#pNome").onchange = e => { E.nome = e.target.value.trim() || "Você"; salvar(); toast("✏️", "Nome salvo", E.nome); };
  $$("#pMeta button").forEach(b => b.onclick = () => { E.meta = +b.dataset.v; salvar(); telaPerfil(); });
  $("#pSom").onclick = () => { E.som = !E.som; salvar(); som("clique"); telaPerfil(); };
  $$("[data-masc]").forEach(b => b.onclick = () => {
    E.mascote = b.dataset.masc;
    salvar();
    desenharMarca();
    toast("🐦", `${nomeMascote()} agora te acompanha!`, MASCOTES[E.mascote].desc);
    telaPerfil();
  });
  if (E.idioma) {
    const sel = $("#pVoz");
    const preencher = () => {
      const vozes = vozesDoIdioma(E.idioma);
      const atual = E.vozes[E.idioma] || "";
      sel.innerHTML = `<option value="">Automática (a melhor disponível)</option>` + vozes.map(v =>
        `<option value="${esc(v.name)}" ${v.name === atual ? "selected" : ""}>${esc(v.name.replace(/^Microsoft |^Google /, ""))} · ${v.lang}${/Natural|Online/i.test(v.name) ? " ⭐" : ""}</option>`).join("");
      if (!vozes.length) sel.innerHTML = `<option value="">Nenhuma voz deste idioma instalada no seu aparelho</option>`;
    };
    preencher();
    if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = () => { if ($("#pVoz")) preencher(); };
    sel.onchange = () => { E.vozes[E.idioma] = sel.value; salvar(); falar(IDIOMAS[E.idioma].ola + "! " + IDIOMAS[E.idioma].vamos); };
    $("#pVel").oninput = e => { E.velocidade = +e.target.value; salvar(); };
    $("#pVel").onchange = () => falar(IDIOMAS[E.idioma].ola + "! " + IDIOMAS[E.idioma].vamos);
    $("#pTestar").onclick = () => falar(IDIOMAS[E.idioma].ola + "! " + IDIOMAS[E.idioma].vamos);
  }
  $("#pReset").onclick = async () => {
    if (!(await confirmar("Apagar todo o progresso?", "Isso não pode ser desfeito.", "Apagar tudo"))) return;
    E = estadoPadrao();
    salvar();
    ir("inicio");
  };
}

// ---------- O método (com a ciência por trás) ----------
const PILARES = [
  { ic: "🧠", nome: "Repetição espaçada", curto: "Cada palavra volta para revisão logo antes de você esquecer. Acertou? O intervalo aumenta. Errou? Ela volta logo.",
    longo: "Em 1885, Hermann Ebbinghaus mediu a curva do esquecimento: perdemos rápido o que acabamos de aprender. Revisar em intervalos cada vez maiores é uma das técnicas com mais evidência em toda a pesquisa sobre aprendizagem (Cepeda e colegas, 2006; Dunlosky e colegas, 2013). O DrPolygo usa um algoritmo inspirado no SM-2, o mesmo princípio do Anki.",
    onde: "Revisão inteligente", rota: "revisao" },
  { ic: "🎯", nome: "Recordação ativa", curto: "Tentar lembrar fixa muito mais do que reler. Por isso você escreve, monta frases e fala, em vez de só reconhecer.",
    longo: "É o efeito de teste (Roediger e Karpicke, 2006): quem se testou lembrou muito mais uma semana depois do que quem só releu o conteúdo. Conforme a palavra amadurece na revisão, os exercícios passam de reconhecer para produzir.",
    onde: "Trilha e revisão", rota: "trilha" },
  { ic: "🧱", nome: "Blocos prontos", curto: "Nativos não montam frases palavra por palavra: usam blocos como I'd like, it depends on, have you ever. Cada unidade traz frases-chave e um diálogo.",
    longo: "As pesquisas sobre linguagem formulaica (Alison Wray, 2002) mostram que boa parte da fala nativa é feita de sequências prontas. Num experimento de Boers e colegas (2006), alunos treinados para notar esses blocos foram avaliados como mais fluentes em entrevistas orais. Por isso cada unidade tem frases-chave e um diálogo, e não só palavras soltas.",
    onde: "Estudar uma unidade", rota: "trilha" },
  { ic: "💡", nome: "Explicação na hora certa", curto: "Entender como o idioma funciona acelera muito. Cada unidade tem um “Como funciona” curto, em português, comparando com o que você já sabe.",
    longo: "Uma meta-análise de 49 estudos (Norris e Ortega, 2000) concluiu que o ensino explícito, que explica a regra e depois pratica, dá resultados maiores e mais duradouros do que só a exposição. O DrPolygo explica pouco e no momento certo: no começo da segunda lição de cada unidade.",
    onde: "Trilha", rota: "trilha" },
  { ic: "🛡️", nome: "Feito para quem fala português", curto: "As maiores dificuldades vêm da nossa própria língua: o “i” a mais no fim das palavras, o “tchi” no lugar do t, os falsos amigos. O DrPolygo ataca exatamente esses pontos.",
    longo: "Estudos com brasileiros aprendendo inglês documentam padrões previsíveis: inserir uma vogal depois de consoantes finais, pronunciar o -ed como uma sílaba a mais e errar a sílaba tônica, o que mais prejudica a compreensão. Saber o erro antes ajuda a evitá-lo. Por isso existem o guia de sons no laboratório de pronúncia, os falsos amigos e o treino de armadilhas.",
    onde: "Armadilhas do brasileiro", rota: "armadilhas" },
  { ic: "📖", nome: "Input compreensível", curto: "Ler e ouvir conteúdo um pouco acima do seu nível é o que faz o idioma entrar. A IA escreve textos no seu nível sobre o que você gosta.",
    longo: "Stephen Krashen chamou isso de i+1: material que você entende quase todo, com um pouco de novidade. Textos chatos ou difíceis demais não funcionam. Por isso as lições sob medida deixam você escolher o tema e o nível.",
    onde: "Lição sob medida", rota: "licaoia" },
  { ic: "📊", nome: "Frequência e nível certo", curto: "Começamos pelas palavras mais usadas e seguimos os níveis A1 a C1. O teste inicial evita perder tempo com o que você já sabe.",
    longo: "As pesquisas de Paul Nation mostram que as cerca de 2.000 famílias de palavras mais frequentes cobrem por volta de 80% de um texto comum, e a New General Service List (Browne, 2013) chega a cerca de 90% com 2.800 palavras. A trilha prioriza esse vocabulário e segue o Quadro Europeu Comum de Referência (CEFR), o padrão usado em escolas e certificações no mundo todo.",
    onde: "Teste de nível", rota: "nivel" },
  { ic: "🗣️", nome: "Shadowing com nota", curto: "Ouça a voz nativa e repita na hora. O site mostra palavra por palavra o que saiu certo, para você corrigir na hora.",
    longo: "Shadowing é uma técnica usada na formação de intérpretes: imitar ritmo, entonação e sons logo depois de ouvir. Com feedback imediato, você descobre quais palavras precisa treinar, em vez de repetir o erro sem perceber.",
    onde: "Laboratório de pronúncia", rota: "pronuncia" },
  { ic: "💬", nome: "Conversa de verdade", curto: "Falar e escrever obriga o cérebro a montar frases. O tutor com IA conversa no seu nível e corrige cada erro em português.",
    longo: "A hipótese do output (Merrill Swain) mostra que produzir o idioma revela lacunas que só ouvir não revela. Correções explicadas no momento do erro, o chamado feedback corretivo, ajudam a não repetir o mesmo erro.",
    onde: "Tutor com IA", rota: "tutor" },
  { ic: "🔀", nome: "Pouco todo dia, misturado", curto: "15 minutos por dia valem mais do que 2 horas no fim de semana. Misturar tipos de exercício também fixa melhor.",
    longo: "Prática distribuída e intercalação (interleaving) estão entre as técnicas de maior utilidade na revisão de Dunlosky e colegas (2013). É por isso que existem a meta diária, a ofensiva e lições que misturam vários tipos de exercício.",
    onde: "Meta diária", rota: "inicio" },
];

function abrirPilar(rota) {
  if (rota === "nivel") return iniciarNivelamento();
  if (rota === "revisao") return iniciarLicao({ revisao: true });
  if (rota === "armadilhas") return iniciarLicao({ armadilhas: true });
  ir(rota);
}

// Referências citadas na página do método
const FONTES_METODO = [
  "Ebbinghaus, H. (1885). Über das Gedächtnis.",
  "Cepeda, N. et al. (2006). Distributed practice in verbal recall tasks. Psychological Bulletin.",
  "Dunlosky, J. et al. (2013). Improving students' learning with effective learning techniques. Psychological Science in the Public Interest.",
  "Roediger, H. & Karpicke, J. (2006). Test-enhanced learning. Psychological Science.",
  "Wray, A. (2002). Formulaic Language and the Lexicon. Cambridge University Press.",
  "Boers, F. et al. (2006). Formulaic sequences and perceived oral proficiency. Language Teaching Research.",
  "Norris, J. & Ortega, L. (2000). Effectiveness of L2 instruction: a research synthesis and meta-analysis. Language Learning.",
  "Krashen, S. (1982). Principles and Practice in Second Language Acquisition.",
  "Nation, P. (2006). How large a vocabulary is needed for reading and listening? Canadian Modern Language Review.",
  "Browne, C. (2013). The New General Service List. The Language Teacher.",
  "Swain, M. (1985). Communicative competence: some roles of comprehensible input and output.",
  "Estudos sobre a pronúncia do inglês por brasileiros (epêntese, terminação -ed e acento das palavras), como Delatorre e Koerich (UFSC).",
];

function telaMetodo() {
  render(`
    <section class="secao-topo">
      <div><span class="selo">📘 O método</span>
      <h1>Como aprender um idioma <span class="destaque">de verdade</span></h1>
      <p class="sub">Não existe um único método mágico. Mas décadas de pesquisa sobre memória e aquisição de idiomas apontam técnicas que funcionam muito melhor do que estudar listas ou só assistir aulas. O DrPolygo foi montado em cima delas.</p></div>
      ${lumi("uau", "media flutua")}
    </section>
    <div class="pilares">${PILARES.map((p, i) => `
      <article class="pilar" style="--d:${i}">
        <span class="pilar-ic">${p.ic}</span>
        <div><h3>${i + 1}. ${p.nome}</h3><p>${p.curto}</p><p class="sub">${p.longo}</p>
        <button class="btn secundario pequeno" data-rota="${p.rota}">${p.onde} →</button></div>
      </article>`).join("")}</div>
    <h2>Sua rotina ideal de 20 minutos</h2>
    <div class="rotina">
      <div class="passo"><b>1</b><div><strong>Revisão inteligente</strong><small>5 min · as palavras que estão para ser esquecidas</small></div></div>
      <div class="passo"><b>2</b><div><strong>Uma lição nova da trilha</strong><small>7 min · vocabulário, frases-chave e diálogo do seu nível</small></div></div>
      <div class="passo"><b>3</b><div><strong>Shadowing</strong><small>3 min · ouvir, repetir e ver a nota</small></div></div>
      <div class="passo"><b>4</b><div><strong>Conversa ou leitura com IA</strong><small>5 min · use o idioma de verdade</small></div></div>
    </div>
    <details class="fontes">
      <summary>📚 Pesquisas citadas nesta página</summary>
      <ul>${FONTES_METODO.map(f => `<li>${esc(f)}</li>`).join("")}</ul>
    </details>`);
  $$("[data-rota]").forEach(b => b.onclick = () => abrirPilar(b.dataset.rota));
}

// ---------- Central de prática ----------
async function telaPraticar() {
  const r = resumoSRS();
  const ia = await checarIA();
  const nv = E.nivelamento[E.idioma]?.nivel;
  const cards = [
    { id: "revisao", ic: "🧠", nome: "Revisão inteligente", desc: r.vencidos ? `${r.vencidos} palavra${r.vencidos > 1 ? "s" : ""} para revisar agora` : r.total ? `Tudo em dia · ${r.dominados}/${r.total} na memória de longo prazo` : "Acerte palavras na trilha para começar", destaque: r.vencidos > 0, cor: ["#7C3AED", "#2563EB"] },
    { id: "pronuncia", ic: "🎤", nome: "Laboratório de pronúncia", desc: "Fale e receba nota em cada palavra. Guia dos sons mais difíceis para brasileiros.", cor: ["#059669", "#0EA5E9"] },
    { id: "armadilhas", ic: "🛡️", nome: "Armadilhas do brasileiro", desc: `Os erros que todo brasileiro comete em ${IDIOMAS[E.idioma].nome.toLowerCase()} e os falsos amigos. Não gasta vidas.`, cor: ["#B45309", "#7C2D12"] },
    { id: "tutor", ic: "💬", nome: `Tutor com IA`, desc: ia ? "Converse, tire dúvidas ou simule situações reais" : "Precisa ligar a IA no servidor", ia: true, cor: ["#DB2777", "#F59E0B"] },
    { id: "licaoia", ic: "✨", nome: "Lição sob medida", desc: ia ? "Texto, vocabulário e exercícios sobre qualquer tema" : "Precisa ligar a IA no servidor", ia: true, cor: ["#EA580C", "#DC2626"] },
    { id: "nivel", ic: "📏", nome: "Teste de nível", desc: nv ? `Seu resultado: ${nv}. Refaça quando quiser.` : "Descubra seu nível do A1 ao C1", cor: ["#0891B2", "#4F46E5"] },
    { id: "metodo", ic: "📘", nome: "O método", desc: `As ${PILARES.length} técnicas com mais evidência científica`, cor: ["#475569", "#0F172A"] },
  ];
  render(`
    <section class="secao-topo">
      <div><span class="selo">🎯 Praticar · ${IDIOMAS[E.idioma].nome} · estudando ${nivelAtual()}</span>
      <h1>Treine do <span class="destaque">jeito certo</span></h1>
      <p class="sub">Revisão na hora certa, pronúncia com nota, conversa e leitura no seu nível. Tudo o que a ciência diz que funciona.</p></div>
      ${lumi("festa", "media flutua")}
    </section>
    <div class="grade-jogos">${cards.map((c, n) => `
      <button class="card-jogo ${c.destaque ? "pulsando" : ""} ${c.ia && !ia ? "desligado" : ""}" data-p="${c.id}" style="--g1:${c.cor[0]};--g2:${c.cor[1]};animation-delay:${n * 70}ms">
        <span class="cj-ic">${c.ic}</span><b>${c.nome}</b><p>${c.desc}</p>
        <span class="cj-rodape"><span>${c.ia ? (ia ? "🤖 IA ligada" : "🔌 IA desligada") : ""}</span><span class="cj-play">Abrir ▶</span></span>
      </button>`).join("")}</div>`);
  $$("[data-p]").forEach(b => b.onclick = () => abrirPilar(b.dataset.p));
}
