// Idiomas disponíveis. "cores" pinta o cartão de escolha; o resto do site usa body[data-idioma] no CSS.
const IDIOMAS = {
  en: { nome: "Inglês",   bandeira: "🇺🇸", voz: "en-US", col: 1, frase: "Let's go!",   cores: ["#2563eb", "#e11d48"] },
  es: { nome: "Espanhol", bandeira: "🇪🇸", voz: "es-ES", col: 2, frase: "¡Vamos!",     cores: ["#dc2626", "#f59e0b"] },
  fr: { nome: "Francês",  bandeira: "🇫🇷", voz: "fr-FR", col: 3, frase: "Allons-y !",  cores: ["#4f46e5", "#f43f5e"] },
  it: { nome: "Italiano", bandeira: "🇮🇹", voz: "it-IT", col: 4, frase: "Andiamo!",    cores: ["#16a34a", "#ef4444"] },
  de: { nome: "Alemão",   bandeira: "🇩🇪", voz: "de-DE", col: 5, frase: "Los geht's!", cores: ["#ca8a04", "#dc2626"] },
};

// Cada palavra: [português, inglês, espanhol, francês, italiano, alemão]
const TEMAS = [
  {
    id: "saudacoes", titulo: "Saudações", icone: "👋",
    palavras: [
      ["Olá", "Hello", "Hola", "Bonjour", "Ciao", "Hallo"],
      ["Tchau", "Goodbye", "Adiós", "Au revoir", "Arrivederci", "Tschüss"],
      ["Obrigado", "Thank you", "Gracias", "Merci", "Grazie", "Danke"],
      ["Por favor", "Please", "Por favor", "S'il vous plaît", "Per favore", "Bitte"],
      ["Bom dia", "Good morning", "Buenos días", "Bonjour", "Buongiorno", "Guten Morgen"],
      ["Boa noite", "Good night", "Buenas noches", "Bonne nuit", "Buonanotte", "Gute Nacht"],
      ["Desculpe", "Sorry", "Lo siento", "Désolé", "Scusa", "Entschuldigung"],
      ["Como vai?", "How are you?", "¿Cómo estás?", "Comment ça va ?", "Come stai?", "Wie geht's?"],
    ],
  },
  {
    id: "numeros", titulo: "Números", icone: "🔢",
    palavras: [
      ["Um", "One", "Uno", "Un", "Uno", "Eins"],
      ["Dois", "Two", "Dos", "Deux", "Due", "Zwei"],
      ["Três", "Three", "Tres", "Trois", "Tre", "Drei"],
      ["Quatro", "Four", "Cuatro", "Quatre", "Quattro", "Vier"],
      ["Cinco", "Five", "Cinco", "Cinq", "Cinque", "Fünf"],
      ["Seis", "Six", "Seis", "Six", "Sei", "Sechs"],
      ["Sete", "Seven", "Siete", "Sept", "Sette", "Sieben"],
      ["Dez", "Ten", "Diez", "Dix", "Dieci", "Zehn"],
    ],
  },
  {
    id: "cores", titulo: "Cores", icone: "🎨",
    palavras: [
      ["Vermelho", "Red", "Rojo", "Rouge", "Rosso", "Rot"],
      ["Azul", "Blue", "Azul", "Bleu", "Blu", "Blau"],
      ["Verde", "Green", "Verde", "Vert", "Verde", "Grün"],
      ["Amarelo", "Yellow", "Amarillo", "Jaune", "Giallo", "Gelb"],
      ["Preto", "Black", "Negro", "Noir", "Nero", "Schwarz"],
      ["Branco", "White", "Blanco", "Blanc", "Bianco", "Weiß"],
      ["Rosa", "Pink", "Rosa", "Rose", "Rosa", "Rosa"],
      ["Laranja", "Orange", "Naranja", "Orange", "Arancione", "Orange"],
    ],
  },
  {
    id: "comida", titulo: "Comida", icone: "🍎",
    palavras: [
      ["Água", "Water", "Agua", "Eau", "Acqua", "Wasser"],
      ["Pão", "Bread", "Pan", "Pain", "Pane", "Brot"],
      ["Maçã", "Apple", "Manzana", "Pomme", "Mela", "Apfel"],
      ["Queijo", "Cheese", "Queso", "Fromage", "Formaggio", "Käse"],
      ["Café", "Coffee", "Café", "Café", "Caffè", "Kaffee"],
      ["Leite", "Milk", "Leche", "Lait", "Latte", "Milch"],
      ["Arroz", "Rice", "Arroz", "Riz", "Riso", "Reis"],
      ["Carne", "Meat", "Carne", "Viande", "Carne", "Fleisch"],
    ],
  },
  {
    id: "familia", titulo: "Família", icone: "👨‍👩‍👧",
    palavras: [
      ["Mãe", "Mother", "Madre", "Mère", "Madre", "Mutter"],
      ["Pai", "Father", "Padre", "Père", "Padre", "Vater"],
      ["Irmão", "Brother", "Hermano", "Frère", "Fratello", "Bruder"],
      ["Irmã", "Sister", "Hermana", "Sœur", "Sorella", "Schwester"],
      ["Filho", "Son", "Hijo", "Fils", "Figlio", "Sohn"],
      ["Filha", "Daughter", "Hija", "Fille", "Figlia", "Tochter"],
      ["Avó", "Grandmother", "Abuela", "Grand-mère", "Nonna", "Großmutter"],
      ["Avô", "Grandfather", "Abuelo", "Grand-père", "Nonno", "Großvater"],
    ],
  },
  {
    id: "viagem", titulo: "Viagem", icone: "✈️",
    palavras: [
      ["Aeroporto", "Airport", "Aeropuerto", "Aéroport", "Aeroporto", "Flughafen"],
      ["Hotel", "Hotel", "Hotel", "Hôtel", "Albergo", "Hotel"],
      ["Passaporte", "Passport", "Pasaporte", "Passeport", "Passaporto", "Reisepass"],
      ["Bilhete", "Ticket", "Billete", "Billet", "Biglietto", "Fahrkarte"],
      ["Mala", "Suitcase", "Maleta", "Valise", "Valigia", "Koffer"],
      ["Praia", "Beach", "Playa", "Plage", "Spiaggia", "Strand"],
      ["Onde fica?", "Where is it?", "¿Dónde está?", "Où est-ce ?", "Dov'è?", "Wo ist es?"],
      ["Quanto custa?", "How much is it?", "¿Cuánto cuesta?", "Combien ça coûte ?", "Quanto costa?", "Wie viel kostet das?"],
    ],
  },
];
