// ============================================================
//  Conteúdo do Poliglota
//  Palavra: [português, inglês, espanhol, francês, italiano, alemão, emoji]
//  Frase:   [português, inglês, espanhol, francês, italiano, alemão]
// ============================================================

// Bandeiras desenhadas em SVG com as cores oficiais (emoji de bandeira não aparece no Windows)
function svgBandeira(cod, classe = "bandeira") {
  const h = 20 / 13;
  let eua = '<rect width="30" height="20" fill="#FFFFFF"/>';
  for (let i = 0; i < 13; i += 2) eua += `<rect y="${(i * h).toFixed(3)}" width="30" height="${h.toFixed(3)}" fill="#B22234"/>`;
  eua += `<rect width="12" height="${(7 * h).toFixed(3)}" fill="#3C3B6E"/>`;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) eua += `<circle cx="${(1.3 + c * 2.35).toFixed(2)}" cy="${(1.4 + r * 2.6).toFixed(2)}" r="0.5" fill="#FFFFFF"/>`;
  const B = {
    en: eua,
    es: '<rect width="30" height="20" fill="#AA151B"/><rect y="5" width="30" height="10" fill="#F1BF00"/>',
    fr: '<rect width="10" height="20" fill="#0055A4"/><rect x="10" width="10" height="20" fill="#FFFFFF"/><rect x="20" width="10" height="20" fill="#EF4135"/>',
    it: '<rect width="10" height="20" fill="#009246"/><rect x="10" width="10" height="20" fill="#F1F2F1"/><rect x="20" width="10" height="20" fill="#CE2B37"/>',
    de: '<rect width="30" height="6.67" fill="#000000"/><rect y="6.67" width="30" height="6.67" fill="#DD0000"/><rect y="13.33" width="30" height="6.67" fill="#FFCE00"/>',
  };
  return `<svg class="${classe}" viewBox="0 0 30 20" preserveAspectRatio="none" aria-hidden="true">${B[cod]}</svg>`;
}

// Cores oficiais de cada bandeira. c1 = cor principal (botões), c2 = destaque, c3 = terceira cor.
const IDIOMAS = {
  en: {
    nome: "Inglês", nativo: "English", voz: "en-US", col: 1,
    ola: "Hello", vamos: "Let's go!",
    elogios: ["Great job!", "Awesome!", "Well done!", "Perfect!", "Nice!"],
    especiais: [],
    tema: {
      c1: "#3C3B6E", c2: "#B22234", c3: "#FFFFFF", sobreC2: "#FFFFFF",
      faixa: "linear-gradient(90deg,#3C3B6E 0 24%,transparent 24%),repeating-linear-gradient(180deg,#B22234 0 1.5px,#FFFFFF 1.5px 3px)",
    },
  },
  es: {
    nome: "Espanhol", nativo: "Español", voz: "es-ES", col: 2,
    ola: "¡Hola", vamos: "¡Vamos!",
    elogios: ["¡Muy bien!", "¡Genial!", "¡Perfecto!", "¡Excelente!", "¡Olé!"],
    especiais: ["á", "é", "í", "ó", "ú", "ñ", "ü", "¿", "¡"],
    tema: {
      c1: "#AA151B", c2: "#F1BF00", c3: "#AA151B", sobreC2: "#2A1A00",
      faixa: "linear-gradient(180deg,#AA151B 0 25%,#F1BF00 25% 75%,#AA151B 75%)",
    },
  },
  fr: {
    nome: "Francês", nativo: "Français", voz: "fr-FR", col: 3,
    ola: "Bonjour", vamos: "Allons-y !",
    elogios: ["Très bien !", "Bravo !", "Parfait !", "Super !", "Magnifique !"],
    especiais: ["é", "è", "ê", "à", "â", "ç", "ù", "ô", "î", "œ"],
    tema: {
      c1: "#0055A4", c2: "#EF4135", c3: "#FFFFFF", sobreC2: "#FFFFFF",
      faixa: "linear-gradient(90deg,#0055A4 0 33.3%,#FFFFFF 33.3% 66.6%,#EF4135 66.6%)",
    },
  },
  it: {
    nome: "Italiano", nativo: "Italiano", voz: "it-IT", col: 4,
    ola: "Ciao", vamos: "Andiamo!",
    elogios: ["Bravissimo!", "Ottimo!", "Perfetto!", "Molto bene!", "Fantastico!"],
    especiais: ["à", "è", "é", "ì", "ò", "ù"],
    tema: {
      c1: "#009246", c2: "#CE2B37", c3: "#F1F2F1", sobreC2: "#FFFFFF",
      faixa: "linear-gradient(90deg,#009246 0 33.3%,#F1F2F1 33.3% 66.6%,#CE2B37 66.6%)",
    },
  },
  de: {
    nome: "Alemão", nativo: "Deutsch", voz: "de-DE", col: 5,
    ola: "Hallo", vamos: "Los geht's!",
    elogios: ["Sehr gut!", "Super!", "Toll!", "Perfekt!", "Wunderbar!"],
    especiais: ["ä", "ö", "ü", "ß"],
    tema: {
      c1: "#DD0000", c2: "#FFCE00", c3: "#000000", sobreC2: "#1A1400",
      faixa: "linear-gradient(180deg,#000000 0 33.3%,#DD0000 33.3% 66.6%,#FFCE00 66.6%)",
    },
  },
};

const TEMAS = [
  {
    id: "saudacoes", titulo: "Saudações", icone: "👋", desc: "Cumprimente e seja educado", imagens: false,
    palavras: [
      ["Olá", "Hello", "Hola", "Salut", "Ciao", "Hallo", "👋"],
      ["Tchau", "Goodbye", "Adiós", "Au revoir", "Arrivederci", "Tschüss", "🚪"],
      ["Obrigado", "Thank you", "Gracias", "Merci", "Grazie", "Danke", "🙏"],
      ["Por favor", "Please", "Por favor", "S'il vous plaît", "Per favore", "Bitte", "🥺"],
      ["Bom dia", "Good morning", "Buenos días", "Bonjour", "Buongiorno", "Guten Morgen", "🌅"],
      ["Boa noite", "Good night", "Buenas noches", "Bonne nuit", "Buonanotte", "Gute Nacht", "🌙"],
      ["Desculpe", "Sorry", "Lo siento", "Désolé", "Scusa", "Entschuldigung", "😔"],
      ["Como vai?", "How are you?", "¿Cómo estás?", "Comment ça va ?", "Come stai?", "Wie geht's?", "🙂"],
    ],
    frases: [
      ["Olá, como vai?", "Hello, how are you?", "Hola, ¿cómo estás?", "Salut, comment ça va ?", "Ciao, come stai?", "Hallo, wie geht's?"],
      ["Meu nome é Ana", "My name is Ana", "Me llamo Ana", "Je m'appelle Ana", "Mi chiamo Ana", "Ich heiße Ana"],
      ["Até amanhã", "See you tomorrow", "Hasta mañana", "À demain", "A domani", "Bis morgen"],
      ["Eu estou bem, obrigado", "I am fine, thank you", "Estoy bien, gracias", "Je vais bien, merci", "Sto bene, grazie", "Mir geht es gut, danke"],
    ],
  },
  {
    id: "numeros", titulo: "Números", icone: "🔢", desc: "Conte de um a dez", imagens: true,
    palavras: [
      ["Um", "One", "Uno", "Un", "Uno", "Eins", "1️⃣"],
      ["Dois", "Two", "Dos", "Deux", "Due", "Zwei", "2️⃣"],
      ["Três", "Three", "Tres", "Trois", "Tre", "Drei", "3️⃣"],
      ["Quatro", "Four", "Cuatro", "Quatre", "Quattro", "Vier", "4️⃣"],
      ["Cinco", "Five", "Cinco", "Cinq", "Cinque", "Fünf", "5️⃣"],
      ["Seis", "Six", "Seis", "Six", "Sei", "Sechs", "6️⃣"],
      ["Sete", "Seven", "Siete", "Sept", "Sette", "Sieben", "7️⃣"],
      ["Dez", "Ten", "Diez", "Dix", "Dieci", "Zehn", "🔟"],
    ],
    frases: [
      ["Eu tenho dois irmãos", "I have two brothers", "Tengo dos hermanos", "J'ai deux frères", "Ho due fratelli", "Ich habe zwei Brüder"],
      ["São três horas", "It is three o'clock", "Son las tres", "Il est trois heures", "Sono le tre", "Es ist drei Uhr"],
      ["Eu tenho dez anos", "I am ten years old", "Tengo diez años", "J'ai dix ans", "Ho dieci anni", "Ich bin zehn Jahre alt"],
      ["Um café, por favor", "One coffee, please", "Un café, por favor", "Un café, s'il vous plaît", "Un caffè, per favore", "Einen Kaffee, bitte"],
    ],
  },
  {
    id: "cores", titulo: "Cores", icone: "🎨", desc: "Descreva o mundo colorido", imagens: true,
    palavras: [
      ["Vermelho", "Red", "Rojo", "Rouge", "Rosso", "Rot", "🟥"],
      ["Azul", "Blue", "Azul", "Bleu", "Blu", "Blau", "🟦"],
      ["Verde", "Green", "Verde", "Vert", "Verde", "Grün", "🟩"],
      ["Amarelo", "Yellow", "Amarillo", "Jaune", "Giallo", "Gelb", "🟨"],
      ["Preto", "Black", "Negro", "Noir", "Nero", "Schwarz", "⬛"],
      ["Branco", "White", "Blanco", "Blanc", "Bianco", "Weiß", "⬜"],
      ["Rosa", "Pink", "Rosa", "Rose", "Rosa", "Rosa", "🌸"],
      ["Laranja", "Orange", "Naranja", "Orange", "Arancione", "Orange", "🟧"],
    ],
    frases: [
      ["O céu é azul", "The sky is blue", "El cielo es azul", "Le ciel est bleu", "Il cielo è blu", "Der Himmel ist blau"],
      ["Eu gosto de verde", "I like green", "Me gusta el verde", "J'aime le vert", "Mi piace il verde", "Ich mag Grün"],
      ["A maçã é vermelha", "The apple is red", "La manzana es roja", "La pomme est rouge", "La mela è rossa", "Der Apfel ist rot"],
      ["O gato é preto", "The cat is black", "El gato es negro", "Le chat est noir", "Il gatto è nero", "Die Katze ist schwarz"],
    ],
  },
  {
    id: "comida", titulo: "Comida", icone: "🍎", desc: "Peça comida e bebida", imagens: true,
    palavras: [
      ["Água", "Water", "Agua", "Eau", "Acqua", "Wasser", "💧"],
      ["Pão", "Bread", "Pan", "Pain", "Pane", "Brot", "🍞"],
      ["Maçã", "Apple", "Manzana", "Pomme", "Mela", "Apfel", "🍎"],
      ["Queijo", "Cheese", "Queso", "Fromage", "Formaggio", "Käse", "🧀"],
      ["Café", "Coffee", "Café", "Café", "Caffè", "Kaffee", "☕"],
      ["Leite", "Milk", "Leche", "Lait", "Latte", "Milch", "🥛"],
      ["Arroz", "Rice", "Arroz", "Riz", "Riso", "Reis", "🍚"],
      ["Carne", "Meat", "Carne", "Viande", "Carne", "Fleisch", "🥩"],
    ],
    frases: [
      ["Eu quero água", "I want water", "Quiero agua", "Je veux de l'eau", "Voglio dell'acqua", "Ich möchte Wasser"],
      ["Eu como pão com queijo", "I eat bread with cheese", "Como pan con queso", "Je mange du pain avec du fromage", "Mangio pane con formaggio", "Ich esse Brot mit Käse"],
      ["O café está quente", "The coffee is hot", "El café está caliente", "Le café est chaud", "Il caffè è caldo", "Der Kaffee ist heiß"],
      ["Eu bebo leite", "I drink milk", "Bebo leche", "Je bois du lait", "Bevo latte", "Ich trinke Milch"],
    ],
  },
  {
    id: "familia", titulo: "Família", icone: "👨‍👩‍👧", desc: "Fale de quem você ama", imagens: false,
    palavras: [
      ["Mãe", "Mother", "Madre", "Mère", "Madre", "Mutter", "👩"],
      ["Pai", "Father", "Padre", "Père", "Padre", "Vater", "👨"],
      ["Irmão", "Brother", "Hermano", "Frère", "Fratello", "Bruder", "👦"],
      ["Irmã", "Sister", "Hermana", "Sœur", "Sorella", "Schwester", "👧"],
      ["Filho", "Son", "Hijo", "Fils", "Figlio", "Sohn", "👶"],
      ["Filha", "Daughter", "Hija", "Fille", "Figlia", "Tochter", "🎀"],
      ["Avó", "Grandmother", "Abuela", "Grand-mère", "Nonna", "Großmutter", "👵"],
      ["Avô", "Grandfather", "Abuelo", "Grand-père", "Nonno", "Großvater", "👴"],
    ],
    frases: [
      ["Esta é minha mãe", "This is my mother", "Esta es mi madre", "C'est ma mère", "Questa è mia madre", "Das ist meine Mutter"],
      ["Meu pai trabalha muito", "My father works a lot", "Mi padre trabaja mucho", "Mon père travaille beaucoup", "Mio padre lavora molto", "Mein Vater arbeitet viel"],
      ["Eu amo minha família", "I love my family", "Amo a mi familia", "J'aime ma famille", "Amo la mia famiglia", "Ich liebe meine Familie"],
      ["Minha irmã é alta", "My sister is tall", "Mi hermana es alta", "Ma sœur est grande", "Mia sorella è alta", "Meine Schwester ist groß"],
    ],
  },
  {
    id: "animais", titulo: "Animais", icone: "🐶", desc: "Bichos de casa e da fazenda", imagens: true,
    palavras: [
      ["Cachorro", "Dog", "Perro", "Chien", "Cane", "Hund", "🐶"],
      ["Gato", "Cat", "Gato", "Chat", "Gatto", "Katze", "🐱"],
      ["Pássaro", "Bird", "Pájaro", "Oiseau", "Uccello", "Vogel", "🐦"],
      ["Peixe", "Fish", "Pez", "Poisson", "Pesce", "Fisch", "🐟"],
      ["Cavalo", "Horse", "Caballo", "Cheval", "Cavallo", "Pferd", "🐴"],
      ["Vaca", "Cow", "Vaca", "Vache", "Mucca", "Kuh", "🐮"],
      ["Porco", "Pig", "Cerdo", "Cochon", "Maiale", "Schwein", "🐷"],
      ["Rato", "Mouse", "Ratón", "Souris", "Topo", "Maus", "🐭"],
    ],
    frases: [
      ["O cachorro é grande", "The dog is big", "El perro es grande", "Le chien est grand", "Il cane è grande", "Der Hund ist groß"],
      ["Eu tenho um gato", "I have a cat", "Tengo un gato", "J'ai un chat", "Ho un gatto", "Ich habe eine Katze"],
      ["O pássaro canta", "The bird sings", "El pájaro canta", "L'oiseau chante", "L'uccello canta", "Der Vogel singt"],
      ["O peixe nada", "The fish swims", "El pez nada", "Le poisson nage", "Il pesce nuota", "Der Fisch schwimmt"],
    ],
  },
  {
    id: "acoes", titulo: "Ações", icone: "🏃", desc: "Verbos do dia a dia", imagens: true,
    palavras: [
      ["Comer", "Eat", "Comer", "Manger", "Mangiare", "Essen", "🍽️"],
      ["Beber", "Drink", "Beber", "Boire", "Bere", "Trinken", "🥤"],
      ["Dormir", "Sleep", "Dormir", "Dormir", "Dormire", "Schlafen", "😴"],
      ["Correr", "Run", "Correr", "Courir", "Correre", "Laufen", "🏃"],
      ["Ler", "Read", "Leer", "Lire", "Leggere", "Lesen", "📖"],
      ["Escrever", "Write", "Escribir", "Écrire", "Scrivere", "Schreiben", "✍️"],
      ["Falar", "Speak", "Hablar", "Parler", "Parlare", "Sprechen", "🗣️"],
      ["Ouvir", "Listen", "Escuchar", "Écouter", "Ascoltare", "Hören", "👂"],
    ],
    frases: [
      ["Eu leio um livro", "I read a book", "Leo un libro", "Je lis un livre", "Leggo un libro", "Ich lese ein Buch"],
      ["Nós falamos português", "We speak Portuguese", "Hablamos portugués", "Nous parlons portugais", "Parliamo portoghese", "Wir sprechen Portugiesisch"],
      ["Ela dorme cedo", "She sleeps early", "Ella duerme temprano", "Elle dort tôt", "Lei dorme presto", "Sie schläft früh"],
      ["Eles correm no parque", "They run in the park", "Ellos corren en el parque", "Ils courent dans le parc", "Loro corrono nel parco", "Sie laufen im Park"],
    ],
  },
  {
    id: "viagem", titulo: "Viagem", icone: "✈️", desc: "Sobreviva na sua viagem", imagens: true,
    palavras: [
      ["Aeroporto", "Airport", "Aeropuerto", "Aéroport", "Aeroporto", "Flughafen", "✈️"],
      ["Hotel", "Hotel", "Hotel", "Hôtel", "Albergo", "Hotel", "🏨"],
      ["Passaporte", "Passport", "Pasaporte", "Passeport", "Passaporto", "Reisepass", "🛂"],
      ["Bilhete", "Ticket", "Billete", "Billet", "Biglietto", "Fahrkarte", "🎫"],
      ["Mala", "Suitcase", "Maleta", "Valise", "Valigia", "Koffer", "🧳"],
      ["Praia", "Beach", "Playa", "Plage", "Spiaggia", "Strand", "🏖️"],
      ["Onde fica?", "Where is it?", "¿Dónde está?", "Où est-ce ?", "Dov'è?", "Wo ist es?", "📍"],
      ["Quanto custa?", "How much is it?", "¿Cuánto cuesta?", "Combien ça coûte ?", "Quanto costa?", "Wie viel kostet das?", "💰"],
    ],
    frases: [
      ["Onde fica o hotel?", "Where is the hotel?", "¿Dónde está el hotel?", "Où est l'hôtel ?", "Dov'è l'albergo?", "Wo ist das Hotel?"],
      ["Eu preciso de um bilhete", "I need a ticket", "Necesito un billete", "J'ai besoin d'un billet", "Ho bisogno di un biglietto", "Ich brauche eine Fahrkarte"],
      ["A praia é bonita", "The beach is beautiful", "La playa es bonita", "La plage est belle", "La spiaggia è bella", "Der Strand ist schön"],
      ["Quanto custa o bilhete?", "How much is the ticket?", "¿Cuánto cuesta el billete?", "Combien coûte le billet ?", "Quanto costa il biglietto?", "Wie viel kostet die Fahrkarte?"],
    ],
  },
];

const AVATARES = [
  { e: "🦊", preco: 0 }, { e: "🐼", preco: 30 }, { e: "🐸", preco: 30 }, { e: "🐨", preco: 40 },
  { e: "🦁", preco: 60 }, { e: "🐙", preco: 60 }, { e: "🦄", preco: 100 }, { e: "🐲", preco: 150 },
  { e: "🤖", preco: 150 }, { e: "👽", preco: 200 }, { e: "🦖", preco: 250 }, { e: "👑", preco: 400 },
];
