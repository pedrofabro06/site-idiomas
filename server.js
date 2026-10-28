// Servidor estático mínimo para o Railway (sem dependências).
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const RAIZ = __dirname;
const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};
const PRIVADOS = new Set(["server.js", "package.json"]);

http.createServer((req, res) => {
  let caminho;
  try { caminho = decodeURIComponent(new URL(req.url, "http://x").pathname); }
  catch { res.writeHead(400); return res.end("Requisição inválida"); }
  if (caminho === "/") caminho = "/index.html";

  const arquivo = path.join(RAIZ, path.normalize(caminho));
  const relativo = path.relative(RAIZ, arquivo);
  if (relativo.startsWith("..") || relativo.startsWith(".") || PRIVADOS.has(relativo)) {
    res.writeHead(404); return res.end("Não encontrado");
  }

  fs.readFile(arquivo, (erro, dados) => {
    if (erro) { res.writeHead(404); return res.end("Não encontrado"); }
    res.writeHead(200, { "Content-Type": TIPOS[path.extname(arquivo)] || "application/octet-stream" });
    res.end(dados);
  });
}).listen(PORT, () => console.log(`Poliglota rodando na porta ${PORT}`));
