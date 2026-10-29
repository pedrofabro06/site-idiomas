// ============================================================
//  Estado do jogador: XP, nível, vidas, moedas, ofensiva,
//  progresso na trilha, conquistas e desafios diários
// ============================================================
const CHAVE = "poliglota-v2";
const VIDAS_MAX = 5;
const REGEN_MS = 20 * 60 * 1000; // 1 vida a cada 20 minutos

function estadoPadrao() {
  return {
    nome: "Você", avatar: "🦊", avatares: ["🦊"],
    xp: 0, moedas: 50, vidas: VIDAS_MAX, vidasEm: Date.now(),
    streak: 0, ultimoDia: null, protetor: 0, meta: 30, som: true,
    idioma: null,
    mascote: "kiko",   // mascote em uso
    mascotes: ["kiko", "lumi"], // mascotes que o jogador já tem
    vozes: {},         // vozes[idioma] = nome da voz escolhida
    velocidade: 1,     // velocidade da fala (0.6 a 1.3)
    srs: {},           // srs[idioma][chave] = cartão de repetição espaçada
    nivelamento: {},   // nivelamento[idioma] = { nivel, data }
    pronuncia: {},     // pronuncia[idioma][texto] = melhor nota
    licoesIA: {},      // licoesIA[idioma] = lições geradas pela IA
    chat: {},          // chat[idioma] = { modo, cenario, msgs }
    prog: {},        // prog[idioma][tema] = { licao: 0..4, bau: bool, estrelas: [] }
    aprendidas: {},  // aprendidas[idioma][tema] = [índices]
    conquistas: {},
    stats: { licoes: 0, perfeitas: 0, acertos: 0, erros: 0, comboMax: 0, arcade: 0, fala: 0, escrita: 0 },
    recordes: {},
    historico: {},   // data -> XP
    dia: { data: null, xp: 0, licoes: 0, combo: 0, arcade: 0, escrita: 0, perfeitas: 0, feitos: [] },
  };
}

function carregarEstado() {
  const base = estadoPadrao();
  let salvo = null;
  try { salvo = JSON.parse(localStorage.getItem(CHAVE)); } catch {}
  if (!salvo) {
    // Aproveita o XP e a ofensiva da versão anterior do site
    try {
      const antigo = JSON.parse(localStorage.getItem("poliglota-progresso"));
      if (antigo) { base.xp = antigo.xp || 0; base.streak = antigo.streak || 0; base.ultimoDia = antigo.ultimoDia || null; }
    } catch {}
    return base;
  }
  const e = Object.assign(base, salvo);
  e.stats = Object.assign(estadoPadrao().stats, salvo.stats);
  e.dia = Object.assign(estadoPadrao().dia, salvo.dia);
  if (e.idioma && !IDIOMAS[e.idioma]) e.idioma = null;
  return e;
}

let E = carregarEstado();

function salvar() {
  try { localStorage.setItem(CHAVE, JSON.stringify(E)); } catch {}
  if (typeof atualizarTopo === "function") atualizarTopo();
  if (typeof agendarSync === "function") agendarSync(); // com conta: envia para a nuvem
}

// ---------- Datas ----------
const dataLocal = (d = new Date()) => d.toLocaleDateString("sv"); // AAAA-MM-DD no fuso local
const hoje = () => dataLocal();
function ontem() { const d = new Date(); d.setDate(d.getDate() - 1); return dataLocal(d); }

// Vira o dia: zera contadores diários e confere se a ofensiva foi perdida
function garantirDia() {
  const h = hoje();
  if (E.dia.data !== h) E.dia = Object.assign(estadoPadrao().dia, { data: h });
  if (E.streak > 0 && E.ultimoDia && E.ultimoDia !== h && E.ultimoDia !== ontem()) {
    if (E.protetor > 0) {
      E.protetor--;
      E.ultimoDia = ontem();
      setTimeout(() => toast("🧊", "Protetor de ofensiva usado!", `Sua ofensiva de ${E.streak} dias foi salva.`), 600);
    } else {
      E.streak = 0;
    }
  }
  atualizarVidas();
}

// ---------- Vidas ----------
function atualizarVidas() {
  if (E.vidas >= VIDAS_MAX) { E.vidas = VIDAS_MAX; E.vidasEm = Date.now(); return; }
  const ganho = Math.floor((Date.now() - E.vidasEm) / REGEN_MS);
  if (ganho > 0) {
    E.vidas = Math.min(VIDAS_MAX, E.vidas + ganho);
    E.vidasEm += ganho * REGEN_MS;
    if (E.vidas >= VIDAS_MAX) E.vidasEm = Date.now();
  }
}
const proximaVidaEm = () => Math.max(0, REGEN_MS - (Date.now() - E.vidasEm));
function perderVida() {
  atualizarVidas();
  if (E.vidas >= VIDAS_MAX) E.vidasEm = Date.now();
  E.vidas = Math.max(0, E.vidas - 1);
  salvar();
}
function ganharVidas(n) {
  E.vidas = Math.min(VIDAS_MAX, E.vidas + n);
  if (E.vidas >= VIDAS_MAX) E.vidasEm = Date.now();
  salvar();
}

// ---------- XP, nível e moedas ----------
const nivelDe = xp => Math.floor(Math.sqrt(xp / 40)) + 1;
const xpDoNivel = n => 40 * (n - 1) * (n - 1);

function ganharXP(n) {
  if (n <= 0) return;
  garantirDia();
  const nivelAntes = nivelDe(E.xp);
  const metaAntes = E.dia.xp >= E.meta;
  E.xp += n;
  E.dia.xp += n;
  E.historico[hoje()] = (E.historico[hoje()] || 0) + n;
  if (E.ultimoDia !== hoje()) {
    E.streak = E.ultimoDia === ontem() ? E.streak + 1 : 1;
    E.ultimoDia = hoje();
    toast("🔥", `Ofensiva de ${E.streak} dia${E.streak > 1 ? "s" : ""}!`, "Volte amanhã para manter o fogo aceso.");
  }
  if (!metaAntes && E.dia.xp >= E.meta) {
    E.moedas += 10;
    toast("🎯", "Meta diária batida!", "+10 🪙 de bônus");
  }
  const nivelDepois = nivelDe(E.xp);
  if (nivelDepois > nivelAntes) {
    toast("⬆️", `Você chegou ao nível ${nivelDepois}!`, "Continue assim.");
    som("nivel");
    // Mascotes novos liberam com o nível
    Object.entries(MASCOTES).forEach(([k, m]) => {
      if (m.nivel > nivelAntes && m.nivel <= nivelDepois && !E.mascotes.includes(k)) {
        setTimeout(() => toast("🎉", `Mascote liberado: ${m.nome}!`, `Compre na loja por ${m.preco} 🪙`), 1200);
      }
    });
  }
  // Mantém só os últimos 60 dias de histórico
  const chaves = Object.keys(E.historico).sort();
  while (chaves.length > 60) delete E.historico[chaves.shift()];
  checarTudo();
  salvar();
}
function ganharMoedas(n) { E.moedas += n; salvar(); pular($("#pillMoedas")); }
function gastarMoedas(n) {
  if (E.moedas < n) return false;
  E.moedas -= n; salvar(); return true;
}

// Contadores para desafios diários e estatísticas
function contar(campo, n = 1) {
  garantirDia();
  if (campo === "combo") {
    E.dia.combo = Math.max(E.dia.combo, n);
    E.stats.comboMax = Math.max(E.stats.comboMax, n);
    return;
  }
  E.dia[campo] = (E.dia[campo] || 0) + n;
  if (campo in E.stats) E.stats[campo] += n;
}

// ---------- Progresso na trilha ----------
function progTema(temaId, idioma = E.idioma) {
  E.prog[idioma] = E.prog[idioma] || {};
  E.prog[idioma][temaId] = E.prog[idioma][temaId] || { licao: 0, bau: false, estrelas: [] };
  return E.prog[idioma][temaId];
}
// ---------- Trilha baseada no nível do teste ----------
// A trilha começa no nível seguinte ao que o aluno já domina.
// As unidades abaixo dele ficam na aba "Fundamentos".
function inicioTrilha(idioma = E.idioma) {
  const teste = (E.nivelamento[idioma] || {}).nivel;
  const idx = teste ? ORDEM_NIVEIS.indexOf(teste) + 1 : 0;
  const ultimoComUnidades = Math.max(...TEMAS.map(t => ORDEM_NIVEIS.indexOf(t.nivel)));
  return Math.min(idx, ultimoComUnidades);
}
const naTrilha = (t, idioma = E.idioma) => ORDEM_NIVEIS.indexOf(t.nivel) >= inicioTrilha(idioma);
const temasDaTrilha = (idioma = E.idioma) => TEMAS.filter(t => naTrilha(t, idioma));
const temasFundamentos = (idioma = E.idioma) => TEMAS.filter(t => !naTrilha(t, idioma));
function temaDesbloqueado(i, idioma = E.idioma) {
  const t = TEMAS[i];
  if (!naTrilha(t, idioma)) return true; // fundamentos ficam sempre abertos
  const primeiro = TEMAS.findIndex(x => naTrilha(x, idioma));
  return i === primeiro || progTema(TEMAS[i - 1].id, idioma).licao >= 4;
}

// Nível atual do aluno: o do teste ou o mais alto que ele já completou na trilha
function nivelAtual(idioma = E.idioma) {
  let idx = -1;
  const teste = (E.nivelamento[idioma] || {}).nivel;
  if (teste) idx = ORDEM_NIVEIS.indexOf(teste);
  ORDEM_NIVEIS.forEach((n, i) => {
    const temas = TEMAS.filter(t => t.nivel === n);
    if (temas.length && temas.every(t => progTema(t.id, idioma).licao >= 4)) idx = Math.max(idx, i);
  });
  // O nível de estudo é o próximo ainda não dominado
  return ORDEM_NIVEIS[Math.min(ORDEM_NIVEIS.length - 1, idx + 1)];
}
function marcarAprendida(temaId, idx) {
  const a = (E.aprendidas[E.idioma] = E.aprendidas[E.idioma] || {});
  const lista = new Set(a[temaId] || []);
  lista.add(idx);
  a[temaId] = [...lista];
}
function totalAprendidas(idioma = E.idioma) {
  return Object.values(E.aprendidas[idioma] || {}).reduce((s, l) => s + l.length, 0);
}
function percentualIdioma(idioma) {
  const temas = temasDaTrilha(idioma);
  let feito = 0;
  temas.forEach(t => {
    const p = (E.prog[idioma] || {})[t.id];
    if (p) feito += Math.min(4, p.licao) + (p.bau ? 1 : 0);
  });
  return Math.round((feito / (temas.length * 5)) * 100);
}
function proximaLicao() {
  for (let i = 0; i < TEMAS.length; i++) {
    if (!naTrilha(TEMAS[i])) continue;
    const p = progTema(TEMAS[i].id);
    if (p.licao < 4) return { tema: TEMAS[i], nivel: p.licao, i };
    if (!p.bau) return { tema: TEMAS[i], nivel: 4, i };
  }
  return null;
}

// ---------- Conquistas ----------
const CONQUISTAS = [
  { id: "primeira", icone: "👣", nome: "Primeiros passos", desc: "Conclua sua primeira lição", t: e => e.stats.licoes >= 1 },
  { id: "dez", icone: "📚", nome: "Estudioso", desc: "Conclua 10 lições", t: e => e.stats.licoes >= 10 },
  { id: "perfeita", icone: "💯", nome: "Sem erros", desc: "Termine uma lição sem errar", t: e => e.stats.perfeitas >= 1 },
  { id: "combo10", icone: "⚡", nome: "Imparável", desc: "Acerte 10 seguidas", t: e => e.stats.comboMax >= 10 },
  { id: "streak3", icone: "🔥", nome: "Pegando fogo", desc: "Ofensiva de 3 dias", t: e => e.streak >= 3 },
  { id: "streak7", icone: "🌋", nome: "Vulcão", desc: "Ofensiva de 7 dias", t: e => e.streak >= 7 },
  { id: "xp500", icone: "⭐", nome: "Estrela", desc: "Junte 500 XP", t: e => e.xp >= 500 },
  { id: "xp2000", icone: "🌟", nome: "Superestrela", desc: "Junte 2000 XP", t: e => e.xp >= 2000 },
  { id: "coroa", icone: "👑", nome: "Coroado", desc: "Vença o desafio de uma unidade", t: e => Object.values(e.prog).some(l => Object.values(l).some(p => p.licao >= 4)) },
  { id: "poliglota", icone: "🌍", nome: "Poliglota", desc: "Conclua lições em 3 idiomas", t: e => Object.values(e.prog).filter(l => Object.values(l).some(p => p.licao > 0)).length >= 3 },
  { id: "arcade", icone: "🕹️", nome: "Rei do fliperama", desc: "Jogue 5 partidas no fliperama", t: e => e.stats.arcade >= 5 },
  { id: "falante", icone: "🎤", nome: "Boa pronúncia", desc: "Acerte 10 exercícios de fala", t: e => e.stats.fala >= 10 },
  { id: "escritor", icone: "✍️", nome: "Escritor", desc: "Acerte 25 exercícios de escrita", t: e => e.stats.escrita >= 25 },
  { id: "cerebro", icone: "🧠", nome: "Cérebro afiado", desc: "Aprenda 50 palavras em um idioma", t: e => Object.keys(e.aprendidas).some(k => totalAprendidas(k) >= 50) },
  { id: "cofre", icone: "💰", nome: "Cofrinho", desc: "Junte 300 moedas", t: e => e.moedas >= 300 },
  { id: "estilo", icone: "🎭", nome: "Estiloso", desc: "Tenha 3 avatares", t: e => e.avatares.length >= 3 },
  { id: "zoologico", icone: "🦜", nome: "Colecionador", desc: "Tenha 5 mascotes", t: e => (e.mascotes || []).length >= 5 },
  { id: "todos", icone: "🏆", nome: "Zoológico completo", desc: "Tenha todos os mascotes", t: e => (e.mascotes || []).length >= Object.keys(MASCOTES).length },
];

// ---------- Desafios do dia (3 por dia, sorteados pela data) ----------
const DESAFIOS = [
  { id: "xp30", texto: "Ganhe 30 XP", campo: "xp", meta: 30, moedas: 15 },
  { id: "xp60", texto: "Ganhe 60 XP", campo: "xp", meta: 60, moedas: 25 },
  { id: "lic2", texto: "Conclua 2 lições", campo: "licoes", meta: 2, moedas: 15 },
  { id: "lic3", texto: "Conclua 3 lições", campo: "licoes", meta: 3, moedas: 25 },
  { id: "combo5", texto: "Acerte 5 seguidas", campo: "combo", meta: 5, moedas: 10 },
  { id: "combo10", texto: "Acerte 10 seguidas", campo: "combo", meta: 10, moedas: 20 },
  { id: "arc1", texto: "Jogue 1 partida no fliperama", campo: "arcade", meta: 1, moedas: 10 },
  { id: "arc3", texto: "Jogue 3 partidas no fliperama", campo: "arcade", meta: 3, moedas: 20 },
  { id: "esc5", texto: "Acerte 5 exercícios de escrita", campo: "escrita", meta: 5, moedas: 15 },
  { id: "perf1", texto: "Faça uma lição sem erros", campo: "perfeitas", meta: 1, moedas: 20 },
];
function desafiosDoDia() {
  const r = aleatorioComSemente(hashTexto(hoje()));
  const pool = [...DESAFIOS], out = [], campos = new Set();
  while (out.length < 3 && pool.length) {
    const d = pool.splice(Math.floor(r() * pool.length), 1)[0];
    if (campos.has(d.campo)) continue;
    campos.add(d.campo);
    out.push(d);
  }
  return out;
}

function checarTudo() {
  CONQUISTAS.forEach(c => {
    if (!E.conquistas[c.id] && c.t(E)) {
      E.conquistas[c.id] = hoje();
      E.moedas += 20;
      setTimeout(() => { toast(c.icone, "Conquista: " + c.nome, c.desc + " · +20 🪙"); som("moeda"); }, 400);
    }
  });
  desafiosDoDia().forEach(d => {
    if (!E.dia.feitos.includes(d.id) && (E.dia[d.campo] || 0) >= d.meta) {
      E.dia.feitos.push(d.id);
      E.moedas += d.moedas;
      setTimeout(() => toast("✅", "Desafio do dia concluído!", `${d.texto} · +${d.moedas} 🪙`), 800);
    }
  });
}
