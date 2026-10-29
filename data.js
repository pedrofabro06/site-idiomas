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

// ------------------------------------------------------------
//  Unidades novas, organizadas pelos níveis do Quadro Europeu (CEFR)
// ------------------------------------------------------------
TEMAS.push(
  // ===== A1 =====
  {
    id: "corpo", titulo: "Corpo", icone: "🖐️", desc: "As partes do corpo", imagens: true, nivel: "A1",
    palavras: [
      ["Olho", "Eye", "Ojo", "Œil", "Occhio", "Auge", "👁️"],
      ["Orelha", "Ear", "Oreja", "Oreille", "Orecchio", "Ohr", "👂"],
      ["Nariz", "Nose", "Nariz", "Nez", "Naso", "Nase", "👃"],
      ["Boca", "Mouth", "Boca", "Bouche", "Bocca", "Mund", "👄"],
      ["Mão", "Hand", "Mano", "Main", "Mano", "Hand", "✋"],
      ["Pé", "Foot", "Pie", "Pied", "Piede", "Fuß", "🦶"],
      ["Perna", "Leg", "Pierna", "Jambe", "Gamba", "Bein", "🦵"],
      ["Braço", "Arm", "Brazo", "Bras", "Braccio", "Arm", "💪"],
    ],
    frases: [
      ["Eu tenho dois olhos", "I have two eyes", "Tengo dos ojos", "J'ai deux yeux", "Ho due occhi", "Ich habe zwei Augen"],
      ["Minha mão está fria", "My hand is cold", "Mi mano está fría", "Ma main est froide", "La mia mano è fredda", "Meine Hand ist kalt"],
      ["Ele lava o rosto", "He washes his face", "Él se lava la cara", "Il se lave le visage", "Lui si lava la faccia", "Er wäscht sein Gesicht"],
      ["Meu pé dói", "My foot hurts", "Me duele el pie", "J'ai mal au pied", "Mi fa male il piede", "Mein Fuß tut weh"],
    ],
  },
  {
    id: "roupas", titulo: "Roupas", icone: "👕", desc: "O que você veste", imagens: true, nivel: "A1",
    palavras: [
      ["Camisa", "Shirt", "Camisa", "Chemise", "Camicia", "Hemd", "👔"],
      ["Camiseta", "T-shirt", "Camiseta", "T-shirt", "Maglietta", "T-Shirt", "👕"],
      ["Calça", "Pants", "Pantalones", "Pantalon", "Pantaloni", "Hose", "👖"],
      ["Vestido", "Dress", "Vestido", "Robe", "Vestito", "Kleid", "👗"],
      ["Sapato", "Shoe", "Zapato", "Chaussure", "Scarpa", "Schuh", "👞"],
      ["Chapéu", "Hat", "Sombrero", "Chapeau", "Cappello", "Hut", "🎩"],
      ["Casaco", "Coat", "Abrigo", "Manteau", "Cappotto", "Mantel", "🧥"],
      ["Meias", "Socks", "Calcetines", "Chaussettes", "Calzini", "Socken", "🧦"],
    ],
    frases: [
      ["Eu uso um chapéu", "I wear a hat", "Llevo un sombrero", "Je porte un chapeau", "Porto un cappello", "Ich trage einen Hut"],
      ["O vestido é bonito", "The dress is pretty", "El vestido es bonito", "La robe est jolie", "Il vestito è bello", "Das Kleid ist schön"],
      ["Onde estão meus sapatos?", "Where are my shoes?", "¿Dónde están mis zapatos?", "Où sont mes chaussures ?", "Dove sono le mie scarpe?", "Wo sind meine Schuhe?"],
      ["Está frio, use um casaco", "It is cold, wear a coat", "Hace frío, ponte un abrigo", "Il fait froid, mets un manteau", "Fa freddo, metti un cappotto", "Es ist kalt, zieh einen Mantel an"],
    ],
  },
  {
    id: "casa", titulo: "Casa", icone: "🏠", desc: "Cômodos e objetos de casa", imagens: true, nivel: "A1",
    palavras: [
      ["Casa", "House", "Casa", "Maison", "Casa", "Haus", "🏠"],
      ["Porta", "Door", "Puerta", "Porte", "Porta", "Tür", "🚪"],
      ["Janela", "Window", "Ventana", "Fenêtre", "Finestra", "Fenster", "🪟"],
      ["Cama", "Bed", "Cama", "Lit", "Letto", "Bett", "🛏️"],
      ["Cozinha", "Kitchen", "Cocina", "Cuisine", "Cucina", "Küche", "🍳"],
      ["Cadeira", "Chair", "Silla", "Chaise", "Sedia", "Stuhl", "🪑"],
      ["Banheiro", "Bathroom", "Baño", "Salle de bain", "Bagno", "Badezimmer", "🛁"],
      ["Chave", "Key", "Llave", "Clé", "Chiave", "Schlüssel", "🔑"],
    ],
    frases: [
      ["Minha casa é pequena", "My house is small", "Mi casa es pequeña", "Ma maison est petite", "La mia casa è piccola", "Mein Haus ist klein"],
      ["Feche a porta, por favor", "Close the door, please", "Cierra la puerta, por favor", "Ferme la porte, s'il te plaît", "Chiudi la porta, per favore", "Mach bitte die Tür zu"],
      ["A chave está na mesa", "The key is on the table", "La llave está en la mesa", "La clé est sur la table", "La chiave è sul tavolo", "Der Schlüssel liegt auf dem Tisch"],
      ["Eu durmo no meu quarto", "I sleep in my room", "Duermo en mi habitación", "Je dors dans ma chambre", "Dormo nella mia camera", "Ich schlafe in meinem Zimmer"],
    ],
  },
  {
    id: "clima", titulo: "Clima", icone: "☀️", desc: "Fale sobre o tempo", imagens: true, nivel: "A1",
    palavras: [
      ["Sol", "Sun", "Sol", "Soleil", "Sole", "Sonne", "☀️"],
      ["Chuva", "Rain", "Lluvia", "Pluie", "Pioggia", "Regen", "🌧️"],
      ["Neve", "Snow", "Nieve", "Neige", "Neve", "Schnee", "❄️"],
      ["Vento", "Wind", "Viento", "Vent", "Vento", "Wind", "💨"],
      ["Nuvem", "Cloud", "Nube", "Nuage", "Nuvola", "Wolke", "☁️"],
      ["Quente", "Hot", "Caliente", "Chaud", "Caldo", "Heiß", "🔥"],
      ["Frio", "Cold", "Frío", "Froid", "Freddo", "Kalt", "🥶"],
      ["Tempestade", "Storm", "Tormenta", "Tempête", "Tempesta", "Sturm", "⛈️"],
    ],
    frases: [
      ["Hoje está fazendo sol", "It is sunny today", "Hoy hace sol", "Il y a du soleil aujourd'hui", "Oggi c'è il sole", "Heute scheint die Sonne"],
      ["Está chovendo muito", "It is raining a lot", "Está lloviendo mucho", "Il pleut beaucoup", "Piove molto", "Es regnet viel"],
      ["No inverno faz frio", "It is cold in winter", "En invierno hace frío", "En hiver, il fait froid", "In inverno fa freddo", "Im Winter ist es kalt"],
      ["Amanhã vai nevar", "It will snow tomorrow", "Mañana va a nevar", "Il va neiger demain", "Domani nevicherà", "Morgen wird es schneien"],
    ],
  },

  // ===== A2 =====
  {
    id: "dias", titulo: "Dias e horas", icone: "📅", desc: "Dias da semana e horários", imagens: false, nivel: "A2",
    palavras: [
      ["Segunda-feira", "Monday", "Lunes", "Lundi", "Lunedì", "Montag", "📅"],
      ["Sexta-feira", "Friday", "Viernes", "Vendredi", "Venerdì", "Freitag", "🎉"],
      ["Domingo", "Sunday", "Domingo", "Dimanche", "Domenica", "Sonntag", "☀️"],
      ["Hoje", "Today", "Hoy", "Aujourd'hui", "Oggi", "Heute", "📍"],
      ["Amanhã", "Tomorrow", "Mañana", "Demain", "Domani", "Morgen", "⏭️"],
      ["Ontem", "Yesterday", "Ayer", "Hier", "Ieri", "Gestern", "⏮️"],
      ["Semana", "Week", "Semana", "Semaine", "Settimana", "Woche", "🗓️"],
      ["Hora", "Hour", "Hora", "Heure", "Ora", "Stunde", "⏰"],
    ],
    frases: [
      ["Que horas são?", "What time is it?", "¿Qué hora es?", "Quelle heure est-il ?", "Che ore sono?", "Wie spät ist es?"],
      ["Eu trabalho de segunda a sexta", "I work from Monday to Friday", "Trabajo de lunes a viernes", "Je travaille du lundi au vendredi", "Lavoro dal lunedì al venerdì", "Ich arbeite von Montag bis Freitag"],
      ["Ontem eu fui ao cinema", "Yesterday I went to the cinema", "Ayer fui al cine", "Hier, je suis allé au cinéma", "Ieri sono andato al cinema", "Gestern bin ich ins Kino gegangen"],
      ["Nos vemos na próxima semana", "See you next week", "Nos vemos la próxima semana", "À la semaine prochaine", "Ci vediamo la prossima settimana", "Wir sehen uns nächste Woche"],
    ],
  },
  {
    id: "cidade", titulo: "Cidade", icone: "🏙️", desc: "Lugares e direções", imagens: true, nivel: "A2",
    palavras: [
      ["Rua", "Street", "Calle", "Rue", "Strada", "Straße", "🛣️"],
      ["Ônibus", "Bus", "Autobús", "Bus", "Autobus", "Bus", "🚌"],
      ["Estação", "Station", "Estación", "Gare", "Stazione", "Bahnhof", "🚉"],
      ["Hospital", "Hospital", "Hospital", "Hôpital", "Ospedale", "Krankenhaus", "🏥"],
      ["Banco", "Bank", "Banco", "Banque", "Banca", "Bank", "🏦"],
      ["Mercado", "Market", "Mercado", "Marché", "Mercato", "Markt", "🛒"],
      ["Restaurante", "Restaurant", "Restaurante", "Restaurant", "Ristorante", "Restaurant", "🍴"],
      ["Parque", "Park", "Parque", "Parc", "Parco", "Park", "🌳"],
    ],
    frases: [
      ["Onde fica a estação?", "Where is the station?", "¿Dónde está la estación?", "Où est la gare ?", "Dov'è la stazione?", "Wo ist der Bahnhof?"],
      ["Vire à direita na próxima rua", "Turn right at the next street", "Gira a la derecha en la próxima calle", "Tournez à droite dans la prochaine rue", "Gira a destra alla prossima strada", "Biegen Sie an der nächsten Straße rechts ab"],
      ["O banco fica perto do parque", "The bank is near the park", "El banco está cerca del parque", "La banque est près du parc", "La banca è vicino al parco", "Die Bank ist in der Nähe des Parks"],
      ["Eu pego o ônibus todo dia", "I take the bus every day", "Tomo el autobús todos los días", "Je prends le bus tous les jours", "Prendo l'autobus ogni giorno", "Ich nehme jeden Tag den Bus"],
    ],
  },
  {
    id: "compras", titulo: "Compras", icone: "🛍️", desc: "Preços, lojas e pagamentos", imagens: false, nivel: "A2",
    palavras: [
      ["Dinheiro", "Money", "Dinero", "Argent", "Soldi", "Geld", "💵"],
      ["Preço", "Price", "Precio", "Prix", "Prezzo", "Preis", "🏷️"],
      ["Barato", "Cheap", "Barato", "Bon marché", "Economico", "Billig", "👍"],
      ["Caro", "Expensive", "Caro", "Cher", "Caro", "Teuer", "💸"],
      ["Loja", "Shop", "Tienda", "Magasin", "Negozio", "Laden", "🏬"],
      ["Comprar", "Buy", "Comprar", "Acheter", "Comprare", "Kaufen", "🛍️"],
      ["Pagar", "Pay", "Pagar", "Payer", "Pagare", "Bezahlen", "💳"],
      ["Tamanho", "Size", "Talla", "Taille", "Taglia", "Größe", "📏"],
    ],
    frases: [
      ["Quanto custa isto?", "How much does this cost?", "¿Cuánto cuesta esto?", "Combien coûte ceci ?", "Quanto costa questo?", "Wie viel kostet das?"],
      ["Posso pagar com cartão?", "Can I pay by card?", "¿Puedo pagar con tarjeta?", "Est-ce que je peux payer par carte ?", "Posso pagare con la carta?", "Kann ich mit Karte bezahlen?"],
      ["Este casaco é muito caro", "This coat is very expensive", "Este abrigo es muy caro", "Ce manteau est très cher", "Questo cappotto è molto caro", "Dieser Mantel ist sehr teuer"],
      ["Vocês têm um tamanho maior?", "Do you have a bigger size?", "¿Tienen una talla más grande?", "Vous avez une taille plus grande ?", "Avete una taglia più grande?", "Haben Sie eine größere Größe?"],
    ],
  },
  {
    id: "trabalho", titulo: "Trabalho", icone: "💼", desc: "Escritório e rotina profissional", imagens: false, nivel: "A2",
    palavras: [
      ["Trabalho", "Work", "Trabajo", "Travail", "Lavoro", "Arbeit", "💼"],
      ["Escritório", "Office", "Oficina", "Bureau", "Ufficio", "Büro", "🏢"],
      ["Chefe", "Boss", "Jefe", "Patron", "Capo", "Chef", "👔"],
      ["Reunião", "Meeting", "Reunión", "Réunion", "Riunione", "Besprechung", "🤝"],
      ["Salário", "Salary", "Salario", "Salaire", "Stipendio", "Gehalt", "💰"],
      ["Colega", "Colleague", "Colega", "Collègue", "Collega", "Kollege", "👥"],
      ["Computador", "Computer", "Ordenador", "Ordinateur", "Computer", "Computer", "💻"],
      ["Contrato", "Contract", "Contrato", "Contrat", "Contratto", "Vertrag", "📄"],
    ],
    frases: [
      ["Eu tenho uma reunião às dez", "I have a meeting at ten", "Tengo una reunión a las diez", "J'ai une réunion à dix heures", "Ho una riunione alle dieci", "Ich habe um zehn eine Besprechung"],
      ["Meu chefe é muito simpático", "My boss is very nice", "Mi jefe es muy simpático", "Mon patron est très sympathique", "Il mio capo è molto simpatico", "Mein Chef ist sehr nett"],
      ["Eu trabalho em um escritório", "I work in an office", "Trabajo en una oficina", "Je travaille dans un bureau", "Lavoro in un ufficio", "Ich arbeite in einem Büro"],
      ["Ela procura um novo emprego", "She is looking for a new job", "Ella busca un nuevo trabajo", "Elle cherche un nouvel emploi", "Lei cerca un nuovo lavoro", "Sie sucht eine neue Stelle"],
    ],
  },
  {
    id: "saude", titulo: "Saúde", icone: "🩺", desc: "No médico e na farmácia", imagens: false, nivel: "A2",
    palavras: [
      ["Médico", "Doctor", "Médico", "Médecin", "Medico", "Arzt", "🧑‍⚕️"],
      ["Remédio", "Medicine", "Medicamento", "Médicament", "Medicina", "Medikament", "💊"],
      ["Dor", "Pain", "Dolor", "Douleur", "Dolore", "Schmerz", "🤕"],
      ["Febre", "Fever", "Fiebre", "Fièvre", "Febbre", "Fieber", "🤒"],
      ["Doente", "Sick", "Enfermo", "Malade", "Malato", "Krank", "🤧"],
      ["Saudável", "Healthy", "Sano", "Sain", "Sano", "Gesund", "🥗"],
      ["Farmácia", "Pharmacy", "Farmacia", "Pharmacie", "Farmacia", "Apotheke", "🏪"],
      ["Cansado", "Tired", "Cansado", "Fatigué", "Stanco", "Müde", "😩"],
    ],
    frases: [
      ["Eu preciso de um médico", "I need a doctor", "Necesito un médico", "J'ai besoin d'un médecin", "Ho bisogno di un medico", "Ich brauche einen Arzt"],
      ["Estou com dor de cabeça", "I have a headache", "Me duele la cabeza", "J'ai mal à la tête", "Ho mal di testa", "Ich habe Kopfschmerzen"],
      ["Ela está com febre", "She has a fever", "Ella tiene fiebre", "Elle a de la fièvre", "Lei ha la febbre", "Sie hat Fieber"],
      ["Onde fica a farmácia mais próxima?", "Where is the nearest pharmacy?", "¿Dónde está la farmacia más cercana?", "Où est la pharmacie la plus proche ?", "Dov'è la farmacia più vicina?", "Wo ist die nächste Apotheke?"],
    ],
  },
  {
    id: "emocoes", titulo: "Emoções", icone: "😊", desc: "Como você se sente", imagens: true, nivel: "A2",
    palavras: [
      ["Feliz", "Happy", "Feliz", "Heureux", "Felice", "Glücklich", "😊"],
      ["Triste", "Sad", "Triste", "Triste", "Triste", "Traurig", "😢"],
      ["Bravo", "Angry", "Enfadado", "En colère", "Arrabbiato", "Wütend", "😠"],
      ["Assustado", "Scared", "Asustado", "Effrayé", "Spaventato", "Ängstlich", "😨"],
      ["Surpreso", "Surprised", "Sorprendido", "Surpris", "Sorpreso", "Überrascht", "😮"],
      ["Calmo", "Calm", "Tranquilo", "Calme", "Calmo", "Ruhig", "😌"],
      ["Nervoso", "Nervous", "Nervioso", "Nerveux", "Nervoso", "Nervös", "😬"],
      ["Apaixonado", "In love", "Enamorado", "Amoureux", "Innamorato", "Verliebt", "😍"],
    ],
    frases: [
      ["Eu estou muito feliz hoje", "I am very happy today", "Estoy muy feliz hoy", "Je suis très heureux aujourd'hui", "Oggi sono molto felice", "Ich bin heute sehr glücklich"],
      ["Por que você está triste?", "Why are you sad?", "¿Por qué estás triste?", "Pourquoi es-tu triste ?", "Perché sei triste?", "Warum bist du traurig?"],
      ["Ele fica nervoso antes das provas", "He gets nervous before exams", "Se pone nervioso antes de los exámenes", "Il est nerveux avant les examens", "Diventa nervoso prima degli esami", "Er wird vor Prüfungen nervös"],
      ["Não fique bravo comigo", "Don't be angry with me", "No te enfades conmigo", "Ne sois pas en colère contre moi", "Non arrabbiarti con me", "Sei nicht wütend auf mich"],
    ],
  },

  // ===== B1 =====
  {
    id: "natureza", titulo: "Natureza e ambiente", icone: "🌍", desc: "Paisagens e sustentabilidade", imagens: true, nivel: "B1",
    palavras: [
      ["Árvore", "Tree", "Árbol", "Arbre", "Albero", "Baum", "🌳"],
      ["Rio", "River", "Río", "Rivière", "Fiume", "Fluss", "🏞️"],
      ["Montanha", "Mountain", "Montaña", "Montagne", "Montagna", "Berg", "⛰️"],
      ["Mar", "Sea", "Mar", "Mer", "Mare", "Meer", "🌊"],
      ["Floresta", "Forest", "Bosque", "Forêt", "Foresta", "Wald", "🌲"],
      ["Flor", "Flower", "Flor", "Fleur", "Fiore", "Blume", "🌼"],
      ["Lixo", "Trash", "Basura", "Déchets", "Rifiuti", "Müll", "🗑️"],
      ["Reciclar", "Recycle", "Reciclar", "Recycler", "Riciclare", "Recyceln", "♻️"],
    ],
    frases: [
      ["Devemos proteger as florestas", "We must protect the forests", "Debemos proteger los bosques", "Nous devons protéger les forêts", "Dobbiamo proteggere le foreste", "Wir müssen die Wälder schützen"],
      ["Eu sempre reciclo o lixo", "I always recycle the trash", "Siempre reciclo la basura", "Je recycle toujours les déchets", "Riciclo sempre i rifiuti", "Ich recycle immer den Müll"],
      ["Subimos a montanha no verão passado", "We climbed the mountain last summer", "Subimos la montaña el verano pasado", "Nous avons escaladé la montagne l'été dernier", "Abbiamo scalato la montagna l'estate scorsa", "Wir sind letzten Sommer auf den Berg gestiegen"],
      ["A poluição está aumentando nas cidades", "Pollution is increasing in cities", "La contaminación está aumentando en las ciudades", "La pollution augmente dans les villes", "L'inquinamento sta aumentando nelle città", "Die Umweltverschmutzung nimmt in den Städten zu"],
    ],
  },
  {
    id: "tecnologia", titulo: "Tecnologia", icone: "📱", desc: "Celular, apps e internet", imagens: true, nivel: "B1",
    palavras: [
      ["Celular", "Phone", "Móvil", "Portable", "Cellulare", "Handy", "📱"],
      ["Senha", "Password", "Contraseña", "Mot de passe", "Password", "Passwort", "🔐"],
      ["Tela", "Screen", "Pantalla", "Écran", "Schermo", "Bildschirm", "🖥️"],
      ["Aplicativo", "App", "Aplicación", "Application", "Applicazione", "App", "📲"],
      ["Baixar", "Download", "Descargar", "Télécharger", "Scaricare", "Herunterladen", "⬇️"],
      ["Mensagem", "Message", "Mensaje", "Message", "Messaggio", "Nachricht", "💬"],
      ["Bateria", "Battery", "Batería", "Batterie", "Batteria", "Akku", "🔋"],
      ["Arquivo", "File", "Archivo", "Fichier", "File", "Datei", "📁"],
    ],
    frases: [
      ["Esqueci minha senha", "I forgot my password", "Olvidé mi contraseña", "J'ai oublié mon mot de passe", "Ho dimenticato la mia password", "Ich habe mein Passwort vergessen"],
      ["A bateria do meu celular acabou", "My phone battery died", "Se me acabó la batería del móvil", "La batterie de mon portable est vide", "La batteria del mio cellulare è scarica", "Der Akku meines Handys ist leer"],
      ["Você pode me mandar uma mensagem?", "Can you send me a message?", "¿Puedes enviarme un mensaje?", "Tu peux m'envoyer un message ?", "Puoi mandarmi un messaggio?", "Kannst du mir eine Nachricht schicken?"],
      ["Baixe o aplicativo no seu celular", "Download the app on your phone", "Descarga la aplicación en tu móvil", "Télécharge l'application sur ton portable", "Scarica l'applicazione sul tuo cellulare", "Lade die App auf dein Handy herunter"],
    ],
  },
  {
    id: "estudos", titulo: "Estudos", icone: "🎓", desc: "Escola, provas e aprendizado", imagens: false, nivel: "B1",
    palavras: [
      ["Escola", "School", "Escuela", "École", "Scuola", "Schule", "🏫"],
      ["Professor", "Teacher", "Profesor", "Professeur", "Insegnante", "Lehrer", "🧑‍🏫"],
      ["Aluno", "Student", "Alumno", "Élève", "Studente", "Schüler", "🧑‍🎓"],
      ["Prova", "Exam", "Examen", "Examen", "Esame", "Prüfung", "📝"],
      ["Aprender", "Learn", "Aprender", "Apprendre", "Imparare", "Lernen", "🧠"],
      ["Livro", "Book", "Libro", "Livre", "Libro", "Buch", "📚"],
      ["Universidade", "University", "Universidad", "Université", "Università", "Universität", "🎓"],
      ["Lição de casa", "Homework", "Deberes", "Devoirs", "Compiti", "Hausaufgaben", "📓"],
    ],
    frases: [
      ["Eu estudo inglês há dois anos", "I have been studying English for two years", "Estudio inglés desde hace dos años", "J'étudie l'anglais depuis deux ans", "Studio inglese da due anni", "Ich lerne seit zwei Jahren Englisch"],
      ["A prova foi mais fácil do que eu esperava", "The exam was easier than I expected", "El examen fue más fácil de lo que esperaba", "L'examen était plus facile que prévu", "L'esame è stato più facile del previsto", "Die Prüfung war leichter als erwartet"],
      ["Se eu tivesse tempo, faria um curso", "If I had time, I would take a course", "Si tuviera tiempo, haría un curso", "Si j'avais le temps, je suivrais un cours", "Se avessi tempo, farei un corso", "Wenn ich Zeit hätte, würde ich einen Kurs machen"],
      ["Você já terminou a lição de casa?", "Have you finished your homework yet?", "¿Ya has terminado los deberes?", "Tu as déjà fini tes devoirs ?", "Hai già finito i compiti?", "Hast du die Hausaufgaben schon gemacht?"],
    ],
  },
  {
    id: "opinioes", titulo: "Opiniões e conectores", icone: "💭", desc: "Concorde, discorde e argumente", imagens: false, nivel: "B1",
    palavras: [
      ["Porque", "Because", "Porque", "Parce que", "Perché", "Weil", "🔗"],
      ["Mas", "But", "Pero", "Mais", "Ma", "Aber", "↔️"],
      ["Embora", "Although", "Aunque", "Bien que", "Anche se", "Obwohl", "🤔"],
      ["Portanto", "Therefore", "Por lo tanto", "Donc", "Quindi", "Deshalb", "➡️"],
      ["Acho que", "I think", "Creo que", "Je pense que", "Penso che", "Ich glaube", "💭"],
      ["Concordar", "Agree", "Estar de acuerdo", "Être d'accord", "Essere d'accordo", "Zustimmen", "👍"],
      ["Talvez", "Maybe", "Quizás", "Peut-être", "Forse", "Vielleicht", "🤷"],
      ["Na verdade", "Actually", "En realidad", "En fait", "In realtà", "Eigentlich", "💡"],
    ],
    frases: [
      ["Eu acho que você tem razão", "I think you are right", "Creo que tienes razón", "Je pense que tu as raison", "Penso che tu abbia ragione", "Ich glaube, du hast recht"],
      ["Gosto de viajar, mas é caro", "I like to travel, but it is expensive", "Me gusta viajar, pero es caro", "J'aime voyager, mais c'est cher", "Mi piace viaggiare, ma è caro", "Ich reise gern, aber es ist teuer"],
      ["Embora esteja chovendo, vamos sair", "Although it is raining, we are going out", "Aunque está lloviendo, vamos a salir", "Bien qu'il pleuve, nous allons sortir", "Anche se piove, usciamo", "Obwohl es regnet, gehen wir raus"],
      ["Não concordo com essa ideia", "I don't agree with that idea", "No estoy de acuerdo con esa idea", "Je ne suis pas d'accord avec cette idée", "Non sono d'accordo con questa idea", "Ich stimme dieser Idee nicht zu"],
    ],
  },

  // ===== B2 =====
  {
    id: "negocios", titulo: "Negócios", icone: "📈", desc: "Empresas, prazos e negociação", imagens: false, nivel: "B2",
    palavras: [
      ["Empresa", "Company", "Empresa", "Entreprise", "Azienda", "Unternehmen", "🏢"],
      ["Cliente", "Customer", "Cliente", "Client", "Cliente", "Kunde", "🙋"],
      ["Lucro", "Profit", "Beneficio", "Bénéfice", "Profitto", "Gewinn", "📈"],
      ["Prazo", "Deadline", "Plazo", "Délai", "Scadenza", "Frist", "⏳"],
      ["Negociar", "Negotiate", "Negociar", "Négocier", "Negoziare", "Verhandeln", "🤝"],
      ["Investimento", "Investment", "Inversión", "Investissement", "Investimento", "Investition", "💹"],
      ["Fornecedor", "Supplier", "Proveedor", "Fournisseur", "Fornitore", "Lieferant", "🚚"],
      ["Orçamento", "Budget", "Presupuesto", "Budget", "Budget", "Budget", "🧾"],
    ],
    frases: [
      ["Precisamos cumprir o prazo até sexta", "We need to meet the deadline by Friday", "Tenemos que cumplir el plazo antes del viernes", "Nous devons respecter le délai d'ici vendredi", "Dobbiamo rispettare la scadenza entro venerdì", "Wir müssen die Frist bis Freitag einhalten"],
      ["A empresa aumentou seus lucros este ano", "The company increased its profits this year", "La empresa aumentó sus beneficios este año", "L'entreprise a augmenté ses bénéfices cette année", "L'azienda ha aumentato i suoi profitti quest'anno", "Das Unternehmen hat dieses Jahr seinen Gewinn gesteigert"],
      ["Gostaria de agendar uma reunião com o cliente", "I would like to schedule a meeting with the client", "Me gustaría programar una reunión con el cliente", "Je voudrais organiser une réunion avec le client", "Vorrei fissare una riunione con il cliente", "Ich möchte einen Termin mit dem Kunden vereinbaren"],
      ["O orçamento não permite novos investimentos", "The budget does not allow new investments", "El presupuesto no permite nuevas inversiones", "Le budget ne permet pas de nouveaux investissements", "Il budget non permette nuovi investimenti", "Das Budget erlaubt keine neuen Investitionen"],
    ],
  },
  {
    id: "ciencia", titulo: "Ciência", icone: "🔬", desc: "Pesquisa, descobertas e energia", imagens: true, nivel: "B2",
    palavras: [
      ["Pesquisa", "Research", "Investigación", "Recherche", "Ricerca", "Forschung", "🔬"],
      ["Experimento", "Experiment", "Experimento", "Expérience", "Esperimento", "Experiment", "🧪"],
      ["Descoberta", "Discovery", "Descubrimiento", "Découverte", "Scoperta", "Entdeckung", "💡"],
      ["Planeta", "Planet", "Planeta", "Planète", "Pianeta", "Planet", "🪐"],
      ["Energia", "Energy", "Energía", "Énergie", "Energia", "Energie", "⚡"],
      ["Cientista", "Scientist", "Científico", "Scientifique", "Scienziato", "Wissenschaftler", "🧑‍🔬"],
      ["Resultado", "Result", "Resultado", "Résultat", "Risultato", "Ergebnis", "📊"],
      ["Teoria", "Theory", "Teoría", "Théorie", "Teoria", "Theorie", "📐"],
    ],
    frases: [
      ["Os cientistas fizeram uma descoberta importante", "Scientists made an important discovery", "Los científicos hicieron un descubrimiento importante", "Les scientifiques ont fait une découverte importante", "Gli scienziati hanno fatto una scoperta importante", "Die Wissenschaftler haben eine wichtige Entdeckung gemacht"],
      ["Os resultados da pesquisa foram surpreendentes", "The results of the research were surprising", "Los resultados de la investigación fueron sorprendentes", "Les résultats de la recherche ont été surprenants", "I risultati della ricerca sono stati sorprendenti", "Die Ergebnisse der Forschung waren überraschend"],
      ["A energia solar é cada vez mais usada", "Solar energy is increasingly used", "La energía solar se usa cada vez más", "L'énergie solaire est de plus en plus utilisée", "L'energia solare è sempre più usata", "Solarenergie wird immer häufiger genutzt"],
      ["Essa teoria ainda não foi comprovada", "This theory has not been proven yet", "Esta teoría todavía no ha sido demostrada", "Cette théorie n'a pas encore été prouvée", "Questa teoria non è ancora stata dimostrata", "Diese Theorie ist noch nicht bewiesen worden"],
    ],
  },
  {
    id: "sociedade", titulo: "Sociedade", icone: "🗳️", desc: "Leis, direitos e notícias", imagens: false, nivel: "B2",
    palavras: [
      ["Governo", "Government", "Gobierno", "Gouvernement", "Governo", "Regierung", "🏛️"],
      ["Lei", "Law", "Ley", "Loi", "Legge", "Gesetz", "⚖️"],
      ["Direitos", "Rights", "Derechos", "Droits", "Diritti", "Rechte", "📜"],
      ["Eleição", "Election", "Elección", "Élection", "Elezione", "Wahl", "🗳️"],
      ["Cidadão", "Citizen", "Ciudadano", "Citoyen", "Cittadino", "Bürger", "🧑"],
      ["Desigualdade", "Inequality", "Desigualdad", "Inégalité", "Disuguaglianza", "Ungleichheit", "📉"],
      ["Notícias", "News", "Noticias", "Actualités", "Notizie", "Nachrichten", "📰"],
      ["Debate", "Debate", "Debate", "Débat", "Dibattito", "Debatte", "🎙️"],
    ],
    frases: [
      ["Todos os cidadãos têm os mesmos direitos", "All citizens have the same rights", "Todos los ciudadanos tienen los mismos derechos", "Tous les citoyens ont les mêmes droits", "Tutti i cittadini hanno gli stessi diritti", "Alle Bürger haben die gleichen Rechte"],
      ["O governo aprovou uma nova lei", "The government passed a new law", "El gobierno aprobó una nueva ley", "Le gouvernement a adopté une nouvelle loi", "Il governo ha approvato una nuova legge", "Die Regierung hat ein neues Gesetz verabschiedet"],
      ["A desigualdade continua sendo um grande problema", "Inequality remains a big problem", "La desigualdad sigue siendo un gran problema", "L'inégalité reste un grand problème", "La disuguaglianza resta un grande problema", "Ungleichheit bleibt ein großes Problem"],
      ["Eu leio as notícias todas as manhãs", "I read the news every morning", "Leo las noticias todas las mañanas", "Je lis les actualités tous les matins", "Leggo le notizie ogni mattina", "Ich lese jeden Morgen die Nachrichten"],
    ],
  },

  // ===== C1 =====
  {
    id: "academico", titulo: "Vocabulário avançado", icone: "🧩", desc: "Palavras de textos acadêmicos e profissionais", imagens: false, nivel: "C1",
    palavras: [
      ["No entanto", "However", "Sin embargo", "Cependant", "Tuttavia", "Jedoch", "🔄"],
      ["Alcançar", "Achieve", "Lograr", "Atteindre", "Raggiungere", "Erreichen", "🏆"],
      ["Desenvolver", "Develop", "Desarrollar", "Développer", "Sviluppare", "Entwickeln", "🌱"],
      ["Evidência", "Evidence", "Prueba", "Preuve", "Prova", "Beweis", "🔍"],
      ["Abordagem", "Approach", "Enfoque", "Approche", "Approccio", "Ansatz", "🧭"],
      ["Significativo", "Significant", "Significativo", "Significatif", "Significativo", "Bedeutend", "📌"],
      ["Além disso", "Furthermore", "Además", "De plus", "Inoltre", "Außerdem", "➕"],
      ["Desafio", "Challenge", "Desafío", "Défi", "Sfida", "Herausforderung", "🧗"],
    ],
    frases: [
      ["No entanto, os dados sugerem o contrário", "However, the data suggest otherwise", "Sin embargo, los datos sugieren lo contrario", "Cependant, les données suggèrent le contraire", "Tuttavia, i dati suggeriscono il contrario", "Die Daten deuten jedoch auf das Gegenteil hin"],
      ["Esse é um desafio significativo para a empresa", "This is a significant challenge for the company", "Este es un desafío significativo para la empresa", "C'est un défi important pour l'entreprise", "Questa è una sfida significativa per l'azienda", "Das ist eine bedeutende Herausforderung für das Unternehmen"],
      ["Precisamos de uma abordagem diferente", "We need a different approach", "Necesitamos un enfoque diferente", "Nous avons besoin d'une approche différente", "Abbiamo bisogno di un approccio diverso", "Wir brauchen einen anderen Ansatz"],
      ["Não há evidências suficientes para essa conclusão", "There is not enough evidence for that conclusion", "No hay pruebas suficientes para esa conclusión", "Il n'y a pas assez de preuves pour cette conclusion", "Non ci sono prove sufficienti per questa conclusione", "Es gibt nicht genug Beweise für diese Schlussfolgerung"],
    ],
  },
  {
    id: "expressoes", titulo: "Expressões idiomáticas", icone: "🗝️", desc: "Fale como um nativo", imagens: false, nivel: "C1",
    palavras: [
      ["Chover canivetes", "Rain cats and dogs", "Llover a cántaros", "Pleuvoir des cordes", "Piovere a catinelle", "In Strömen regnen", "🌧️"],
      ["Custar os olhos da cara", "Cost an arm and a leg", "Costar un ojo de la cara", "Coûter les yeux de la tête", "Costare un occhio della testa", "Ein Vermögen kosten", "💸"],
      ["Quebrar o gelo", "Break the ice", "Romper el hielo", "Briser la glace", "Rompere il ghiaccio", "Das Eis brechen", "🧊"],
      ["Matar dois coelhos com uma cajadada só", "Kill two birds with one stone", "Matar dos pájaros de un tiro", "Faire d'une pierre deux coups", "Prendere due piccioni con una fava", "Zwei Fliegen mit einer Klappe schlagen", "🎯"],
      ["Pisar na bola", "Drop the ball", "Meter la pata", "Faire une gaffe", "Fare una gaffe", "Mist bauen", "⚽"],
      ["Estar nas nuvens", "Have your head in the clouds", "Estar en las nubes", "Être dans la lune", "Avere la testa tra le nuvole", "Mit dem Kopf in den Wolken sein", "☁️"],
      ["Ficar de olho", "Keep an eye on", "Echar un ojo", "Garder un œil sur", "Tenere d'occhio", "Ein Auge auf etwas haben", "👀"],
      ["Ir direto ao ponto", "Get to the point", "Ir al grano", "Aller droit au but", "Andare dritto al punto", "Auf den Punkt kommen", "📍"],
    ],
    frases: [
      ["Vamos direto ao ponto", "Let's get to the point", "Vamos al grano", "Allons droit au but", "Andiamo dritti al punto", "Kommen wir auf den Punkt"],
      ["Esse carro custou os olhos da cara", "That car cost an arm and a leg", "Ese coche costó un ojo de la cara", "Cette voiture a coûté les yeux de la tête", "Quella macchina è costata un occhio della testa", "Das Auto hat ein Vermögen gekostet"],
      ["Ele contou uma piada para quebrar o gelo", "He told a joke to break the ice", "Contó un chiste para romper el hielo", "Il a raconté une blague pour briser la glace", "Ha raccontato una barzelletta per rompere il ghiaccio", "Er hat einen Witz erzählt, um das Eis zu brechen"],
      ["Ela está sempre nas nuvens", "She always has her head in the clouds", "Ella siempre está en las nubes", "Elle est toujours dans la lune", "Ha sempre la testa tra le nuvole", "Sie ist immer mit dem Kopf in den Wolken"],
    ],
  },
);

// ------------------------------------------------------------
//  Reforço do básico (A1): entram ao lado das unidades parecidas
// ------------------------------------------------------------
function inserirTema(posicao, referencia, tema) {
  const i = TEMAS.findIndex(t => t.id === referencia);
  TEMAS.splice(posicao === "antes" ? i : i + 1, 0, tema);
}
inserirTema("antes", "saudacoes", {
  id: "essenciais", titulo: "Palavras essenciais", icone: "⭐", desc: "Sim, não, eu, você... o começo de tudo", imagens: false, nivel: "A1",
  palavras: [
    ["Sim", "Yes", "Sí", "Oui", "Sì", "Ja", "✅"],
    ["Não", "No", "No", "Non", "No", "Nein", "❌"],
    ["Eu", "I", "Yo", "Je", "Io", "Ich", "🙋"],
    ["Você", "You", "Tú", "Tu", "Tu", "Du", "👉"],
    ["Ele", "He", "Él", "Il", "Lui", "Er", "👦"],
    ["Ela", "She", "Ella", "Elle", "Lei", "Sie", "👧"],
    ["Nós", "We", "Nosotros", "Nous", "Noi", "Wir", "👫"],
    ["Muito", "Very", "Muy", "Très", "Molto", "Sehr", "💯"],
  ],
  frases: [
    ["Sim, eu entendo", "Yes, I understand", "Sí, entiendo", "Oui, je comprends", "Sì, capisco", "Ja, ich verstehe"],
    ["Não, obrigado", "No, thank you", "No, gracias", "Non, merci", "No, grazie", "Nein, danke"],
    ["Ela é muito simpática", "She is very nice", "Ella es muy simpática", "Elle est très sympathique", "Lei è molto simpatica", "Sie ist sehr nett"],
    ["Nós falamos devagar", "We speak slowly", "Hablamos despacio", "Nous parlons lentement", "Parliamo lentamente", "Wir sprechen langsam"],
  ],
});
inserirTema("depois", "saudacoes", {
  id: "apresentacao", titulo: "Apresentações", icone: "🤝", desc: "Diga seu nome, idade e de onde você é", imagens: false, nivel: "A1",
  palavras: [
    ["Nome", "Name", "Nombre", "Nom", "Nome", "Name", "🏷️"],
    ["Idade", "Age", "Edad", "Âge", "Età", "Alter", "🎂"],
    ["País", "Country", "País", "Pays", "Paese", "Land", "🗺️"],
    ["Morar", "Live", "Vivir", "Habiter", "Abitare", "Wohnen", "🏡"],
    ["Prazer", "Nice to meet you", "Encantado", "Enchanté", "Piacere", "Freut mich", "🤝"],
    ["Amigo", "Friend", "Amigo", "Ami", "Amico", "Freund", "🧑‍🤝‍🧑"],
    ["Brasileiro", "Brazilian", "Brasileño", "Brésilien", "Brasiliano", "Brasilianer", "💚"],
    ["Profissão", "Job", "Profesión", "Métier", "Professione", "Beruf", "👷"],
  ],
  frases: [
    ["Eu sou do Brasil", "I am from Brazil", "Soy de Brasil", "Je viens du Brésil", "Vengo dal Brasile", "Ich komme aus Brasilien"],
    ["Qual é o seu nome?", "What is your name?", "¿Cómo te llamas?", "Comment tu t'appelles ?", "Come ti chiami?", "Wie heißt du?"],
    ["Eu moro em São Paulo", "I live in São Paulo", "Vivo en São Paulo", "J'habite à São Paulo", "Abito a San Paolo", "Ich wohne in São Paulo"],
    ["Prazer em conhecer você", "Nice to meet you", "Encantado de conocerte", "Ravi de te rencontrer", "Piacere di conoscerti", "Freut mich, dich kennenzulernen"],
  ],
});
inserirTema("depois", "numeros", {
  id: "numeros2", titulo: "Números até mil", icone: "💯", desc: "Do onze ao mil", imagens: false, nivel: "A1",
  palavras: [
    ["Onze", "Eleven", "Once", "Onze", "Undici", "Elf", "1️⃣1️⃣"],
    ["Doze", "Twelve", "Doce", "Douze", "Dodici", "Zwölf", "1️⃣2️⃣"],
    ["Quinze", "Fifteen", "Quince", "Quinze", "Quindici", "Fünfzehn", "1️⃣5️⃣"],
    ["Vinte", "Twenty", "Veinte", "Vingt", "Venti", "Zwanzig", "2️⃣0️⃣"],
    ["Trinta", "Thirty", "Treinta", "Trente", "Trenta", "Dreißig", "3️⃣0️⃣"],
    ["Cinquenta", "Fifty", "Cincuenta", "Cinquante", "Cinquanta", "Fünfzig", "5️⃣0️⃣"],
    ["Cem", "One hundred", "Cien", "Cent", "Cento", "Hundert", "💯"],
    ["Mil", "One thousand", "Mil", "Mille", "Mille", "Tausend", "🔢"],
  ],
  frases: [
    ["Eu tenho vinte anos", "I am twenty years old", "Tengo veinte años", "J'ai vingt ans", "Ho vent'anni", "Ich bin zwanzig Jahre alt"],
    ["O livro custa quinze euros", "The book costs fifteen euros", "El libro cuesta quince euros", "Le livre coûte quinze euros", "Il libro costa quindici euro", "Das Buch kostet fünfzehn Euro"],
    ["Há trinta alunos na sala", "There are thirty students in the class", "Hay treinta alumnos en la clase", "Il y a trente élèves dans la classe", "Ci sono trenta studenti in classe", "Es gibt dreißig Schüler in der Klasse"],
    ["Eu vou dormir às onze", "I go to bed at eleven", "Me acuesto a las once", "Je me couche à onze heures", "Vado a letto alle undici", "Ich gehe um elf ins Bett"],
  ],
});

// Níveis do Quadro Europeu Comum de Referência (CEFR)
const NIVEIS = [
  { id: "A1", nome: "Iniciante", desc: "Entende e usa expressões do dia a dia e frases bem simples." },
  { id: "A2", nome: "Básico", desc: "Se comunica em situações de rotina: compras, trabalho, família e cidade." },
  { id: "B1", nome: "Intermediário", desc: "Resolve a maioria das situações de viagem e dá opiniões simples." },
  { id: "B2", nome: "Intermediário superior", desc: "Conversa com fluência razoável e entende textos mais complexos." },
  { id: "C1", nome: "Avançado", desc: "Usa o idioma com flexibilidade no trabalho e nos estudos." },
  { id: "C2", nome: "Proficiente", desc: "Compreende praticamente tudo e se expressa com precisão." },
];
const ORDEM_NIVEIS = NIVEIS.map(n => n.id);
// As unidades originais são A1; a trilha fica ordenada do nível mais fácil ao mais difícil
TEMAS.forEach((t, i) => { t.nivel = t.nivel || "A1"; t._ordem = i; });
TEMAS.sort((a, b) => ORDEM_NIVEIS.indexOf(a.nivel) - ORDEM_NIVEIS.indexOf(b.nivel) || a._ordem - b._ordem);

const AVATARES = [
  { e: "🦊", preco: 0 }, { e: "🐼", preco: 30 }, { e: "🐸", preco: 30 }, { e: "🐨", preco: 40 },
  { e: "🦁", preco: 60 }, { e: "🐙", preco: 60 }, { e: "🦄", preco: 100 }, { e: "🐲", preco: 150 },
  { e: "🤖", preco: 150 }, { e: "👽", preco: 200 }, { e: "🦖", preco: 250 }, { e: "👑", preco: 400 },
];
