// ============================================================
//  Aprofundamento das unidades A2 (formato explicado em conteudo/a1.js)
// ============================================================
COMPLEMENTOS.dias = {
  palavras: [
    ["Sábado", "Saturday", "Sábado", "Samedi", "Sabato", "Samstag", "🎉"],
    ["Mês", "Month", "Mes", "Mois", "Mese", "Monat", "🗓️"],
    ["Ano", "Year", "Año", "Année", "Anno", "Jahr", "📆"],
    ["Fim de semana", "Weekend", "Fin de semana", "Week-end", "Fine settimana", "Wochenende", "😎"],
  ],
  frases: [
    ["Que dia é hoje?", "What day is it today?", "¿Qué día es hoy?", "On est quel jour aujourd'hui ?", "Che giorno è oggi?", "Welcher Tag ist heute?"],
    ["Tenho uma reunião na segunda de manhã", "I have a meeting on Monday morning", "Tengo una reunión el lunes por la mañana", "J'ai une réunion lundi matin", "Ho una riunione lunedì mattina", "Ich habe am Montagmorgen ein Meeting"],
    ["Nos vemos às oito e meia", "See you at half past eight", "Nos vemos a las ocho y media", "On se voit à huit heures et demie", "Ci vediamo alle otto e mezza", "Wir sehen uns um halb neun"],
    ["O que você vai fazer no fim de semana?", "What are you doing this weekend?", "¿Qué vas a hacer el fin de semana?", "Qu'est-ce que tu fais ce week-end ?", "Cosa fai nel fine settimana?", "Was machst du am Wochenende?"],
  ],
  dialogo: [
    ["A", "O que você vai fazer no fim de semana?", "What are you doing this weekend?", "¿Qué vas a hacer el fin de semana?", "Qu'est-ce que tu fais ce week-end ?", "Cosa fai nel fine settimana?", "Was machst du am Wochenende?"],
    ["B", "No sábado eu trabalho. E você?", "I'm working on Saturday. What about you?", "El sábado trabajo. ¿Y tú?", "Samedi, je travaille. Et toi ?", "Sabato lavoro. E tu?", "Am Samstag arbeite ich. Und du?"],
    ["A", "Vou ao cinema no domingo. Quer ir?", "I'm going to the movies on Sunday. Want to come?", "Voy al cine el domingo. ¿Quieres venir?", "Je vais au cinéma dimanche. Tu veux venir ?", "Domenica vado al cinema. Vuoi venire?", "Am Sonntag gehe ich ins Kino. Willst du mitkommen?"],
    ["B", "Claro! A que horas?", "Sure! What time?", "¡Claro! ¿A qué hora?", "Bien sûr ! À quelle heure ?", "Certo! A che ora?", "Klar! Um wie viel Uhr?"],
  ],
  notas: {
    en: ["On, in, at: as preposições do tempo", "<b>at</b> para horas (<b>at 8:30</b>), <b>on</b> para dias e datas (<b>on Monday</b>, <b>on May 5th</b>) e <b>in</b> para meses, anos e partes do dia (<b>in July</b>, <b>in 2026</b>, <b>in the morning</b>). Exceção: <b>at night</b>. Dias e meses sempre com maiúscula: <b>Monday</b>, <b>July</b>.",
      [["See you on Monday at nine.", "Até segunda, às nove."], ["My birthday is in July.", "Meu aniversário é em julho."]]],
    es: ["El lunes, sem preposição", "Para “na segunda”, o espanhol usa só o artigo: <b>el lunes</b>; para “às segundas”, <b>los lunes</b>. Dias e meses vão com minúscula. Horas: <b>a las ocho y media</b>; e “de manhã” é <b>por la mañana</b>.",
      [["Los lunes voy al gimnasio.", "Às segundas vou à academia."], ["A las ocho y media.", "Às oito e meia."]]],
    fr: ["Lundi, sem nada antes", "Para “na segunda”, diga só <b>lundi</b>; com artigo, <b>le lundi</b> é “toda segunda”. Dias e meses com minúscula. Hora sempre com <b>heures</b>: <b>à huit heures et demie</b>.",
      [["Lundi, je travaille.", "Na segunda, eu trabalho."], ["Le samedi, je dors tard.", "Aos sábados, durmo até tarde."]]],
    it: ["Lunedì e il lunedì", "<b>Lunedì</b> sem artigo é “nesta segunda”; <b>il lunedì</b> é “toda segunda”. De lunedì a venerdì, os dias terminam em -dì, com acento. Horas: <b>alle otto e mezza</b>.",
      [["Lunedì ho una riunione.", "Na segunda tenho uma reunião."], ["Il sabato dormo fino a tardi.", "Aos sábados durmo até tarde."]]],
    de: ["Halb neun é 8h30!", "Em alemão, <b>halb</b> olha para a hora seguinte: <b>halb neun</b> = 8h30 (meia hora para as nove). Dias usam <b>am</b> (<b>am Montag</b>), meses usam <b>im</b> (<b>im Juli</b>) e horas usam <b>um</b> (<b>um acht Uhr</b>).",
      [["Wir sehen uns um halb neun.", "Nos vemos às oito e meia."], ["Am Montag arbeite ich.", "Na segunda eu trabalho."]]],
  },
};

COMPLEMENTOS.cidade = {
  palavras: [
    ["Esquina", "Corner", "Esquina", "Coin", "Angolo", "Ecke", "📐"],
    ["Ponte", "Bridge", "Puente", "Pont", "Ponte", "Brücke", "🌉"],
    ["Semáforo", "Traffic light", "Semáforo", "Feu", "Semaforo", "Ampel", "🚦"],
    ["Metrô", "Subway", "Metro", "Métro", "Metropolitana", "U-Bahn", "🚇"],
  ],
  frases: [
    ["Siga em frente", "Go straight ahead", "Siga todo recto", "Allez tout droit", "Vada sempre dritto", "Gehen Sie geradeaus"],
    ["Fica na esquina", "It's on the corner", "Está en la esquina", "C'est au coin de la rue", "È all'angolo", "Es ist an der Ecke"],
    ["Vire à esquerda no semáforo", "Turn left at the traffic light", "Gire a la izquierda en el semáforo", "Tournez à gauche au feu", "Giri a sinistra al semaforo", "Biegen Sie an der Ampel links ab"],
    ["É longe daqui?", "Is it far from here?", "¿Está lejos de aquí?", "C'est loin d'ici ?", "È lontano da qui?", "Ist es weit von hier?"],
  ],
  dialogo: [
    ["A", "Com licença, onde fica a estação de metrô?", "Excuse me, where's the subway station?", "Perdone, ¿dónde está la estación de metro?", "Excusez-moi, où est la station de métro ?", "Scusi, dov'è la stazione della metropolitana?", "Entschuldigung, wo ist die U-Bahn-Station?"],
    ["B", "Siga em frente e vire à esquerda no semáforo.", "Go straight and turn left at the traffic light.", "Siga recto y gire a la izquierda en el semáforo.", "Allez tout droit et tournez à gauche au feu.", "Vada dritto e giri a sinistra al semaforo.", "Gehen Sie geradeaus und biegen Sie an der Ampel links ab."],
    ["A", "É longe daqui?", "Is it far from here?", "¿Está lejos de aquí?", "C'est loin d'ici ?", "È lontano da qui?", "Ist es weit von hier?"],
    ["B", "Não, uns cinco minutos a pé.", "No, about five minutes on foot.", "No, unos cinco minutos andando.", "Non, à environ cinq minutes à pied.", "No, circa cinque minuti a piedi.", "Nein, etwa fünf Minuten zu Fuß."],
  ],
  notas: {
    en: ["Pedir e dar direções", "Comece com <b>Excuse me</b>. Para perguntar: <b>How do I get to...?</b> ou <b>Where's...?</b>. As direções usam o imperativo, sem “you”: <b>Go straight</b>, <b>Turn left</b>, <b>Take the second right</b>. Metrô é <b>subway</b> nos EUA e <b>the Tube</b> em Londres.",
      [["How do I get to the station?", "Como chego à estação?"], ["Take the second left.", "Pegue a segunda à esquerda."]]],
    es: ["O imperativo com usted", "Ao dar direções a desconhecidos, usa-se o imperativo formal: <b>siga</b>, <b>gire</b>, <b>tome</b>. Com amigos: <b>sigue</b>, <b>gira</b>, <b>toma</b>. Para pedir: <b>¿Cómo llego a...?</b>. Na Espanha, <b>coger</b> o ônibus é normal; em boa parte da América Latina, diga <b>tomar</b>.",
      [["¿Cómo llego a la estación?", "Como chego à estação?"], ["Siga todo recto.", "Siga em frente."]]],
    fr: ["Tout droit não é “direita”!", "Armadilha clássica: <b>tout droit</b> é “em frente”; direita é <b>à droite</b> e esquerda é <b>à gauche</b>. Para pedir o caminho: <b>Pour aller à la gare, s'il vous plaît ?</b>",
      [["Allez tout droit, puis à droite.", "Siga em frente, depois à direita."], ["C'est loin d'ici ?", "É longe daqui?"]]],
    it: ["Scusi, o pedido formal", "Para parar alguém na rua: <b>Scusi</b>. Para pedir o caminho: <b>Come arrivo a...?</b>. Direções no formal: <b>vada</b>, <b>giri</b>, <b>prenda</b>. E <b>sempre dritto</b> é “sempre em frente”.",
      [["Scusi, come arrivo alla stazione?", "Com licença, como chego à estação?"], ["Giri a destra.", "Vire à direita."]]],
    de: ["Links, rechts, geradeaus", "Esquerda é <b>links</b>, direita é <b>rechts</b> e em frente é <b>geradeaus</b>. Virar é <b>abbiegen</b>, verbo que se separa: <b>Biegen Sie links ab</b>. Para pedir: <b>Wie komme ich zum Bahnhof?</b>",
      [["Wie komme ich zum Bahnhof?", "Como chego à estação?"], ["Biegen Sie rechts ab.", "Vire à direita."]]],
  },
};

COMPLEMENTOS.compras = {
  palavras: [
    ["Desconto", "Discount", "Descuento", "Réduction", "Sconto", "Rabatt", "🏷️"],
    ["Troco", "Change", "Cambio", "Monnaie", "Resto", "Wechselgeld", "🪙"],
    ["Recibo", "Receipt", "Recibo", "Reçu", "Scontrino", "Quittung", "🧾"],
    ["Cartão", "Card", "Tarjeta", "Carte", "Carta", "Karte", "💳"],
  ],
  frases: [
    ["Só estou olhando, obrigado", "I'm just looking, thanks", "Solo estoy mirando, gracias", "Je regarde seulement, merci", "Sto solo guardando, grazie", "Ich schaue nur, danke"],
    ["Vou levar este", "I'll take this one", "Me llevo este", "Je prends celui-ci", "Prendo questo", "Ich nehme das hier"],
    ["Tem desconto se eu pagar em dinheiro?", "Is there a discount if I pay in cash?", "¿Hay descuento si pago en efectivo?", "Il y a une réduction si je paie en espèces ?", "C'è uno sconto se pago in contanti?", "Gibt es Rabatt bei Barzahlung?"],
    ["Posso trocar se não servir?", "Can I exchange it if it doesn't fit?", "¿Lo puedo cambiar si no me queda bien?", "Je peux l'échanger si ça ne me va pas ?", "Posso cambiarlo se non mi va bene?", "Kann ich es umtauschen, wenn es nicht passt?"],
  ],
  dialogo: [
    ["A", "Posso ajudar?", "Can I help you?", "¿Le puedo ayudar?", "Je peux vous aider ?", "Posso aiutarla?", "Kann ich Ihnen helfen?"],
    ["B", "Só estou olhando, obrigado.", "I'm just looking, thanks.", "Solo estoy mirando, gracias.", "Je regarde seulement, merci.", "Sto solo guardando, grazie.", "Ich schaue nur, danke."],
    ["A", "Hoje tem vinte por cento de desconto.", "There's twenty percent off today.", "Hoy hay un veinte por ciento de descuento.", "Aujourd'hui, il y a vingt pour cent de réduction.", "Oggi c'è il venti per cento di sconto.", "Heute gibt es zwanzig Prozent Rabatt."],
    ["B", "Ótimo! Vou levar este.", "Great! I'll take this one.", "¡Genial! Me llevo este.", "Super ! Je prends celui-ci.", "Ottimo! Prendo questo.", "Super! Ich nehme das hier."],
  ],
  notas: {
    en: ["I'll take it: a decisão na hora", "<b>How much is it?</b> serve para qualquer preço. Para uma decisão tomada na hora, o inglês usa <b>will</b>: <b>I'll take it</b> (vou levar). Com cartão é <b>pay by card</b>; em dinheiro, <b>pay in cash</b>. E <b>money</b> é incontável: <b>a lot of money</b>, nunca “moneys”.",
      [["I'll take this one.", "Vou levar este."], ["Can I pay in cash?", "Posso pagar em dinheiro?"]]],
    es: ["Me lo llevo", "Para decidir a compra: <b>Me lo llevo</b> (vou levar). Em dinheiro é <b>en efectivo</b>; com cartão, <b>con tarjeta</b>. Cuidado: <b>cambio</b> é troco e também troca. E <b>¿Cuánto es?</b> é o “quanto deu?”.",
      [["Me lo llevo.", "Vou levar."], ["¿Puedo pagar con tarjeta?", "Posso pagar com cartão?"]]],
    fr: ["Celui-ci, celle-ci", "Para apontar: <b>celui-ci</b> (este) e <b>celle-ci</b> (esta). Em dinheiro é <b>en espèces</b>; troco é <b>la monnaie</b>. Para decidir: <b>Je le prends</b> (vou levar).",
      [["Je prends celle-ci.", "Vou levar esta."], ["Vous avez de la monnaie ?", "Você tem troco?"]]],
    it: ["Lo scontrino", "Na Itália, a loja deve entregar o <b>scontrino</b> (cupom fiscal): guarde-o. Dinheiro vivo é <b>in contanti</b>; cartão é <b>carta</b> ou <b>bancomat</b>. Para decidir: <b>Lo prendo</b>.",
      [["Lo prendo.", "Vou levar."], ["Posso pagare con la carta?", "Posso pagar com cartão?"]]],
    de: ["Bar oder mit Karte?", "Na Alemanha ainda se usa muito dinheiro vivo; a pergunta clássica do caixa é <b>Bar oder mit Karte?</b> (dinheiro ou cartão?). Trocar uma compra é <b>umtauschen</b>. Para decidir: <b>Ich nehme es</b>.",
      [["Bar oder mit Karte?", "Dinheiro ou cartão?"], ["Ich nehme das hier.", "Vou levar este."]]],
  },
};

COMPLEMENTOS.trabalho = {
  palavras: [
    ["Entrevista", "Interview", "Entrevista", "Entretien", "Colloquio", "Vorstellungsgespräch", "🎤"],
    ["Férias", "Vacation", "Vacaciones", "Vacances", "Ferie", "Urlaub", "🌴"],
    ["Currículo", "Résumé", "Currículum", "CV", "Curriculum", "Lebenslauf", "📄"],
    ["Equipe", "Team", "Equipo", "Équipe", "Squadra", "Team", "👥"],
  ],
  frases: [
    ["Eu trabalho como designer", "I work as a designer", "Trabajo como diseñador", "Je travaille comme designer", "Lavoro come designer", "Ich arbeite als Designer"],
    ["Estou de férias", "I'm on vacation", "Estoy de vacaciones", "Je suis en vacances", "Sono in ferie", "Ich bin im Urlaub"],
    ["Tenho uma entrevista de emprego amanhã", "I have a job interview tomorrow", "Tengo una entrevista de trabajo mañana", "J'ai un entretien d'embauche demain", "Ho un colloquio di lavoro domani", "Ich habe morgen ein Vorstellungsgespräch"],
    ["Eu trabalho de casa às sextas", "I work from home on Fridays", "Los viernes trabajo desde casa", "Le vendredi, je travaille de chez moi", "Il venerdì lavoro da casa", "Freitags arbeite ich von zu Hause"],
  ],
  dialogo: [
    ["A", "Fale um pouco sobre você.", "Tell me a little about yourself.", "Háblame un poco de ti.", "Parlez-moi un peu de vous.", "Mi parli un po' di lei.", "Erzählen Sie mir etwas über sich."],
    ["B", "Trabalho como designer há cinco anos.", "I've been working as a designer for five years.", "Trabajo como diseñador desde hace cinco años.", "Je travaille comme designer depuis cinq ans.", "Lavoro come designer da cinque anni.", "Ich arbeite seit fünf Jahren als Designer."],
    ["A", "Por que você quer trabalhar aqui?", "Why do you want to work here?", "¿Por qué quieres trabajar aquí?", "Pourquoi voulez-vous travailler ici ?", "Perché vuole lavorare qui?", "Warum möchten Sie hier arbeiten?"],
    ["B", "Gosto de trabalhar em equipe e de novos desafios.", "I like working in a team and taking on new challenges.", "Me gusta trabajar en equipo y los nuevos retos.", "J'aime travailler en équipe et relever de nouveaux défis.", "Mi piace lavorare in squadra e affrontare nuove sfide.", "Ich arbeite gern im Team und mag neue Herausforderungen."],
  ],
  notas: {
    en: ["“Há cinco anos” que continua = for five years", "Para algo que começou no passado e continua, o inglês usa o present perfect com <b>for</b> (duração) ou <b>since</b> (ponto de partida): <b>I've worked here for five years</b>, <b>since 2021</b>. Dizer “I work here for five years” é erro típico de brasileiro. Profissão com <b>as</b>: <b>I work as a designer</b>.",
      [["I've worked here for five years.", "Trabalho aqui há cinco anos."], ["I work as a designer.", "Trabalho como designer."]]],
    es: ["Desde hace e llevar", "Para duração até agora, o espanhol usa o presente: <b>Trabajo aquí desde hace cinco años</b> ou <b>Llevo cinco años trabajando aquí</b>. Férias é sempre plural: <b>las vacaciones</b>.",
      [["Llevo cinco años aquí.", "Estou aqui há cinco anos."], ["Estoy de vacaciones.", "Estou de férias."]]],
    fr: ["Depuis: o presente que continua", "Para algo que começou e continua, use o presente com <b>depuis</b>: <b>Je travaille ici depuis cinq ans</b>. Entrevista de emprego é <b>entretien d'embauche</b>; <b>interview</b> é a entrevista de jornalista.",
      [["Je travaille ici depuis cinq ans.", "Trabalho aqui há cinco anos."], ["Je suis en vacances.", "Estou de férias."]]],
    it: ["Da cinque anni", "Para duração até agora, o italiano usa o presente com <b>da</b>: <b>Lavoro qui da cinque anni</b>. Entrevista de emprego é <b>colloquio di lavoro</b>, e <b>ferie</b> são as férias do trabalho.",
      [["Lavoro qui da cinque anni.", "Trabalho aqui há cinco anos."], ["Sono in ferie.", "Estou de férias."]]],
    de: ["Seit + presente", "Para algo que começou e continua, o alemão usa o presente com <b>seit</b>: <b>Ich arbeite seit fünf Jahren hier</b>. Profissão com <b>als</b>: <b>als Designer</b>. Férias do trabalho são <b>Urlaub</b>; as da escola, <b>Ferien</b>.",
      [["Ich arbeite seit fünf Jahren hier.", "Trabalho aqui há cinco anos."], ["Ich bin im Urlaub.", "Estou de férias."]]],
  },
};

COMPLEMENTOS.saude = {
  palavras: [
    ["Gripe", "Flu", "Gripe", "Grippe", "Influenza", "Grippe", "🤧"],
    ["Tosse", "Cough", "Tos", "Toux", "Tosse", "Husten", "😷"],
    ["Consulta", "Appointment", "Cita", "Rendez-vous", "Appuntamento", "Termin", "📅"],
    ["Alergia", "Allergy", "Alergia", "Allergie", "Allergia", "Allergie", "🌼"],
  ],
  frases: [
    ["Eu sou alérgico a penicilina", "I'm allergic to penicillin", "Soy alérgico a la penicilina", "Je suis allergique à la pénicilline", "Sono allergico alla penicillina", "Ich bin allergisch gegen Penicillin"],
    ["Eu gostaria de marcar uma consulta", "I'd like to make an appointment", "Quería pedir cita", "Je voudrais prendre rendez-vous", "Vorrei prendere un appuntamento", "Ich möchte einen Termin vereinbaren"],
    ["Não estou me sentindo bem", "I don't feel well", "No me encuentro bien", "Je ne me sens pas bien", "Non mi sento bene", "Mir geht es nicht gut"],
    ["Tome este remédio duas vezes por dia", "Take this medicine twice a day", "Tómese este medicamento dos veces al día", "Prenez ce médicament deux fois par jour", "Prenda questa medicina due volte al giorno", "Nehmen Sie dieses Medikament zweimal am Tag"],
  ],
  dialogo: [
    ["A", "O que você está sentindo?", "What seems to be the problem?", "¿Qué le pasa?", "Qu'est-ce qui ne va pas ?", "Che cosa si sente?", "Was fehlt Ihnen?"],
    ["B", "Estou com tosse e um pouco de febre.", "I have a cough and a slight fever.", "Tengo tos y un poco de fiebre.", "J'ai de la toux et un peu de fièvre.", "Ho la tosse e un po' di febbre.", "Ich habe Husten und ein bisschen Fieber."],
    ["A", "Você tem alguma alergia?", "Do you have any allergies?", "¿Tiene alguna alergia?", "Vous avez des allergies ?", "Ha qualche allergia?", "Haben Sie Allergien?"],
    ["B", "Sim, sou alérgico a penicilina.", "Yes, I'm allergic to penicillin.", "Sí, soy alérgico a la penicilina.", "Oui, je suis allergique à la pénicilline.", "Sì, sono allergico alla penicillina.", "Ja, ich bin allergisch gegen Penicillin."],
  ],
  notas: {
    en: ["I have a headache: sintomas com have", "Sintomas usam <b>have</b> + artigo: <b>I have a headache</b>, <b>a cough</b>, <b>a fever</b>. Sentir-se é <b>feel</b>: <b>I don't feel well</b>. Alergia é <b>allergic to</b>. E a consulta marcada é <b>appointment</b>, nunca “consultation”.",
      [["I have a sore throat.", "Estou com dor de garganta."], ["I'd like to make an appointment.", "Gostaria de marcar uma consulta."]]],
    es: ["Tengo tos e no me encuentro bien", "Sintomas com <b>tener</b>: <b>tengo tos</b>, <b>tengo fiebre</b>. Para mal-estar: <b>No me encuentro bien</b>. A consulta marcada é <b>cita</b>, e o médico vai te tratar por <b>usted</b>: <b>¿Qué le pasa?</b>",
      [["Tengo dolor de garganta.", "Estou com dor de garganta."], ["Quería pedir cita.", "Queria marcar uma consulta."]]],
    fr: ["Prendre rendez-vous", "Consulta é <b>rendez-vous</b>: <b>prendre rendez-vous chez le médecin</b>. Mal-estar: <b>Je ne me sens pas bien</b>. Repare no artigo dos sintomas: <b>de la toux</b>, <b>de la fièvre</b>.",
      [["J'ai mal à la gorge.", "Estou com dor de garganta."], ["Je voudrais prendre rendez-vous.", "Queria marcar uma consulta."]]],
    it: ["Ho la febbre", "Os sintomas levam artigo: <b>ho la febbre</b>, <b>ho la tosse</b>, <b>ho il raffreddore</b> (resfriado). Mal-estar: <b>Non mi sento bene</b>. Remédio é <b>medicina</b> ou <b>farmaco</b>.",
      [["Ho mal di gola.", "Estou com dor de garganta."], ["Non mi sento bene.", "Não estou me sentindo bem."]]],
    de: ["Mir geht es nicht gut", "Mal-estar usa o dativo: <b>Mir geht es nicht gut</b>. Sintomas sem artigo: <b>Ich habe Husten, Fieber, Halsschmerzen</b>. Consulta é <b>Termin</b>, e sem ele é difícil ser atendido na Alemanha.",
      [["Ich habe Halsschmerzen.", "Estou com dor de garganta."], ["Ich brauche einen Termin.", "Preciso de uma consulta."]]],
  },
};

COMPLEMENTOS.emocoes = {
  palavras: [
    ["Animado", "Excited", "Emocionado", "Enthousiaste", "Entusiasta", "Begeistert", "🤩"],
    ["Entediado", "Bored", "Aburrido", "Ennuyé", "Annoiato", "Gelangweilt", "🥱"],
    ["Preocupado", "Worried", "Preocupado", "Inquiet", "Preoccupato", "Besorgt", "😟"],
    ["Orgulhoso", "Proud", "Orgulloso", "Fier", "Orgoglioso", "Stolz", "🦚"],
  ],
  frases: [
    ["Estou animado com a viagem", "I'm excited about the trip", "Estoy emocionado con el viaje", "J'ai hâte de partir en voyage", "Sono entusiasta del viaggio", "Ich freue mich auf die Reise"],
    ["Não se preocupe", "Don't worry", "No te preocupes", "Ne t'inquiète pas", "Non preoccuparti", "Keine Sorge"],
    ["Estou muito orgulhoso de você", "I'm so proud of you", "Estoy muy orgulloso de ti", "Je suis très fier de toi", "Sono molto orgoglioso di te", "Ich bin sehr stolz auf dich"],
    ["Esse filme é chato", "This movie is boring", "Esta película es aburrida", "Ce film est ennuyeux", "Questo film è noioso", "Dieser Film ist langweilig"],
  ],
  dialogo: [
    ["A", "Você parece preocupado. Tudo bem?", "You look worried. Are you OK?", "Pareces preocupado. ¿Estás bien?", "Tu as l'air inquiet. Ça va ?", "Sembri preoccupato. Tutto bene?", "Du siehst besorgt aus. Alles in Ordnung?"],
    ["B", "Tenho uma prova amanhã e estou nervoso.", "I have an exam tomorrow and I'm nervous.", "Tengo un examen mañana y estoy nervioso.", "J'ai un examen demain et je suis stressé.", "Domani ho un esame e sono nervoso.", "Ich habe morgen eine Prüfung und bin nervös."],
    ["A", "Não se preocupe, você estudou muito!", "Don't worry, you studied a lot!", "No te preocupes, ¡has estudiado mucho!", "Ne t'inquiète pas, tu as beaucoup révisé !", "Non preoccuparti, hai studiato tanto!", "Keine Sorge, du hast viel gelernt!"],
    ["B", "Obrigado. Já fico mais calmo.", "Thanks. That makes me feel calmer.", "Gracias. Ya me quedo más tranquilo.", "Merci. Ça me rassure.", "Grazie. Mi sento più tranquillo.", "Danke. Jetzt bin ich ruhiger."],
  ],
  notas: {
    en: ["Bored ou boring?", "Adjetivos com <b>-ed</b> dizem como a pessoa se sente; com <b>-ing</b>, o que causa o sentimento: <b>I'm bored</b> (estou entediado) × <b>The movie is boring</b> (o filme é chato). Quem diz “I'm boring” está dizendo que <i>ele mesmo</i> é chato! Vale também para <b>excited/exciting</b> e <b>tired/tiring</b>.",
      [["I'm bored.", "Estou entediado."], ["This class is boring.", "Esta aula é chata."], ["I'm excited about the trip.", "Estou animado com a viagem."]]],
    es: ["Estar para emoções", "Emoções passageiras usam <b>estar</b>: <b>estoy nervioso</b>, <b>estoy aburrido</b>. Com <b>ser</b>, vira característica: <b>es aburrido</b> = ele é chato. Bravo é <b>enojado</b> (ou <b>enfadado</b>, na Espanha).",
      [["Estoy aburrido.", "Estou entediado."], ["La película es aburrida.", "O filme é chato."]]],
    fr: ["Avoir l'air e j'ai hâte", "Para “parecer”, o francês usa <b>avoir l'air</b>: <b>Tu as l'air fatigué</b>. Para “mal posso esperar”: <b>J'ai hâte de...</b>. Chato é <b>ennuyeux</b>, e <b>je m'ennuie</b> é “estou entediado”.",
      [["J'ai hâte de te voir !", "Estou louco para te ver!"], ["Je m'ennuie.", "Estou entediado."]]],
    it: ["Sembrare e annoiarsi", "Para “parecer”: <b>Sembri stanco</b> (você parece cansado). Entediado é <b>annoiato</b>, e chato é <b>noioso</b>. Na negação com tu, usa-se o infinitivo: <b>Non preoccuparti!</b>",
      [["Mi annoio.", "Estou entediado."], ["Non preoccuparti!", "Não se preocupe!"]]],
    de: ["Sich freuen auf e stolz auf", "<b>Ich freue mich auf...</b> é “estou animado com algo bom que vem aí”; <b>sich freuen über</b> é ficar feliz com algo que já aconteceu. Orgulhoso é <b>stolz auf</b>: <b>Ich bin stolz auf dich</b>.",
      [["Ich freue mich auf die Reise.", "Estou animado com a viagem."], ["Ich bin stolz auf dich.", "Estou orgulhoso de você."]]],
  },
};
