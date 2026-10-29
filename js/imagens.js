// ============================================================
//  Ilustrações no lugar dos emojis
//  Todo emoji que aparece na tela vira uma imagem 3D (Fluent Emoji,
//  da Microsoft, licença MIT), guardada no próprio site em img/em/.
//  A troca acontece sozinha: um observador olha tudo o que é desenhado.
// ============================================================
const IMAGENS_DISPONIVEIS = new Set("1f0cf 1f170 1f195 1f198 1f305 1f309 1f30a 1f30b 1f30d 1f30e 1f310 1f311 1f317 1f319 1f31f 1f321 1f324 1f327 1f32b 1f331 1f332 1f333 1f334 1f336 1f337 1f338 1f33c 1f342 1f34e 1f357 1f35a 1f35b 1f35d 1f35e 1f368 1f370 1f373 1f374 1f377 1f37d 1f380 1f381 1f382 1f389 1f393 1f399 1f39f 1f3a4 1f3a8 1f3a9 1f3ab 1f3ac 1f3ad 1f3ae 1f3af 1f3b0 1f3b2 1f3c1 1f3c3 1f3c5 1f3c6 1f3cb 1f3ce 1f3d6 1f3d9 1f3db 1f3de 1f3e0 1f3e1 1f3e2 1f3e5 1f3e6 1f3e8 1f3ea 1f3eb 1f3ec 1f3ed 1f3f3 1f3f7 1f400 1f406 1f407 1f412 1f418 1f419 1f41f 1f422 1f426 1f428 1f42d 1f42e 1f430 1f431 1f432 1f434 1f436 1f437 1f438 1f43c 1f440 1f441 1f442 1f443 1f444 1f446 1f448 1f449 1f44b 1f44c 1f44d 1f44e 1f44f 1f451 1f453 1f454 1f455 1f456 1f457 1f45c 1f45e 1f45f 1f463 1f464 1f465 1f466 1f467 1f468 1f468-200d-1f469-200d-1f467 1f469 1f46a 1f46b 1f470 1f474 1f475 1f476 1f477 1f47d 1f487 1f489 1f48a 1f48d 1f48e 1f494 1f497 1f49a 1f4a1 1f4a7 1f4a8 1f4aa 1f4ac 1f4ad 1f4af 1f4b0 1f4b3 1f4b5 1f4b8 1f4b9 1f4bb 1f4bc 1f4c1 1f4c4 1f4c5 1f4c6 1f4c8 1f4c9 1f4ca 1f4cb 1f4cc 1f4cd 1f4ce 1f4cf 1f4d0 1f4d1 1f4d3 1f4d6 1f4d8 1f4da 1f4dc 1f4dd 1f4e2 1f4e3 1f4e6 1f4e7 1f4ec 1f4f0 1f4f1 1f4f2 1f4fa 1f500 1f501 1f502 1f504 1f50a 1f50b 1f50c 1f50d 1f510 1f511 1f512 1f517 1f51f 1f522 1f524 1f525 1f526 1f52c 1f52e 1f570 1f575 1f579 1f58d 1f590 1f5a4 1f5a5 1f5d1 1f5d3 1f5dd 1f5e3 1f5e8 1f5f3 1f5fa 1f607 1f60a 1f60b 1f60c 1f60d 1f60e 1f614 1f618 1f61f 1f620 1f622 1f623 1f624 1f628 1f629 1f62c 1f62e 1f632 1f634 1f637 1f642 1f645 1f648 1f64b 1f64f 1f680 1f686 1f687 1f689 1f68c 1f69a 1f6a6 1f6a7 1f6aa 1f6ab 1f6ae 1f6b6 1f6bb 1f6bf 1f6c1 1f6c2 1f6cb 1f6cd 1f6cf 1f6d2 1f6e0 1f6e1 1f6e3 1f6eb 1f7e5 1f7e6 1f7e7 1f7e8 1f7e9 1f7ea 1f7eb 1f7f0 1f90f 1f912 1f914 1f915 1f916 1f919 1f91d 1f91e 1f927 1f928 1f929 1f930 1f932 1f935 1f937 1f93f 1f947 1f950 1f957 1f95a 1f95b 1f964 1f966 1f969 1f971 1f976 1f97a 1f981 1f984 1f98a 1f996 1f998 1f99a 1f99c 1f9b5 1f9b6 1f9b7 1f9b8 1f9c0 1f9c3 1f9c8 1f9ca 1f9d0 1f9d1 1f9d1-200d-1f393 1f9d1-200d-1f3eb 1f9d1-200d-1f4bc 1f9d1-200d-1f52c 1f9d1-200d-1f91d-200d-1f9d1 1f9d1-200d-2695 1f9d7 1f9e0 1f9e3 1f9e5 1f9e6 1f9e9 1f9ea 1f9ed 1f9ee 1f9f1 1f9f3 1f9f8 1f9fd 1f9fe 1fa7a 1fa82 1fa90 1fa91 1fa99 1fa9c 1fa9e 1fa9f 2194 21a9 231b 23ea 23ed 23ee 23f0 23f1 23f3 23f8 25b6 2600 2601 2602 2615 261d 2620 267b 267e 2696 26a0 26a1 26bd 26c4 26c8 26f0 26fd 2705 2708 270b 270d 270f 2714 2728 2744 274c 2753 2754 2764 2795 27a1 2b06 2b07 2b1b 2b1c 2b50 30-20e3 31-20e3 32-20e3 33-20e3 34-20e3 35-20e3 36-20e3 37-20e3 38-20e3 39-20e3".split(" "));
// Emojis sem ilustração própria usam uma parecida
const IMAGEM_PARECIDA = { "23-20e3": "1f522", "1f60a": "1f60a" };
const RE_EMOJI = /(?:[\u{1F1E6}-\u{1F1FF}]{2})|(?:[0-9#*]️?⃣)|(?:\p{Extended_Pictographic}(?:️|\p{Emoji_Modifier})*(?:‍\p{Extended_Pictographic}(?:️|\p{Emoji_Modifier})*)*)/gu;
const temEmoji = s => { RE_EMOJI.lastIndex = 0; return RE_EMOJI.test(s); };
const chaveEmoji = e => [...e].map(c => c.codePointAt(0).toString(16)).filter(c => c !== "fe0f" && !/^1f3f[b-f]$/.test(c)).join("-");
function imagemDoEmoji(e) {
  let k = chaveEmoji(e);
  if (!IMAGENS_DISPONIVEIS.has(k)) k = IMAGEM_PARECIDA[k] || k.split("-")[0];
  return IMAGENS_DISPONIVEIS.has(k) ? `img/em/${k}.webp` : null;
}
// Para usar direto no HTML: imgEmoji("🔥", "grande")
function imgEmoji(e, classe = "") {
  const src = imagemDoEmoji(e);
  return src ? `<img class="em ${classe}" src="${src}" alt="" draggable="false">` : "";
}
const semEmoji = s => s.replace(RE_EMOJI, "").replace(/\s{2,}/g, " ").trim();

const PULAR = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "SVG", "svg", "TITLE"]);
function trocarNoTexto(no) {
  const t = no.nodeValue;
  if (!t || !temEmoji(t)) return;
  const pai = no.parentNode;
  if (!pai || PULAR.has(pai.nodeName)) return;
  // Dentro de <option> não cabe imagem: o emoji só some
  if (pai.nodeName === "OPTION") { no.nodeValue = semEmoji(t); return; }
  const frag = document.createDocumentFragment();
  let ultimo = 0;
  RE_EMOJI.lastIndex = 0;
  for (const m of t.matchAll(RE_EMOJI)) {
    if (m.index > ultimo) frag.appendChild(document.createTextNode(t.slice(ultimo, m.index)));
    const src = imagemDoEmoji(m[0]);
    if (src) {
      const img = document.createElement("img");
      img.className = "em"; img.src = src; img.alt = ""; img.draggable = false;
      frag.appendChild(img);
    }
    ultimo = m.index + m[0].length;
  }
  if (ultimo < t.length) frag.appendChild(document.createTextNode(t.slice(ultimo)));
  pai.replaceChild(frag, no);
}
function trocarEmojis(raiz) {
  if (!raiz) return;
  if (raiz.nodeType === 3) return trocarNoTexto(raiz);
  if (raiz.nodeType !== 1 || PULAR.has(raiz.nodeName)) return;
  for (const a of ["title", "placeholder", "aria-label"]) {
    const v = raiz.getAttribute && raiz.getAttribute(a);
    if (v && temEmoji(v)) raiz.setAttribute(a, semEmoji(v));
  }
  const andar = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  const textos = [];
  for (let n = andar.nextNode(); n; n = andar.nextNode()) {
    if (n.nodeType === 3) { if (temEmoji(n.nodeValue)) textos.push(n); }
    else for (const a of ["title", "placeholder", "aria-label"]) { const v = n.getAttribute(a); if (v && temEmoji(v)) n.setAttribute(a, semEmoji(v)); }
  }
  textos.forEach(trocarNoTexto);
}
const observadorEmojis = new MutationObserver(lista => {
  for (const m of lista) {
    if (m.type === "characterData") trocarNoTexto(m.target);
    else m.addedNodes.forEach(trocarEmojis);
  }
});
document.addEventListener("DOMContentLoaded", () => {
  trocarEmojis(document.body);
  observadorEmojis.observe(document.body, { childList: true, subtree: true, characterData: true });
});
// O título da aba também fica sem emoji
document.title = semEmoji(document.title);
