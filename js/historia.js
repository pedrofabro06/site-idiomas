// ============================================================
//  A história do Doutor Polygo
// ============================================================
const CAPITULOS = [
  {
    titulo: "O maior cientista de idiomas do universo",
    humor: "feliz",
    texto: "O Doutor Polygo falava 47 línguas, 3 dialetos de golfinho e um pouco de computador. Ele mora no Poliedro, um laboratório gigante em forma de polígono que flutua acima das nuvens. Cada face do Poliedro é uma porta para um país diferente: abre uma e sai em Londres, abre outra e cai numa padaria em Paris.",
  },
  {
    titulo: "A Máquina Babelatrônica",
    humor: "uau",
    texto: "Um dia ele teve a ideia mais genial e mais perigosa da carreira: uma máquina que ensinaria qualquer idioma em um segundo. Trabalhou 7 anos, 7 meses e 7 dias. Na hora de ligar, o Kiko pousou no botão vermelho errado.",
  },
  {
    titulo: "KABUM!",
    humor: "triste",
    texto: "A máquina explodiu e espalhou milhões de palavras pelo mundo. Elas viraram Fragmentos que se escondem nos lugares mais comuns: no aeroporto, no cardápio do restaurante, na reunião de trabalho. O próprio Doutor saiu da explosão com a cabeça em forma de hexágono e uma memória esquisita: só consegue guardar uma palavra nova se alguém a revisar no dia certo.",
  },
  {
    titulo: "O nascimento dos mascotes",
    humor: "festa",
    texto: "O raio da explosão atravessou o laboratório e deu vida a tudo que estava por perto. O papagaio virou poliglota, a tinta virou gente, o ursinho de pelúcia começou a dar abraços. Desde então, os mascotes ajudam o Doutor a procurar as palavras perdidas. Só que eles não conseguem fazer isso sozinhos.",
  },
  {
    titulo: "Você entra na história",
    humor: "festa",
    texto: "É aí que você aparece: o novo Aprendiz do Doutor Polygo. Cada lição recupera Fragmentos de palavras. Cada nível, do A1 ao C1, restaura uma face do Poliedro. A revisão inteligente é o truque que o Doutor descobriu para as palavras não fugirem de novo. Quando todas as faces estiverem restauradas, a Máquina Babelatrônica vai funcionar. E dessa vez quem vai falar todas as línguas é você.",
  },
];

function telaHistoria() {
  const nivel = nivelDe(E.xp);
  render(`
    <section class="historia-topo">
      <div class="ht-texto">
        <span class="selo">📖 A história</span>
        <h1>O <span class="destaque">Doutor Polygo</span> e as palavras perdidas</h1>
        <p class="sub">Um cientista maluco, uma máquina que explodiu, dez mascotes que ganharam vida e uma missão: recuperar todas as palavras do mundo. Com a sua ajuda.</p>
      </div>
      ${desenharDrPolygo("festa", "grande flutua")}
    </section>
    <div class="capitulos">${CAPITULOS.map((c, i) => `
      <article class="capitulo" style="--d:${i}">
        <div class="cap-arte">${i === 3 ? desenharMascote("kiko", "festa", "media") : desenharDrPolygo(c.humor, "media")}</div>
        <div><small>Capítulo ${i + 1}</small><h2>${c.titulo}</h2><p>${c.texto}</p></div>
      </article>`).join("")}</div>
    <h2>Os mascotes do laboratório</h2>
    <p class="sub">Eles aparecem na loja conforme você sobe de nível. Você está no nível ${nivel}.</p>
    <div class="elenco">${Object.entries(MASCOTES).map(([k, m]) => {
      const liberado = nivel >= m.nivel;
      const tem = E.mascotes.includes(k);
      return `<div class="elenco-card ${liberado ? "" : "travado"}">
        <div class="ec-arte">${desenharMascote(k, "feliz", "media")}</div>
        <div><b>${m.nome}</b> <small>${m.desc}</small>
        <p>${HISTORIA_MASCOTES[k]}</p>
        <span class="ec-estado">${tem ? "✔ Já é seu" : liberado ? `🪙 ${m.preco} na loja` : `🔒 Aparece no nível ${m.nivel}`}</span></div>
      </div>`;
    }).join("")}</div>
    <div class="acoes"><button class="btn grande" id="hsMissao">🧪 Começar minha missão</button></div>`);
  $("#hsMissao").onclick = () => ir(E.idioma ? "trilha" : "idiomas");
}
