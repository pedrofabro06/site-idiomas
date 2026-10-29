// ============================================================
//  Teste de nivelamento adaptativo (A1 → C1)
//  Começa no A2. Acertou 3 de 4? Sobe um nível. Errou? Desce
//  ou termina. O resultado libera a trilha até o seu nível.
// ============================================================
const NIVEIS_TESTE = ["A1", "A2", "B1", "B2", "C1"];

function perguntasDoNivel(nivel) {
  const temas = TEMAS.filter(t => t.nivel === nivel);
  const W = temas.flatMap(palavrasDoTema);
  const tipos = embaralhar(["traduzir", "reverso", "completar", "ouvir"]);
  // Palavras diferentes em cada pergunta
  const ws = sortear(W, 4);
  return tipos.map((tipo, i) => tipo === "completar"
    ? { tipo, f: umDe(umDe(temas).frases), temas }
    : { tipo, w: ws[i] });
}

// Portão da trilha: antes de começar um idioma, o aluno faz o teste
// (ou diz que nunca estudou). A trilha é montada a partir do resultado.
function telaPortaoNivel() {
  const i = IDIOMAS[E.idioma];
  render(`
    <section class="portao">
      <div class="portao-bandeira">${svgBandeira(E.idioma, "bandeira grande")}</div>
      ${lumi("uau", "grande flutua")}
      <span class="selo">🔒 Trilha de ${i.nome} bloqueada</span>
      <h1>Primeiro, vamos descobrir <span class="destaque">o que você já sabe</span></h1>
      <p class="sub">Sua trilha é montada a partir do seu nível. Quem já sabe o básico começa direto no intermediário, e quem nunca estudou começa do primeiro passo. Assim você não perde tempo com o que é fácil demais, nem trava no que é difícil demais.</p>
      <div class="portao-passos">
        <div><b>1</b><span>Teste de uns 3 minutos, que se adapta às suas respostas</span></div>
        <div><b>2</b><span>Descobrimos seu nível, de A1 a C1</span></div>
        <div><b>3</b><span>Sua trilha começa no ponto certo. O básico fica na aba Fundamentos</span></div>
      </div>
      <div class="acoes coluna portao-acoes">
        <button class="btn grande" id="pgTeste">📏 Fazer o teste e liberar minha trilha</button>
        <button class="btn secundario" id="pgZero">🌱 Nunca estudei ${i.nome}, quero começar do zero</button>
        <button class="btn texto" id="pgTrocar">Trocar de idioma</button>
      </div>
    </section>`);
  $("#pgTeste").onclick = () => iniciarNivelamento();
  $("#pgZero").onclick = () => {
    E.nivelamento[E.idioma] = { nivel: null, zero: true, data: hoje() };
    salvar();
    toast("🌱", "Trilha liberada!", "Começando do primeiro passo. Bora!");
    ir("trilha");
  };
  $("#pgTrocar").onclick = () => ir("idiomas");
}

function iniciarNivelamento() {
  let i = 1, aprovado = -1, fila = [], pos = 0, acertosNivel = 0, respondidas = 0;
  const testados = new Set();
  document.body.classList.add("em-licao");
  render(`
    <div class="licao">
      <div class="licao-topo">
        <button class="fechar" id="nSair" title="Sair">✕</button>
        <div class="barra grossa"><div id="nBarra" style="width:0%"></div></div>
        <span class="nivel-chip" id="nChip"></span>
      </div>
      <p class="sub centro" id="nInfo"></p>
      <div class="licao-corpo" id="nCorpo"></div>
    </div>
    <div class="licao-rodape" id="nRodape"><div class="rodape-interno">
      <div class="fb" id="nFb"></div>
      <div class="rodape-botoes">
        <button class="btn secundario" id="nNaoSei">Não sei</button>
        <button class="btn" id="nBtn" disabled>Responder</button>
      </div>
    </div></div>`);
  const corpo = $("#nCorpo"), btn = $("#nBtn"), rodape = $("#nRodape");
  let ctx = null, travado = false;
  $("#nSair").onclick = async () => {
    if (await confirmar("Sair do teste?", "Sem o teste a trilha continua como estava. Você pode fazer o teste quando quiser.", "Sair", "Continuar")) ir("trilha");
  };

  function iniciarNivel() {
    testados.add(i);
    fila = perguntasDoNivel(NIVEIS_TESTE[i]);
    pos = 0; acertosNivel = 0;
    mostrar();
  }
  function mostrar() {
    if (pos >= fila.length) return avaliarNivel();
    travado = false;
    const item = fila[pos];
    $("#nChip").textContent = "Nível " + NIVEIS_TESTE[i];
    $("#nInfo").textContent = `Pergunta ${respondidas + 1} · responda sem pressa`;
    $("#nBarra").style.width = Math.min(95, respondidas * 7) + "%";
    rodape.className = "licao-rodape";
    $("#nFb").innerHTML = "";
    btn.disabled = true;
    corpo.innerHTML = "";
    const tela = el(`<div class="exercicio entra"></div>`);
    corpo.appendChild(tela);
    ctx = { pronto: b => { if (!travado) btn.disabled = !b; }, concluir() {}, permitirPular() {}, pular() {}, verificar: null, tecla: null };
    TIPOS[item.tipo](tela, item, ctx);
    teclas = e => {
      if (e.key === "Enter" && !btn.disabled) btn.click();
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 9 && ctx.tecla) ctx.tecla(n);
    };
  }
  function seguir(certo) {
    travado = true;
    respondidas++;
    if (certo) acertosNivel++;
    rodape.className = "licao-rodape " + (certo ? "ok" : "erro");
    $("#nFb").innerHTML = `<b>${certo ? "Certo!" : "Anotado."}</b>`;
    som(certo ? "certo" : "clique");
    btn.disabled = true;
    setTimeout(() => { pos++; mostrar(); }, 650);
  }
  btn.onclick = () => { if (!btn.disabled && ctx.verificar && !travado) { corpo.classList.add("travado"); seguir(ctx.verificar().certo); corpo.classList.remove("travado"); } };
  $("#nNaoSei").onclick = () => { if (!travado) seguir(false); };

  function avaliarNivel() {
    if (acertosNivel >= 3) {
      aprovado = Math.max(aprovado, i);
      if (i < NIVEIS_TESTE.length - 1 && !testados.has(i + 1)) { i++; toast("⬆️", "Subindo de nível", "Agora perguntas de nível " + NIVEIS_TESTE[i]); return iniciarNivel(); }
    } else if (i > 0 && !testados.has(i - 1) && aprovado < i - 1) {
      i--; return iniciarNivel();
    }
    fim();
  }
  function fim() {
    teclas = null;
    document.body.classList.remove("em-licao");
    const nivel = aprovado >= 0 ? NIVEIS_TESTE[aprovado] : null;
    E.nivelamento[E.idioma] = { nivel, data: hoje() };
    // A trilha passa a começar no nível seguinte; o que está abaixo vai para Fundamentos
    const comeca = ORDEM_NIVEIS[inicioTrilha()];
    const basicas = temasFundamentos().length;
    const naSuaTrilha = temasDaTrilha().length;
    E.moedas += 30;
    salvar();
    checarTudo();
    som("fim");
    confetes(100);
    const info = NIVEIS.find(n => n.id === nivel);
    render(`
      <div class="fim">
        ${lumi("festa", "grande pulando")}
        <span class="selo">📏 Resultado do teste · ${IDIOMAS[E.idioma].nome}</span>
        <div class="selo-nivel">${nivel || "Pré-A1"}</div>
        <h1><span class="destaque">${info ? info.nome : "Começando do zero"}</span></h1>
        <p class="sub">${info ? info.desc : "Sem problema! Todo mundo começa em algum lugar. A trilha vai te levar do básico ao avançado."}</p>
        <div class="resultado-trilha">
          <div><b>🗺️ ${naSuaTrilha}</b><span>unidades na sua trilha, começando no <b>${comeca}</b></span></div>
          <div><b>🧱 ${basicas}</b><span>${basicas ? "unidades básicas na aba Fundamentos, para revisar quando quiser" : "unidades básicas: você vai passar por todas na trilha"}</span></div>
        </div>
        <p class="sub">+30 🪙 por fazer o teste</p>
        <div class="acoes"><button class="btn grande" id="nOk">Ir para a trilha</button></div>
      </div>`);
    $("#nOk").onclick = () => ir("trilha");
  }
  iniciarNivel();
}
