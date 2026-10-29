// ============================================================
//  Repetição espaçada (SRS)
//  Cada palavra acertada vira um "cartão". O cartão volta para
//  revisão logo antes de você esquecer: 1 dia, 3 dias, depois
//  intervalos cada vez maiores. Errou? Ele volta logo.
//  Algoritmo inspirado no SM-2 (SuperMemo/Anki).
// ============================================================
const DIA_MS = 864e5;

function cartoes(idioma = E.idioma) {
  E.srs[idioma] = E.srs[idioma] || {};
  return E.srs[idioma];
}
const chaveCartao = w => normalizar(w.p[0]) + "|" + normalizar(alvo(w.p));

// Chamada sempre que o aluno responde algo sobre uma palavra
function registrarRevisao(w, certo) {
  if (!w || !w.p || !alvo(w.p)) return;
  const cs = cartoes();
  const k = chaveCartao(w);
  const agora = Date.now();
  const c = cs[k];
  if (!c) {
    if (!certo) return;
    cs[k] = { pt: w.p[0], a: alvo(w.p), e: w.p[6] || "📝", t: w.tema ? w.tema.id : "", ease: 2.5, int: 1, reps: 1, lapsos: 0, due: agora + DIA_MS };
    return;
  }
  if (certo) {
    if (c.due > agora) return; // ainda não estava na hora: não mexe no intervalo
    c.reps++;
    c.int = c.reps === 2 ? 3 : Math.max(1, Math.round(c.int * c.ease));
    c.ease = Math.min(3, c.ease + 0.05);
    c.due = agora + c.int * DIA_MS;
  } else {
    c.lapsos++;
    c.reps = 0;
    c.int = 1;
    c.ease = Math.max(1.3, c.ease - 0.2);
    c.due = agora + 10 * 60 * 1000; // volta em 10 minutos
  }
}

function cartoesVencidos(idioma = E.idioma) {
  const agora = Date.now();
  return Object.values(cartoes(idioma)).filter(c => c.due <= agora).sort((a, b) => a.due - b.due);
}
function resumoSRS(idioma = E.idioma) {
  const todos = Object.values(cartoes(idioma));
  return {
    total: todos.length,
    vencidos: todos.filter(c => c.due <= Date.now()).length,
    dominados: todos.filter(c => c.int >= 21).length,
    dificeis: todos.filter(c => c.lapsos >= 2).length,
  };
}

// Um "tema virtual" com todas as palavras dos cartões, para o motor de exercícios
function temaRevisao() {
  const col = IDIOMAS[E.idioma].col;
  const palavras = Object.values(cartoes()).map(c => {
    const p = ["", "", "", "", "", "", ""];
    p[0] = c.pt; p[col] = c.a; p[6] = c.e;
    return p;
  });
  return { id: "revisao", titulo: "Revisão", icone: "🧠", imagens: false, palavras, frases: [], virtual: true, nivel: "A1" };
}

function montarRevisao() {
  const tema = temaRevisao();
  const vencidas = new Set(cartoesVencidos().slice(0, 15).map(c => normalizar(c.pt) + "|" + normalizar(c.a)));
  const W = tema.palavras.map((p, i) => ({ p, i, tema })).filter(w => vencidas.has(chaveCartao(w)));
  const fala = !!Reconhecimento && !semMicrofone;
  return embaralhar(W).map((w, n) => {
    const c = cartoes()[chaveCartao(w)];
    // Cartões novos: reconhecer. Cartões maduros: produzir (escrever/falar) — recordação ativa
    let tipos = c.reps <= 1 ? ["reverso", "ouvir", "traduzir", "escrever"] : ["escrever", "escrever", "reverso", "ouvir", "letras"];
    if (fala && c.reps > 1) tipos.push("falar");
    let tipo = umDe(tipos);
    if (tipo === "letras" && (/\s/.test(c.a) || c.a.length > 10)) tipo = "escrever";
    if (tipo === "falar") return { tipo, f: w.p, w };
    return { tipo, w };
  });
}
