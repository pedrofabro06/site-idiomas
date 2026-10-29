// ============================================================
//  Login com Google e Apple + sessão em cookie assinado
// ============================================================
import crypto from "node:crypto";
import { createRemoteJWKSet, jwtVerify } from "jose";

export const GOOGLE_CLIENT_ID = (process.env.GOOGLE_CLIENT_ID || "").trim();
export const APPLE_CLIENT_ID = (process.env.APPLE_CLIENT_ID || "").trim();
export const APPLE_REDIRECT_URI = (process.env.APPLE_REDIRECT_URI || "").trim();
export const DEV_LOGIN = process.env.DEV_LOGIN === "1";

let SEGREDO = process.env.SESSION_SECRET || "";
if (!SEGREDO) {
  SEGREDO = crypto.randomBytes(32).toString("hex");
  console.warn("⚠️  SESSION_SECRET não definido: usando um segredo temporário. Todos serão deslogados a cada deploy. Defina SESSION_SECRET no Railway.");
}

const googleChaves = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
const appleChaves = createRemoteJWKSet(new URL("https://appleid.apple.com/auth/keys"));

// O navegador recebe um "ID token" do Google; aqui conferimos a assinatura e para qual site ele foi emitido
export async function verificarGoogle(credencial) {
  if (!GOOGLE_CLIENT_ID) throw new Error("login com Google não configurado");
  const { payload } = await jwtVerify(credencial, googleChaves, {
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    audience: GOOGLE_CLIENT_ID,
  });
  if (payload.email && payload.email_verified === false) throw new Error("e-mail do Google não verificado");
  return { sub: String(payload.sub), email: payload.email || null, nome: payload.name || null, foto: payload.picture || null };
}
export async function verificarApple(idToken) {
  if (!APPLE_CLIENT_ID) throw new Error("login com Apple não configurado");
  const { payload } = await jwtVerify(idToken, appleChaves, { issuer: "https://appleid.apple.com", audience: APPLE_CLIENT_ID });
  return { sub: String(payload.sub), email: payload.email || null };
}

// ---------- Sessão ----------
const NOME_COOKIE = "poliglota_sessao";
const DURACAO_S = 60 * 24 * 3600; // 60 dias
const b64 = s => Buffer.from(s).toString("base64url");
const assinar = dados => crypto.createHmac("sha256", SEGREDO).update(dados).digest("base64url");

export function criarSessao(res, req, usuarioId) {
  const dados = b64(JSON.stringify({ u: usuarioId, exp: Math.floor(Date.now() / 1000) + DURACAO_S }));
  const token = dados + "." + assinar(dados);
  const seguro = (req.headers["x-forwarded-proto"] || "").includes("https") ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${NOME_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${DURACAO_S}${seguro}`);
}
export function encerrarSessao(res) {
  res.setHeader("Set-Cookie", `${NOME_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}
export function lerSessao(req) {
  const cookie = (req.headers.cookie || "").split(";").map(c => c.trim()).find(c => c.startsWith(NOME_COOKIE + "="));
  if (!cookie) return null;
  const [dados, assinatura] = cookie.slice(NOME_COOKIE.length + 1).split(".");
  if (!dados || !assinatura) return null;
  const esperado = assinar(dados);
  if (esperado.length !== assinatura.length || !crypto.timingSafeEqual(Buffer.from(esperado), Buffer.from(assinatura))) return null;
  try {
    const s = JSON.parse(Buffer.from(dados, "base64url").toString("utf8"));
    if (!s.u || s.exp < Date.now() / 1000) return null;
    return s.u;
  } catch { return null; }
}
