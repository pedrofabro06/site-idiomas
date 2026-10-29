// ============================================================
//  O mascote participa: acompanha no canto da tela, dá dicas,
//  comenta cada página e comemora durante as lições.
// ============================================================

// Dica do mascote dentro de uma página (toque no mascote para ouvir outra)
function dicaMascote(falas, humor = "feliz") {
  const lista = Array.isArray(falas) ? falas : [falas];
  return `<div class="dica-mascote" data-falas="${esc(JSON.stringify(lista))}" data-i="0">
    <button class="dm-bicho" type="button" title="Toque para eu falar mais">${lumi(humor, "mini")}</button>
    <div class="dm-balao"><b>${esc(nomeMascote())}</b><span>${lista[0]}</span></div>
  </div>`;
}
document.addEventListener("click", e => {
  const b = e.target.closest(".dm-bicho");
  if (!b) return;
  const box = b.closest(".dica-mascote");
  const falas = JSON.parse(box.dataset.falas);
  const i = (+box.dataset.i + 1) % falas.length;
  box.dataset.i = i;
  $(".dm-balao span", box).innerHTML = falas[i];
  b.classList.remove("pula"); void b.offsetWidth; b.classList.add("pula");
  som("pop");
});

// Reação rápida durante a lição (comemora sequência, anima depois de um erro)
const VIVAS = ["Mandou bem!", "Isso aí!", "Você tá voando!", "Que orgulho!", "Arrasou!", "Ninguém te segura!"];
const ANIMO = ["Errar faz parte. Bora!", "Quase! Na próxima vai.", "Respira e tenta de novo.", "Eu também errava essa!"];
function reagirMascote(humor, texto) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  $$(".reacao-mascote").forEach(x => x.remove());
  const r = el(`<div class="reacao-mascote ${humor}">${lumi(humor, "mini")}<span>${esc(texto)}</span></div>`);
  document.body.appendChild(r);
  setTimeout(() => r.classList.add("sai"), 1700);
  setTimeout(() => r.remove(), 2200);
}

// Companheiro fixo no canto: cumprimenta em cada página e dá dicas quando tocado
const FALAS_DA_PAGINA = {
  inicio: () => E.dia && E.dia.xp >= E.meta ? "Meta de hoje batida! Agora é só manter a ofensiva." : `Faltam ${Math.max(0, E.meta - (E.dia ? E.dia.xp : 0))} XP para a meta de hoje. Uma lição resolve!`,
  trilha: () => "Toque no botão Estudar de uma unidade para ver a explicação e ouvir o diálogo.",
  perfil: () => `Você já aprendeu ${totalAprendidas()} palavras. Olha só o tanto que você evoluiu!`,
  pronuncia: () => "Fale em voz alta, sem vergonha. Eu fico aqui torcendo!",
};
const DICAS_GERAIS = [
  "Estudar 10 minutos todo dia vale mais que 2 horas no domingo.",
  "Repita as frases em voz alta: a boca também precisa aprender.",
  "Errou? Ótimo! O erro mostra o que seu cérebro precisa treinar.",
  "Frases inteiras grudam mais que palavras soltas.",
  "Revisar logo antes de esquecer é o segredo da memória.",
  "Ouça o diálogo duas vezes: uma lendo e outra só de ouvido.",
];
let falouNaPagina = {};
function montarCompanheiro() {
  if ($("#companheiro")) return;
  const c = el(`<div id="companheiro" class="companheiro" aria-live="polite">
    <div class="cp-balao" hidden><button class="cp-fechar" type="button" title="Esconder">×</button><span></span></div>
    <button class="cp-bicho" type="button" title="Falar com o mascote"></button>
  </div>`);
  document.body.appendChild(c);
  $(".cp-bicho", c).onclick = () => { falarCompanheiro(umDe(DICAS_GERAIS), "uau"); som("pop"); };
  $(".cp-fechar", c).onclick = e => { e.stopPropagation(); $(".cp-balao", c).hidden = true; };
}
let timerCompanheiro = null;
function falarCompanheiro(texto, humor = "feliz") {
  montarCompanheiro();
  const c = $("#companheiro");
  $(".cp-bicho", c).innerHTML = lumi(humor, "mini");
  $(".cp-bicho", c).classList.remove("pula"); void c.offsetWidth; $(".cp-bicho", c).classList.add("pula");
  const b = $(".cp-balao", c);
  $("span", b).textContent = texto;
  b.hidden = false;
  clearTimeout(timerCompanheiro);
  timerCompanheiro = setTimeout(() => { b.hidden = true; $(".cp-bicho", c).innerHTML = lumi("feliz", "mini"); }, 6500);
}
// Sozinho, de vez em quando, o mascote se mexe (pula, acena) para mostrar que está ali
setInterval(() => {
  const b = $("#companheiro .cp-bicho");
  if (!b || document.hidden || document.body.classList.contains("em-licao") || document.body.classList.contains("em-jogo")) return;
  const acao = umDe(["pula", "acena", "gira"]);
  b.classList.remove("pula", "acena", "gira"); void b.offsetWidth; b.classList.add(acao);
}, 14000);

// Comemoração no fim da lição
function mascoteFimLicao(perfeita, chefe) {
  const frase = chefe ? "Unidade dominada! Você é fera!" : perfeita ? "Lição perfeita! Que orgulho!" : umDe(["Mais uma concluída! Bora para a próxima?", "Cada lição é um passo. Tô contigo!", "Arrasou! Seu cérebro agradece."]);
  setTimeout(() => falarCompanheiro(frase, "festa"), 700);
}
function companheiroNaRota(nome) {
  montarCompanheiro();
  clearTimeout(timerCompanheiro);
  $(".cp-balao", $("#companheiro")).hidden = true;
  $(".cp-bicho", $("#companheiro")).innerHTML = lumi("feliz", "mini");
  const f = FALAS_DA_PAGINA[nome];
  if (!f || !E.idioma || falouNaPagina[nome]) return;
  falouNaPagina[nome] = true;
  setTimeout(() => { if (!document.body.classList.contains("em-licao")) falarCompanheiro(f()); }, 900);
}
