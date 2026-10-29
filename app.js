// ============================================================
//  Inicialização do DrPolygo
// ============================================================
desenharMarca();
$("#pillIdioma").onclick = () => ir("idiomas");
$("#pillVidas").onclick = () => { atualizarVidas(); if (E.vidas < VIDAS_MAX) ir("loja"); else toast("❤️", "Vidas cheias", "Você tem todas as 5 vidas."); };
$("#pillMoedas").onclick = () => ir("loja");
$("#pillStreak").onclick = () => ir("perfil");
$("#pillConta").onclick = () => (logado() ? ir("perfil") : abrirLogin({ titulo: "Entrar ou criar conta", texto: "Salve seu progresso e continue de qualquer aparelho." }));

(async function iniciar() {
  garantirDia();
  // Quem já usava o site antes do questionário não precisa responder
  if (!E.onboarding && (E.xp > 0 || E.idioma)) E.onboarding = { legado: true, data: hoje() };
  salvar();
  await carregarConfig();
  capturarOrigem();
  await carregarConta();
  if (logado()) await sincronizarAoEntrar();
  if (!E.onboarding && !["#planos", "#admin"].includes(location.hash)) telaBoasVindas();
  else mostrarRota();
})();

// Atualiza vidas e o topo de tempos em tempos
setInterval(() => { atualizarVidas(); atualizarTopo(); }, 30000);
