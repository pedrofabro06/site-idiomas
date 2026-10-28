// ============================================================
//  Inicialização do Poliglota
// ============================================================
$("#marcaLumi").innerHTML = lumi("feliz", "marca-svg");
$("#pillIdioma").onclick = () => ir("idiomas");
$("#pillVidas").onclick = () => { atualizarVidas(); if (E.vidas < VIDAS_MAX) ir("loja"); else toast("❤️", "Vidas cheias", "Você tem todas as 5 vidas."); };
$("#pillMoedas").onclick = () => ir("loja");
$("#pillStreak").onclick = () => ir("perfil");

garantirDia();
salvar();
mostrarRota();

// Atualiza vidas e o topo de tempos em tempos
setInterval(() => { atualizarVidas(); atualizarTopo(); }, 30000);
