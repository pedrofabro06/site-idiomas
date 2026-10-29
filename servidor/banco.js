// ============================================================
//  Banco de dados do DrPolygo
//  - Produção: Postgres do Railway (variável DATABASE_URL)
//  - Testes no computador: arquivo JSON (variável BANCO_ARQUIVO)
//  Sem nenhum dos dois, as contas ficam desligadas e o site
//  funciona só com o progresso salvo no navegador.
// ============================================================
import fs from "node:fs";

let modo = null;      // "postgres" | "arquivo" | null
let pool = null;      // conexão Postgres
let mem = null;       // dados do modo arquivo
let arquivo = null;

const agora = () => new Date();
export const diaBrasil = () => new Date().toLocaleDateString("sv", { timeZone: "America/Sao_Paulo" });
const minusc = e => String(e || "").trim().toLowerCase();

// Plano efetivo: "pro" só se não venceu (pro_ate vazio = vitalício)
export function planoEfetivo(u) {
  if (!u || u.plano !== "pro") return "gratis";
  if (!u.pro_ate) return "pro";
  return new Date(u.pro_ate) > agora() ? "pro" : "gratis";
}

export async function iniciarBanco() {
  if (process.env.DATABASE_URL) {
    const { default: pg } = await import("pg");
    const url = process.env.DATABASE_URL;
    const semSSL = url.includes(".railway.internal") || url.includes("localhost") || process.env.PGSSL === "0";
    pool = new pg.Pool({ connectionString: url, ssl: semSSL ? false : { rejectUnauthorized: false }, max: 10 });
    await pool.query(`
      create table if not exists usuarios (
        id serial primary key,
        google_sub text unique,
        apple_sub text unique,
        email text,
        nome text,
        foto text,
        plano text not null default 'gratis',
        pro_ate timestamptz,
        perfil jsonb not null default '{}'::jsonb,
        criado timestamptz not null default now(),
        visto timestamptz not null default now()
      );
      create index if not exists usuarios_email on usuarios (lower(email));
      create table if not exists progresso (
        usuario_id int primary key references usuarios(id) on delete cascade,
        estado jsonb not null,
        atualizado timestamptz not null default now()
      );
      create table if not exists uso_ia (
        usuario_id int not null references usuarios(id) on delete cascade,
        dia date not null, tipo text not null, n int not null default 0,
        primary key (usuario_id, dia, tipo)
      );
      create table if not exists questionarios (
        id serial primary key, anon text, usuario_id int references usuarios(id) on delete set null,
        respostas jsonb not null, criado timestamptz not null default now()
      );
      create table if not exists pagamentos (
        id serial primary key, email text, origem text, evento text, acao text,
        dados jsonb, criado timestamptz not null default now()
      );
      create table if not exists liberacoes (
        email text primary key, dias int not null, criado timestamptz not null default now()
      );
    `);
    modo = "postgres";
  } else if (process.env.BANCO_ARQUIVO) {
    arquivo = process.env.BANCO_ARQUIVO;
    try { mem = JSON.parse(fs.readFileSync(arquivo, "utf8")); } catch { mem = null; }
    mem = mem || { seq: 1, usuarios: [], progresso: {}, uso: {}, questionarios: [], pagamentos: [], liberacoes: {} };
    modo = "arquivo";
  }
  return modo;
}
export const bancoAtivo = () => modo;
let gravando = null;
function persistir() {
  if (modo !== "arquivo") return;
  clearTimeout(gravando);
  gravando = setTimeout(() => fs.writeFileSync(arquivo, JSON.stringify(mem)), 200);
}

// ---------- Usuários ----------
export async function usuarioPorId(id) {
  if (modo === "postgres") return (await pool.query("select * from usuarios where id = $1", [id])).rows[0] || null;
  return mem.usuarios.find(u => u.id === id) || null;
}
export async function usuarioPorEmail(email) {
  if (!email) return null;
  if (modo === "postgres") return (await pool.query("select * from usuarios where lower(email) = $1 order by id limit 1", [minusc(email)])).rows[0] || null;
  return mem.usuarios.find(u => minusc(u.email) === minusc(email)) || null;
}
async function usuarioPorProvedor(provedor, sub) {
  const col = provedor === "apple" ? "apple_sub" : "google_sub";
  if (modo === "postgres") return (await pool.query(`select * from usuarios where ${col} = $1`, [sub])).rows[0] || null;
  return mem.usuarios.find(u => u[col] === sub) || null;
}

// Login: acha pela conta do Google/Apple, depois pelo e-mail (liga as duas contas), ou cria
export async function entrarComProvedor({ provedor, sub, email, nome, foto, perfil }) {
  const col = provedor === "apple" ? "apple_sub" : "google_sub";
  let u = await usuarioPorProvedor(provedor, sub);
  if (!u && email) {
    u = await usuarioPorEmail(email);
    if (u) await atualizarUsuario(u.id, { [col]: sub });
  }
  if (!u) {
    if (modo === "postgres") {
      u = (await pool.query(
        `insert into usuarios (${col}, email, nome, foto, perfil) values ($1, $2, $3, $4, $5) returning *`,
        [sub, email || null, nome || null, foto || null, JSON.stringify(perfil || {})])).rows[0];
    } else {
      u = { id: mem.seq++, google_sub: null, apple_sub: null, [col]: sub, email: email || null, nome: nome || null, foto: foto || null,
        plano: "gratis", pro_ate: null, perfil: perfil || {}, criado: agora().toISOString(), visto: agora().toISOString() };
      mem.usuarios.push(u);
      persistir();
    }
    u.novo = true;
  } else {
    await atualizarUsuario(u.id, { nome: u.nome || nome, foto: foto || u.foto, email: u.email || email, visto: agora().toISOString() });
    u = { ...(await usuarioPorId(u.id)), novo: false };
  }
  await aplicarLiberacaoPendente(u);
  return await usuarioPorId(u.id).then(x => ({ ...x, novo: u.novo }));
}

const CAMPOS_OK = new Set(["google_sub", "apple_sub", "email", "nome", "foto", "plano", "pro_ate", "perfil", "visto"]);
export async function atualizarUsuario(id, campos) {
  const pares = Object.entries(campos).filter(([k, v]) => CAMPOS_OK.has(k) && v !== undefined);
  if (!pares.length) return;
  if (modo === "postgres") {
    const sets = pares.map(([k], i) => `${k} = $${i + 2}`).join(", ");
    await pool.query(`update usuarios set ${sets} where id = $1`, [id, ...pares.map(([k, v]) => (k === "perfil" ? JSON.stringify(v) : v))]);
  } else {
    const u = mem.usuarios.find(x => x.id === id);
    if (u) { pares.forEach(([k, v]) => { u[k] = v; }); persistir(); }
  }
}

// ---------- Progresso na nuvem ----------
export async function lerProgresso(id) {
  if (modo === "postgres") return (await pool.query("select estado, atualizado from progresso where usuario_id = $1", [id])).rows[0] || null;
  return mem.progresso[id] || null;
}
export async function salvarProgresso(id, estado) {
  if (modo === "postgres") {
    await pool.query(`insert into progresso (usuario_id, estado, atualizado) values ($1, $2, now())
      on conflict (usuario_id) do update set estado = excluded.estado, atualizado = now()`, [id, JSON.stringify(estado)]);
  } else { mem.progresso[id] = { estado, atualizado: agora().toISOString() }; persistir(); }
}

// ---------- Uso diário da IA ----------
export async function usoHoje(id) {
  const dia = diaBrasil();
  if (modo === "postgres") {
    const r = await pool.query("select tipo, n from uso_ia where usuario_id = $1 and dia = $2", [id, dia]);
    return Object.fromEntries(r.rows.map(x => [x.tipo, x.n]));
  }
  return { ...(mem.uso[`${id}|${dia}`] || {}) };
}
export async function somarUso(id, tipo) {
  const dia = diaBrasil();
  if (modo === "postgres") {
    await pool.query(`insert into uso_ia (usuario_id, dia, tipo, n) values ($1, $2, $3, 1)
      on conflict (usuario_id, dia, tipo) do update set n = uso_ia.n + 1`, [id, dia, tipo]);
  } else {
    const k = `${id}|${dia}`;
    mem.uso[k] = mem.uso[k] || {};
    mem.uso[k][tipo] = (mem.uso[k][tipo] || 0) + 1;
    persistir();
  }
}

// ---------- Questionário de boas-vindas ----------
export async function salvarQuestionario(anon, respostas, usuarioId = null) {
  if (modo === "postgres") {
    await pool.query("insert into questionarios (anon, usuario_id, respostas) values ($1, $2, $3)", [anon, usuarioId, JSON.stringify(respostas)]);
  } else { mem.questionarios.push({ id: mem.questionarios.length + 1, anon, usuario_id: usuarioId, respostas, criado: agora().toISOString() }); persistir(); }
}
export async function vincularQuestionarios(anon, usuarioId) {
  if (!anon) return;
  if (modo === "postgres") await pool.query("update questionarios set usuario_id = $2 where anon = $1 and usuario_id is null", [anon, usuarioId]);
  else { mem.questionarios.forEach(q => { if (q.anon === anon && !q.usuario_id) q.usuario_id = usuarioId; }); persistir(); }
}

// ---------- Plano pago ----------
// dias = 0 → vitalício. Soma aos dias que a pessoa já tinha.
export async function liberarPlano(email, dias) {
  const u = await usuarioPorEmail(email);
  if (!u) {
    if (modo === "postgres") await pool.query(`insert into liberacoes (email, dias) values ($1, $2) on conflict (email) do update set dias = excluded.dias, criado = now()`, [minusc(email), dias]);
    else { mem.liberacoes[minusc(email)] = dias; persistir(); }
    return { pendente: true };
  }
  await aplicarDias(u, dias);
  return { pendente: false, usuario: u.id };
}
async function aplicarDias(u, dias) {
  let ate = null;
  if (dias > 0) {
    const base = planoEfetivo(u) === "pro" && u.pro_ate ? new Date(u.pro_ate) : agora();
    ate = new Date(base.getTime() + dias * 864e5).toISOString();
  } else if (planoEfetivo(u) === "pro" && u.pro_ate === null) {
    ate = null;
  }
  await atualizarUsuario(u.id, { plano: "pro", pro_ate: ate });
}
async function aplicarLiberacaoPendente(u) {
  if (!u.email) return;
  const e = minusc(u.email);
  let dias;
  if (modo === "postgres") {
    const r = await pool.query("delete from liberacoes where email = $1 returning dias", [e]);
    dias = r.rows[0]?.dias;
  } else if (e in mem.liberacoes) { dias = mem.liberacoes[e]; delete mem.liberacoes[e]; persistir(); }
  if (dias !== undefined) await aplicarDias(u, dias);
}
export async function removerPlano(email) {
  const u = await usuarioPorEmail(email);
  if (modo === "postgres") await pool.query("delete from liberacoes where email = $1", [minusc(email)]);
  else { delete mem.liberacoes[minusc(email)]; persistir(); }
  if (u) await atualizarUsuario(u.id, { plano: "gratis", pro_ate: null });
  return !!u;
}
export async function registrarPagamento({ email, origem, evento, acao, dados }) {
  if (modo === "postgres") await pool.query("insert into pagamentos (email, origem, evento, acao, dados) values ($1, $2, $3, $4, $5)", [email, origem, evento, acao, JSON.stringify(dados)]);
  else { mem.pagamentos.push({ id: mem.pagamentos.length + 1, email, origem, evento, acao, dados, criado: agora().toISOString() }); persistir(); }
}

// ---------- Painel do administrador ----------
export async function listarUsuarios(busca = "", limite = 60) {
  let lista;
  if (modo === "postgres") {
    lista = (await pool.query(`select id, email, nome, foto, plano, pro_ate, perfil, criado, visto from usuarios
      where $1 = '' or lower(email) like $2 or lower(coalesce(nome, '')) like $2 order by id desc limit $3`,
      [busca, `%${minusc(busca)}%`, limite])).rows;
  } else {
    lista = [...mem.usuarios].reverse().filter(u => !busca || minusc(u.email).includes(minusc(busca)) || minusc(u.nome).includes(minusc(busca))).slice(0, limite);
  }
  return lista.map(u => ({ id: u.id, email: u.email, nome: u.nome, foto: u.foto, plano: planoEfetivo(u), pro_ate: u.pro_ate, perfil: u.perfil, criado: u.criado, visto: u.visto }));
}
export async function listarPagamentos(limite = 40) {
  if (modo === "postgres") return (await pool.query("select id, email, origem, evento, acao, criado from pagamentos order by id desc limit $1", [limite])).rows;
  return [...mem.pagamentos].reverse().slice(0, limite).map(({ dados, ...p }) => p);
}
export async function resumo() {
  let usuarios, questionarios;
  if (modo === "postgres") {
    usuarios = (await pool.query("select plano, pro_ate, criado from usuarios")).rows;
    questionarios = (await pool.query("select respostas, usuario_id, criado from questionarios order by id desc limit 5000")).rows;
  } else {
    usuarios = mem.usuarios;
    questionarios = mem.questionarios;
  }
  const contar = campo => {
    const c = {};
    questionarios.forEach(q => { const v = (q.respostas || {})[campo] || "não informado"; c[v] = (c[v] || 0) + 1; });
    return Object.entries(c).sort((a, b) => b[1] - a[1]);
  };
  // Datas no horário de Brasília
  const diaBR = d => new Date(d).toLocaleDateString("sv", { timeZone: "America/Sao_Paulo" });
  const ultimos = {};
  for (let k = 13; k >= 0; k--) ultimos[diaBR(Date.now() - k * 864e5)] = 0;
  usuarios.forEach(u => { const d = diaBR(u.criado); if (d in ultimos) ultimos[d]++; });
  return {
    usuarios: usuarios.length,
    pro: usuarios.filter(u => planoEfetivo(u) === "pro").length,
    questionarios: questionarios.length,
    viraramConta: questionarios.filter(q => q.usuario_id).length,
    porOrigem: contar("origem"), porObjetivo: contar("objetivo"), porTempo: contar("tempo"),
    porIdioma: contar("idioma"), porNivel: contar("nivel"), porCampanha: contar("utm_campaign"),
    cadastrosPorDia: Object.entries(ultimos),
  };
}
