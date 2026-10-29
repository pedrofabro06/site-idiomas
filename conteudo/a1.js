// ============================================================
//  Aprofundamento das unidades A1
//  palavras/frases: mesmo formato do data.js (entram no fim da lista)
//  dialogo: ["A" ou "B", português, inglês, espanhol, francês, italiano, alemão]
//  notas[idioma]: [título, explicação, [[exemplo, tradução], ...]]
//  As notas comparam com o português: é onde o brasileiro mais erra.
// ============================================================
COMPLEMENTOS.essenciais = {
  palavras: [
    ["Isso", "That", "Eso", "Ça", "Quello", "Das", "👈"],
    ["Aqui", "Here", "Aquí", "Ici", "Qui", "Hier", "📍"],
    ["Agora", "Now", "Ahora", "Maintenant", "Adesso", "Jetzt", "⏰"],
    ["Também", "Also", "También", "Aussi", "Anche", "Auch", "➕"],
  ],
  frases: [
    ["Eles estão aqui agora", "They are here now", "Ellos están aquí ahora", "Ils sont ici maintenant", "Loro sono qui adesso", "Sie sind jetzt hier"],
    ["Eu também", "Me too", "Yo también", "Moi aussi", "Anch'io", "Ich auch"],
    ["Isso é muito bom", "That's very good", "Eso es muy bueno", "C'est très bon", "È molto buono", "Das ist sehr gut"],
    ["Ela também está aqui", "She is here too", "Ella también está aquí", "Elle est ici aussi", "Anche lei è qui", "Sie ist auch hier"],
  ],
  dialogo: [
    ["A", "Você é brasileiro?", "Are you Brazilian?", "¿Eres brasileño?", "Tu es brésilien ?", "Sei brasiliano?", "Bist du Brasilianer?"],
    ["B", "Sim! E você?", "Yes! And you?", "¡Sí! ¿Y tú?", "Oui ! Et toi ?", "Sì! E tu?", "Ja! Und du?"],
    ["A", "Eu também! Eles também.", "Me too! They are too.", "¡Yo también! Ellos también.", "Moi aussi ! Eux aussi.", "Anch'io! Anche loro.", "Ich auch! Sie auch."],
    ["B", "Que legal!", "That's great!", "¡Qué bien!", "C'est génial !", "Che bello!", "Wie schön!"],
  ],
  notas: {
    en: ["Pronomes e o verbo to be", "Em inglês o sujeito <b>sempre</b> aparece: dizemos <b>I am here</b>, nunca só “am here”. <b>You</b> vale para você e vocês, e <b>they</b> para eles e elas. O verbo <b>to be</b> (ser e estar ao mesmo tempo) muda assim: I <b>am</b> · you, we, they <b>are</b> · he, she, it <b>is</b>.",
      [["I am here.", "Eu estou aqui."], ["She is very nice.", "Ela é muito legal."], ["They are here now.", "Eles estão aqui agora."]]],
    es: ["O sujeito pode sumir", "Como no português, o verbo já mostra quem faz a ação, então o pronome costuma cair: <b>Hablo</b> = eu falo. Use <b>yo, tú, él</b> só para dar ênfase. <b>Tú</b> é o “você” do dia a dia; <b>usted</b> é o formal, para desconhecidos e pessoas mais velhas.",
      [["Hablo despacio.", "Eu falo devagar."], ["¿Y tú?", "E você?"], ["Ella también está aquí.", "Ela também está aqui."]]],
    fr: ["Tu ou vous?", "Em francês o sujeito é obrigatório: <b>je, tu, il, elle, nous, vous, ils, elles</b>. <b>Tu</b> é para amigos e família; <b>vous</b> é o “você” educado e também o “vocês”. Na conversa, <b>on</b> substitui <b>nous</b>: <b>on parle</b> = a gente fala.",
      [["Moi aussi !", "Eu também!"], ["Vous parlez portugais ?", "O senhor fala português?"], ["On étudie ensemble.", "A gente estuda junto."]]],
    it: ["Pronome opcional", "Como no português, o italiano costuma omitir o sujeito, porque o verbo já diz quem é: <b>parlo</b> = eu falo. <b>Tu</b> é o “você” informal; <b>Lei</b> é o formal. E <b>anche</b> vem antes da palavra: <b>anch'io</b> = eu também, <b>anche lei</b> = ela também.",
      [["Anche lei è qui.", "Ela também está aqui."], ["Parlo piano.", "Eu falo devagar."], ["E tu?", "E você?"]]],
    de: ["Du, Sie e o verbo na 2ª posição", "Em alemão o sujeito é obrigatório. <b>du</b> é o “você” informal e <b>Sie</b> (com maiúscula) é o formal. Cuidado: <b>sie</b> minúsculo é “ela” ou “eles”. Regra de ouro: na frase afirmativa, o verbo fica sempre na <b>2ª posição</b>, mesmo se a frase começar por outra palavra.",
      [["Ich bin hier.", "Eu estou aqui."], ["Jetzt bin ich hier.", "Agora eu estou aqui."], ["Sie ist auch hier.", "Ela também está aqui."]]],
  },
};

COMPLEMENTOS.saudacoes = {
  palavras: [
    ["Boa tarde", "Good afternoon", "Buenas tardes", "Bon après-midi", "Buon pomeriggio", "Guten Tag", "🌤️"],
    ["De nada", "You're welcome", "De nada", "De rien", "Prego", "Gern geschehen", "😊"],
    ["Com licença", "Excuse me", "Perdón", "Excusez-moi", "Permesso", "Verzeihung", "🙋"],
    ["Até logo", "See you later", "Hasta luego", "À plus tard", "A dopo", "Bis später", "👋"],
  ],
  frases: [
    ["Tudo ótimo, e você?", "I'm great, and you?", "Muy bien, ¿y tú?", "Très bien, et toi ?", "Benissimo, e tu?", "Sehr gut, und dir?"],
    ["Muito obrigado pela ajuda", "Thanks a lot for your help", "Muchas gracias por tu ayuda", "Merci beaucoup pour ton aide", "Grazie mille per l'aiuto", "Vielen Dank für deine Hilfe"],
    ["Tenha um bom dia!", "Have a nice day!", "¡Que tengas un buen día!", "Bonne journée !", "Buona giornata!", "Schönen Tag noch!"],
    ["Desculpe o atraso", "Sorry I'm late", "Perdón por el retraso", "Désolé pour le retard", "Scusa il ritardo", "Entschuldigung für die Verspätung"],
  ],
  dialogo: [
    ["A", "Bom dia! Tudo bem?", "Good morning! How are you?", "¡Buenos días! ¿Qué tal?", "Bonjour ! Ça va ?", "Buongiorno! Come va?", "Guten Morgen! Wie geht's?"],
    ["B", "Tudo ótimo, e você?", "I'm great, and you?", "Muy bien, ¿y tú?", "Très bien, et toi ?", "Benissimo, e tu?", "Sehr gut, und dir?"],
    ["A", "Bem, obrigado. Até logo!", "Fine, thanks. See you later!", "Bien, gracias. ¡Hasta luego!", "Bien, merci. À plus tard !", "Bene, grazie. A dopo!", "Gut, danke. Bis später!"],
    ["B", "Tchau! Tenha um bom dia!", "Bye! Have a nice day!", "¡Adiós! ¡Que tengas un buen día!", "Salut ! Bonne journée !", "Ciao! Buona giornata!", "Tschüss! Schönen Tag noch!"],
  ],
  notas: {
    en: ["How are you? é quase um “oi”", "Em inglês, <b>How are you?</b> funciona como cumprimento, e a resposta esperada é curta e positiva: <b>Good, thanks. And you?</b>. <b>Good night</b> é só para se despedir à noite ou ir dormir; ao chegar à noite, diga <b>Good evening</b>. E <b>Sorry</b> pede desculpa, enquanto <b>Excuse me</b> pede licença ou chama a atenção de alguém.",
      [["Good, thanks. And you?", "Bem, obrigado. E você?"], ["Excuse me, where is the bathroom?", "Com licença, onde fica o banheiro?"]]],
    es: ["Qué tal e as despedidas", "<b>¿Qué tal?</b> é o “tudo bem?” mais comum. Na Espanha, <b>¡Hasta luego!</b> se diz até para quem você não vai ver de novo, e <b>Buenas</b> sozinho é um oi informal a qualquer hora. Com desconhecidos mais velhos, prefira <b>usted</b>: <b>¿Cómo está usted?</b>",
      [["¿Qué tal?", "Tudo bem?"], ["¿Cómo está usted?", "Como o senhor está?"]]],
    fr: ["Bonjour o dia inteiro", "Na França, <b>Bonjour</b> vale da manhã até o fim da tarde, e entrar numa loja sem dizer <b>Bonjour</b> é falta de educação. À noite, diga <b>Bonsoir</b>. <b>Bonne nuit</b> é só para ir dormir. <b>Salut</b> é oi e tchau entre amigos.",
      [["Bonjour madame !", "Bom dia, senhora!"], ["Bonsoir, ça va ?", "Boa noite, tudo bem?"]]],
    it: ["Ciao só com quem é íntimo", "<b>Ciao</b> é oi e tchau, mas só com quem você trata por <b>tu</b>. Com desconhecidos, use <b>Buongiorno</b> (até o começo da tarde) e <b>Buonasera</b> (do meio da tarde em diante). <b>Prego</b> é o “de nada” e também o “pois não?” do vendedor.",
      [["Buonasera, signora!", "Boa noite, senhora!"], ["Grazie! — Prego.", "Obrigado! — De nada."]]],
    de: ["Formal ou informal no cumprimento", "<b>Hallo</b> é o oi universal. Com desconhecidos, use <b>Guten Tag</b> e <b>Wie geht es Ihnen?</b>; com amigos, <b>Wie geht's?</b>. No sul da Alemanha e na Áustria você vai ouvir <b>Grüß Gott</b> e <b>Servus</b>. <b>Tschüss</b> é o tchau informal; <b>Auf Wiedersehen</b>, o formal.",
      [["Wie geht es Ihnen?", "Como o senhor está?"], ["Auf Wiedersehen!", "Até logo! (formal)"]]],
  },
};

COMPLEMENTOS.apresentacao = {
  palavras: [
    ["Cidade", "City", "Ciudad", "Ville", "Città", "Stadt", "🏙️"],
    ["Idioma", "Language", "Idioma", "Langue", "Lingua", "Sprache", "🗣️"],
    ["Casado", "Married", "Casado", "Marié", "Sposato", "Verheiratet", "💍"],
    ["Solteiro", "Single", "Soltero", "Célibataire", "Single", "Ledig", "🙋"],
  ],
  frases: [
    ["Quantos anos você tem?", "How old are you?", "¿Cuántos años tienes?", "Tu as quel âge ?", "Quanti anni hai?", "Wie alt bist du?"],
    ["O que você faz?", "What do you do?", "¿A qué te dedicas?", "Qu'est-ce que tu fais dans la vie ?", "Che lavoro fai?", "Was machst du beruflich?"],
    ["Eu sou professor", "I am a teacher", "Soy profesor", "Je suis professeur", "Sono insegnante", "Ich bin Lehrer"],
    ["De onde você é?", "Where are you from?", "¿De dónde eres?", "Tu viens d'où ?", "Di dove sei?", "Woher kommst du?"],
  ],
  dialogo: [
    ["A", "Oi! Qual é o seu nome?", "Hi! What's your name?", "¡Hola! ¿Cómo te llamas?", "Salut ! Tu t'appelles comment ?", "Ciao! Come ti chiami?", "Hallo! Wie heißt du?"],
    ["B", "Meu nome é Lucas. De onde você é?", "My name is Lucas. Where are you from?", "Me llamo Lucas. ¿De dónde eres?", "Je m'appelle Lucas. Tu viens d'où ?", "Mi chiamo Lucas. Di dove sei?", "Ich heiße Lucas. Woher kommst du?"],
    ["A", "Eu sou do Brasil. E o que você faz?", "I'm from Brazil. And what do you do?", "Soy de Brasil. ¿Y a qué te dedicas?", "Je viens du Brésil. Et tu fais quoi dans la vie ?", "Vengo dal Brasile. E tu che lavoro fai?", "Ich komme aus Brasilien. Und was machst du beruflich?"],
    ["B", "Eu sou engenheiro. Prazer!", "I'm an engineer. Nice to meet you!", "Soy ingeniero. ¡Mucho gusto!", "Je suis ingénieur. Enchanté !", "Sono ingegnere. Piacere!", "Ich bin Ingenieur. Freut mich!"],
  ],
  notas: {
    en: ["I am 20, nunca “I have 20 years”", "Idade em inglês usa o verbo <b>to be</b>: <b>I am 20 (years old)</b>. Profissão exige <b>a/an</b>: <b>I'm a teacher</b>, <b>I'm an engineer</b> (an antes de som de vogal). Para perguntar a profissão, o natural é <b>What do you do?</b>, e origem é <b>I'm from Brazil</b>.",
      [["I'm 30 years old.", "Eu tenho 30 anos."], ["She's a doctor.", "Ela é médica."], ["What do you do?", "O que você faz?"]]],
    es: ["Me llamo e profissão sem artigo", "Para dizer o nome, o mais natural é <b>Me llamo...</b> (eu me chamo). Profissão vem <b>sem artigo</b>: <b>Soy médico</b>. Idade usa <b>tener</b>, como no português: <b>Tengo 20 años</b>. E para perguntar a profissão: <b>¿A qué te dedicas?</b>",
      [["Me llamo Ana.", "Meu nome é Ana."], ["Soy ingeniera.", "Sou engenheira."]]],
    fr: ["J'ai 20 ans e profissão sem artigo", "Idade usa <b>avoir</b> (ter): <b>J'ai 20 ans</b>. Depois de <b>être</b>, a profissão vem sem artigo: <b>Je suis médecin</b>. Origem: <b>Je viens du Brésil</b>, porque <b>du</b> = de + le, e o país é <i>le</i> Brésil.",
      [["J'ai trente ans.", "Tenho trinta anos."], ["Je viens du Brésil.", "Eu venho do Brasil."]]],
    it: ["Avere para a idade", "Idade usa <b>avere</b>: <b>Ho 20 anni</b>. Profissão vem sem artigo: <b>Sono medico</b>. Para a origem, diga <b>Sono brasiliano</b> (ou <b>brasiliana</b>) ou <b>Vengo dal Brasile</b>.",
      [["Ho trent'anni.", "Tenho trinta anos."], ["Sono brasiliana.", "Sou brasileira."]]],
    de: ["Ich bin 20 Jahre alt", "Como no inglês, idade usa o verbo ser: <b>Ich bin 20 Jahre alt</b>. A profissão vem sem artigo e muda no feminino: <b>Ich bin Lehrer</b> e <b>Ich bin Lehrerin</b>. Origem: <b>Ich komme aus Brasilien</b>.",
      [["Wie alt bist du?", "Quantos anos você tem?"], ["Ich bin Ingenieurin.", "Sou engenheira."]]],
  },
};

COMPLEMENTOS.numeros = {
  palavras: [
    ["Oito", "Eight", "Ocho", "Huit", "Otto", "Acht", "8️⃣"],
    ["Nove", "Nine", "Nueve", "Neuf", "Nove", "Neun", "9️⃣"],
    ["Zero", "Zero", "Cero", "Zéro", "Zero", "Null", "0️⃣"],
    ["Número", "Number", "Número", "Numéro", "Numero", "Nummer", "#️⃣"],
  ],
  frases: [
    ["Qual é o seu número de telefone?", "What's your phone number?", "¿Cuál es tu número de teléfono?", "Quel est ton numéro de téléphone ?", "Qual è il tuo numero di telefono?", "Wie ist deine Telefonnummer?"],
    ["Dois cafés, por favor", "Two coffees, please", "Dos cafés, por favor", "Deux cafés, s'il vous plaît", "Due caffè, per favore", "Zwei Kaffee, bitte"],
    ["Tem nove pessoas aqui", "There are nine people here", "Hay nueve personas aquí", "Il y a neuf personnes ici", "Ci sono nove persone qui", "Hier sind neun Leute"],
    ["Uma mesa para quatro, por favor", "A table for four, please", "Una mesa para cuatro, por favor", "Une table pour quatre, s'il vous plaît", "Un tavolo per quattro, per favore", "Einen Tisch für vier, bitte"],
  ],
  dialogo: [
    ["A", "Para quantas pessoas?", "How many people?", "¿Para cuántas personas?", "Pour combien de personnes ?", "Per quante persone?", "Für wie viele Personen?"],
    ["B", "Para quatro, por favor.", "For four, please.", "Para cuatro, por favor.", "Pour quatre, s'il vous plaît.", "Per quattro, per favore.", "Für vier, bitte."],
    ["A", "Algo para beber?", "Anything to drink?", "¿Algo para beber?", "Quelque chose à boire ?", "Qualcosa da bere?", "Etwas zu trinken?"],
    ["B", "Três sucos e um café.", "Three juices and one coffee.", "Tres zumos y un café.", "Trois jus et un café.", "Tre succhi e un caffè.", "Drei Säfte und einen Kaffee."],
  ],
  notas: {
    en: ["Telefone se fala dígito por dígito", "Em inglês, o número de telefone é dito <b>dígito por dígito</b>, e o zero muitas vezes vira <b>“oh”</b>: 9087 = <b>nine-oh-eight-seven</b>. Dois iguais seguidos podem virar <b>double</b>: 55 = <b>double five</b>. E o plural leva <b>-s</b>: two coffee<b>s</b>.",
      [["My number is nine-oh-two, double five.", "Meu número é nove-zero-dois, cinco-cinco."], ["Two coffees, please.", "Dois cafés, por favor."]]],
    es: ["Uno vira un", "<b>Uno</b> vira <b>un</b> antes de substantivo masculino (<b>un café</b>) e <b>una</b> antes de feminino (<b>una mesa</b>). Para “tem” no sentido de existir, use <b>hay</b>: <b>Hay nueve personas</b>. Na Espanha, suco é <b>zumo</b>; na América Latina, <b>jugo</b>.",
      [["Un café y una mesa, por favor.", "Um café e uma mesa, por favor."], ["Hay cuatro sillas.", "Tem quatro cadeiras."]]],
    fr: ["Il y a e a ligação", "Para “tem” no sentido de existir, use <b>il y a</b>: <b>Il y a neuf personnes</b>. Repare na ligação: em <b>deux amis</b>, o x soa como z (“dœ-za-mi”), e <b>neuf ans</b> soa “nœ-vã”. Telefones são lidos de dois em dois: 06 12 = <b>zéro six, douze</b>.",
      [["Il y a deux hôtels ici.", "Tem dois hotéis aqui."], ["J'ai neuf ans.", "Tenho nove anos."]]],
    it: ["C'è, ci sono e o plural", "Para existir, use <b>c'è</b> (singular) e <b>ci sono</b> (plural): <b>Ci sono nove persone</b>. Palavras com acento na última sílaba não mudam no plural: <b>un caffè, due caffè</b>.",
      [["C'è un tavolo libero?", "Tem uma mesa livre?"], ["Due caffè, per favore.", "Dois cafés, por favor."]]],
    de: ["Eins vira ein", "Contando, diz-se <b>eins</b>; antes de substantivo vira <b>ein</b> ou <b>eine</b>: <b>ein Kaffee</b>, <b>eine Cola</b>. Ao telefone, muita gente diz <b>zwo</b> em vez de <b>zwei</b>, para não confundir com <b>drei</b>.",
      [["Einen Tisch für vier, bitte.", "Uma mesa para quatro, por favor."], ["Meine Nummer ist null, zwo, drei.", "Meu número é zero, dois, três."]]],
  },
};

COMPLEMENTOS.numeros2 = {
  palavras: [
    ["Treze", "Thirteen", "Trece", "Treize", "Tredici", "Dreizehn", "1️⃣3️⃣"],
    ["Quarenta", "Forty", "Cuarenta", "Quarante", "Quaranta", "Vierzig", "4️⃣0️⃣"],
    ["Noventa", "Ninety", "Noventa", "Quatre-vingt-dix", "Novanta", "Neunzig", "9️⃣0️⃣"],
    ["Primeiro", "First", "Primero", "Premier", "Primo", "Erste", "🥇"],
  ],
  frases: [
    ["Custa noventa euros", "It costs ninety euros", "Cuesta noventa euros", "Ça coûte quatre-vingt-dix euros", "Costa novanta euro", "Es kostet neunzig Euro"],
    ["Eu moro no primeiro andar", "I live on the first floor", "Vivo en el primer piso", "J'habite au premier étage", "Abito al primo piano", "Ich wohne im ersten Stock"],
    ["Treze, não trinta", "Thirteen, not thirty", "Trece, no treinta", "Treize, pas trente", "Tredici, non trenta", "Dreizehn, nicht dreißig"],
    ["Eu tenho quarenta e cinco minutos", "I have forty-five minutes", "Tengo cuarenta y cinco minutos", "J'ai quarante-cinq minutes", "Ho quarantacinque minuti", "Ich habe fünfundvierzig Minuten"],
  ],
  dialogo: [
    ["A", "Quanto custa esse casaco?", "How much is this coat?", "¿Cuánto cuesta este abrigo?", "Combien coûte ce manteau ?", "Quanto costa questo cappotto?", "Wie viel kostet dieser Mantel?"],
    ["B", "Custa noventa euros.", "It costs ninety euros.", "Cuesta noventa euros.", "Il coûte quatre-vingt-dix euros.", "Costa novanta euro.", "Er kostet neunzig Euro."],
    ["A", "Noventa? Não é dezenove?", "Ninety? Not nineteen?", "¿Noventa? ¿No diecinueve?", "Quatre-vingt-dix ? Pas dix-neuf ?", "Novanta? Non diciannove?", "Neunzig? Nicht neunzehn?"],
    ["B", "Não, noventa. Mas hoje tem desconto!", "No, ninety. But there's a discount today!", "No, noventa. ¡Pero hoy hay descuento!", "Non, quatre-vingt-dix. Mais aujourd'hui, il y a une réduction !", "No, novanta. Ma oggi c'è lo sconto!", "Nein, neunzig. Aber heute gibt es Rabatt!"],
  ],
  notas: {
    en: ["Thirteen ou thirty? Ouça a sílaba forte", "Os números com <b>-teen</b> têm a força no fim: thir<b>TEEN</b>, four<b>TEEN</b>. Os com <b>-ty</b>, no começo: <b>THIR</b>ty, <b>FOR</b>ty. Na fala, é isso que separa 13 de 30. Atenção à grafia: <b>four</b>, mas <b>forty</b> (sem u). E 100 é <b>a hundred</b> ou <b>one hundred</b>.",
      [["Thirteen, not thirty.", "Treze, não trinta."], ["Forty-five minutes.", "Quarenta e cinco minutos."]]],
    es: ["O y só entre dezena e unidade", "O <b>y</b> só aparece entre dezenas e unidades: <b>cuarenta y cinco</b>, mas <b>ciento cinco</b> (sem y). De 16 a 29 se escreve tudo junto: <b>dieciséis, veintidós</b>. 100 sozinho é <b>cien</b>; 101 é <b>ciento uno</b>.",
      [["Cuarenta y cinco minutos.", "Quarenta e cinco minutos."], ["Cien euros.", "Cem euros."]]],
    fr: ["A matemática do francês", "Depois de 69, o francês faz contas: 70 = <b>soixante-dix</b> (60 + 10), 80 = <b>quatre-vingts</b> (4 × 20), 90 = <b>quatre-vingt-dix</b> (4 × 20 + 10). Na Bélgica e na Suíça, diz-se <b>septante</b> e <b>nonante</b>.",
      [["Quatre-vingt-dix euros.", "Noventa euros."], ["Soixante-quinze.", "Setenta e cinco."]]],
    it: ["Números colados", "Em italiano os números se escrevem juntos: <b>quarantacinque</b>. Quando a unidade começa com vogal, a dezena perde a última letra: <b>ventuno</b>, <b>trentotto</b>. E <b>euro</b> não muda no plural: <b>novanta euro</b>.",
      [["Quarantacinque minuti.", "Quarenta e cinco minutos."], ["Ventuno anni.", "Vinte e um anos."]]],
    de: ["O número de trás para a frente", "Em alemão, a unidade vem antes da dezena: 45 = <b>fünfundvierzig</b> (cinco-e-quarenta). Ao ouvir, espere o número inteiro antes de escrever. E <b>dreißig</b> (30) é a única dezena com ß.",
      [["Fünfundvierzig Minuten.", "Quarenta e cinco minutos."], ["Dreizehn, nicht dreißig.", "Treze, não trinta."]]],
  },
};

COMPLEMENTOS.cores = {
  palavras: [
    ["Roxo", "Purple", "Morado", "Violet", "Viola", "Lila", "🟪"],
    ["Marrom", "Brown", "Marrón", "Marron", "Marrone", "Braun", "🟫"],
    ["Cinza", "Gray", "Gris", "Gris", "Grigio", "Grau", "🌫️"],
    ["Escuro", "Dark", "Oscuro", "Foncé", "Scuro", "Dunkel", "🌑"],
  ],
  frases: [
    ["Eu tenho um carro vermelho", "I have a red car", "Tengo un coche rojo", "J'ai une voiture rouge", "Ho una macchina rossa", "Ich habe ein rotes Auto"],
    ["Qual é a sua cor favorita?", "What's your favorite color?", "¿Cuál es tu color favorito?", "Quelle est ta couleur préférée ?", "Qual è il tuo colore preferito?", "Was ist deine Lieblingsfarbe?"],
    ["Ela tem olhos castanhos", "She has brown eyes", "Tiene los ojos marrones", "Elle a les yeux marron", "Ha gli occhi marroni", "Sie hat braune Augen"],
    ["Eu prefiro o azul-escuro", "I prefer dark blue", "Prefiero el azul oscuro", "Je préfère le bleu foncé", "Preferisco il blu scuro", "Ich mag Dunkelblau lieber"],
  ],
  dialogo: [
    ["A", "Qual é a sua cor favorita?", "What's your favorite color?", "¿Cuál es tu color favorito?", "Quelle est ta couleur préférée ?", "Qual è il tuo colore preferito?", "Was ist deine Lieblingsfarbe?"],
    ["B", "Azul. E a sua?", "Blue. What about you?", "El azul. ¿Y el tuyo?", "Le bleu. Et toi ?", "Il blu. E il tuo?", "Blau. Und deine?"],
    ["A", "Eu gosto de roxo.", "I like purple.", "Me gusta el morado.", "J'aime le violet.", "Mi piace il viola.", "Ich mag Lila."],
    ["B", "Meu carro é roxo!", "My car is purple!", "¡Mi coche es morado!", "Ma voiture est violette !", "La mia macchina è viola!", "Mein Auto ist lila!"],
  ],
  notas: {
    en: ["A cor vem antes e nunca muda", "Em inglês, o adjetivo vem <b>antes</b> do substantivo e não tem plural: <b>a red car</b>, <b>two red cars</b> (nada de “reds”). Para tons, use <b>light</b> e <b>dark</b>: <b>light blue</b>, <b>dark green</b>. Grafia: <b>color</b> nos EUA, <b>colour</b> no Reino Unido.",
      [["I have a red car.", "Tenho um carro vermelho."], ["She has dark hair.", "Ela tem cabelo escuro."]]],
    es: ["A cor vem depois e concorda", "Como no português, a cor vem depois e concorda: <b>un coche rojo</b>, <b>una casa roja</b>, <b>coches rojos</b>. Para falar da cor como nome, use artigo: <b>Me gusta el azul</b>.",
      [["Tengo un coche rojo.", "Tenho um carro vermelho."], ["Las flores amarillas.", "As flores amarelas."]]],
    fr: ["Concordância e cores que não mudam", "A cor vem depois e concorda: <b>une voiture verte</b>. Cores que vêm de frutas ou coisas, como <b>marron</b> e <b>orange</b>, não mudam: <b>des yeux marron</b>. Cor composta também fica igual: <b>des robes bleu foncé</b>.",
      [["J'ai une voiture rouge.", "Tenho um carro vermelho."], ["Elle a les yeux marron.", "Ela tem olhos castanhos."]]],
    it: ["Rosso, rossa, rossi, rosse", "A cor vem depois e concorda: <b>una macchina rossa</b>, <b>due macchine rosse</b>. Algumas cores nunca mudam: <b>blu, rosa, viola, beige</b>: <b>le magliette blu</b>.",
      [["Ho una macchina rossa.", "Tenho um carro vermelho."], ["Le scarpe blu.", "Os sapatos azuis."]]],
    de: ["Antes do substantivo, com terminação", "Em alemão a cor vem antes do substantivo e ganha terminação: <b>ein rotes Auto</b>, <b>eine rote Tasche</b>. Depois de <b>sein</b>, fica sem terminação: <b>Das Auto ist rot</b>. Claro e escuro se colam na cor: <b>hellblau</b>, <b>dunkelgrün</b>.",
      [["Ich habe ein rotes Auto.", "Tenho um carro vermelho."], ["Das Auto ist rot.", "O carro é vermelho."]]],
  },
};

COMPLEMENTOS.comida = {
  palavras: [
    ["Ovo", "Egg", "Huevo", "Œuf", "Uovo", "Ei", "🥚"],
    ["Frango", "Chicken", "Pollo", "Poulet", "Pollo", "Hähnchen", "🍗"],
    ["Suco", "Juice", "Zumo", "Jus", "Succo", "Saft", "🧃"],
    ["Bolo", "Cake", "Pastel", "Gâteau", "Torta", "Kuchen", "🍰"],
  ],
  frases: [
    ["Eu gostaria de um suco, por favor", "I'd like a juice, please", "Quería un zumo, por favor", "Je voudrais un jus, s'il vous plaît", "Vorrei un succo, per favore", "Ich hätte gern einen Saft, bitte"],
    ["Eu não como carne", "I don't eat meat", "No como carne", "Je ne mange pas de viande", "Non mangio carne", "Ich esse kein Fleisch"],
    ["Estou com fome", "I'm hungry", "Tengo hambre", "J'ai faim", "Ho fame", "Ich habe Hunger"],
    ["Isso está delicioso!", "This is delicious!", "¡Esto está delicioso!", "C'est délicieux !", "È delizioso!", "Das ist lecker!"],
  ],
  dialogo: [
    ["A", "Você está com fome?", "Are you hungry?", "¿Tienes hambre?", "Tu as faim ?", "Hai fame?", "Hast du Hunger?"],
    ["B", "Sim! Eu gostaria de frango com arroz.", "Yes! I'd like chicken with rice.", "¡Sí! Quería pollo con arroz.", "Oui ! Je voudrais du poulet avec du riz.", "Sì! Vorrei pollo con riso.", "Ja! Ich hätte gern Hähnchen mit Reis."],
    ["A", "E para beber?", "And to drink?", "¿Y para beber?", "Et comme boisson ?", "E da bere?", "Und zu trinken?"],
    ["B", "Um suco de laranja, por favor.", "An orange juice, please.", "Un zumo de naranja, por favor.", "Un jus d'orange, s'il vous plaît.", "Un succo d'arancia, per favore.", "Einen Orangensaft, bitte."],
  ],
  notas: {
    en: ["I'd like: muito mais educado que I want", "Para pedir, use <b>I'd like...</b> (eu gostaria) ou <b>Can I have...?</b>. <b>I want</b> soa seco, quase grosseiro. Fome, sede e frio usam <b>to be</b>, e não “have”: <b>I'm hungry</b>, <b>I'm thirsty</b>, <b>I'm cold</b>.",
      [["I'd like a juice, please.", "Eu gostaria de um suco, por favor."], ["Can I have the menu?", "Pode me trazer o cardápio?"], ["I'm thirsty.", "Estou com sede."]]],
    es: ["Quería: o pedido educado", "No bar, o espanhol usa muito <b>Quería...</b> ou, na Espanha, <b>Me pone...</b> para pedir. Fome e sede usam <b>tener</b>, como no português: <b>Tengo hambre</b>, <b>Tengo sed</b>. Cuidado: <b>pastel</b> é bolo, e não o nosso pastel de feira!",
      [["Me pone un café, por favor.", "Me vê um café, por favor."], ["Tengo sed.", "Estou com sede."]]],
    fr: ["Du, de la: o artigo de quantidade", "Para uma quantidade indefinida, o francês usa <b>du / de la / des</b>: <b>Je mange du pain</b>. Na negativa, vira só <b>de</b>: <b>Je ne mange pas de viande</b>. Para pedir com educação: <b>Je voudrais...</b>.",
      [["Je voudrais du poulet.", "Eu queria frango."], ["Je ne bois pas de lait.", "Não bebo leite."]]],
    it: ["Vorrei e ho fame", "Para pedir com educação: <b>Vorrei...</b> (eu queria). Fome e sede usam <b>avere</b>: <b>Ho fame</b>, <b>Ho sete</b>. No bar, <b>un caffè</b> é sempre um espresso. E <b>torta</b> é bolo.",
      [["Vorrei un succo d'arancia.", "Eu queria um suco de laranja."], ["Ho sete.", "Estou com sede."]]],
    de: ["Ich hätte gern e kein", "Para pedir: <b>Ich hätte gern...</b> (eu gostaria). Para negar um substantivo, use <b>kein</b> em vez de <b>nicht</b>: <b>Ich esse kein Fleisch</b>. E repare em <b>einen Saft</b>: o objeto masculino muda de <i>ein</i> para <i>einen</i>.",
      [["Ich hätte gern einen Saft.", "Eu gostaria de um suco."], ["Ich habe Hunger.", "Estou com fome."]]],
  },
};

COMPLEMENTOS.familia = {
  palavras: [
    ["Pais", "Parents", "Padres", "Parents", "Genitori", "Eltern", "👪"],
    ["Marido", "Husband", "Marido", "Mari", "Marito", "Ehemann", "🤵"],
    ["Esposa", "Wife", "Esposa", "Femme", "Moglie", "Ehefrau", "👰"],
    ["Primo", "Cousin", "Primo", "Cousin", "Cugino", "Cousin", "🧑"],
  ],
  frases: [
    ["Você tem irmãos?", "Do you have any brothers or sisters?", "¿Tienes hermanos?", "Tu as des frères et sœurs ?", "Hai fratelli?", "Hast du Geschwister?"],
    ["Meus pais moram no Rio", "My parents live in Rio", "Mis padres viven en Río", "Mes parents habitent à Rio", "I miei genitori abitano a Rio", "Meine Eltern wohnen in Rio"],
    ["Ela é casada com o meu primo", "She is married to my cousin", "Está casada con mi primo", "Elle est mariée avec mon cousin", "È sposata con mio cugino", "Sie ist mit meinem Cousin verheiratet"],
    ["Esse é o meu marido", "This is my husband", "Este es mi marido", "C'est mon mari", "Questo è mio marito", "Das ist mein Mann"],
  ],
  dialogo: [
    ["A", "Você tem irmãos?", "Do you have any brothers or sisters?", "¿Tienes hermanos?", "Tu as des frères et sœurs ?", "Hai fratelli?", "Hast du Geschwister?"],
    ["B", "Tenho uma irmã. Ela é casada.", "I have a sister. She's married.", "Tengo una hermana. Está casada.", "J'ai une sœur. Elle est mariée.", "Ho una sorella. È sposata.", "Ich habe eine Schwester. Sie ist verheiratet."],
    ["A", "E os seus pais?", "And your parents?", "¿Y tus padres?", "Et tes parents ?", "E i tuoi genitori?", "Und deine Eltern?"],
    ["B", "Eles moram no Rio, perto da praia.", "They live in Rio, near the beach.", "Viven en Río, cerca de la playa.", "Ils habitent à Rio, près de la plage.", "Abitano a Rio, vicino alla spiaggia.", "Sie wohnen in Rio, nah am Strand."],
  ],
  notas: {
    en: ["Parents são os pais, não os parentes", "<b>Parents</b> = pai e mãe. Parentes em geral são <b>relatives</b>. Irmãos misturando os dois é <b>siblings</b>, mas no dia a dia se pergunta <b>Do you have any brothers or sisters?</b>. E casado é <b>married to</b>, nunca “married with”.",
      [["My parents live in Rio.", "Meus pais moram no Rio."], ["She's married to my cousin.", "Ela é casada com meu primo."]]],
    es: ["Padres e hermanos valem para todos", "<b>Padres</b> é pai e mãe juntos; <b>hermanos</b> pode ser irmãos e irmãs. Estado civil usa <b>estar</b>: <b>Está casada</b>. E o possessivo antes do nome não leva artigo: <b>mi madre</b>, nunca “la mi madre”.",
      [["Mis padres viven en Río.", "Meus pais moram no Rio."], ["¿Tienes hermanos?", "Você tem irmãos?"]]],
    fr: ["Mon, ma, mes", "O possessivo concorda com a coisa possuída: <b>mon père</b>, <b>ma mère</b>, <b>mes parents</b>. Antes de vogal, usa-se <b>mon</b> mesmo no feminino: <b>mon amie</b>. <b>Parents</b> são os pais (e, às vezes, os parentes).",
      [["Mes parents habitent à Rio.", "Meus pais moram no Rio."], ["C'est mon amie Julie.", "Essa é minha amiga Julie."]]],
    it: ["Mio padre sem artigo, i miei genitori com artigo", "Com um parente no singular, o possessivo vem sem artigo: <b>mio padre</b>, <b>mia sorella</b>. No plural, o artigo volta: <b>i miei genitori</b>. E cuidado: <b>parenti</b> são os parentes; os pais são <b>genitori</b>.",
      [["Mio marito è italiano.", "Meu marido é italiano."], ["I miei genitori abitano a Rio.", "Meus pais moram no Rio."]]],
    de: ["Eltern e Geschwister", "O alemão tem palavras para o grupo: <b>Eltern</b> (pai e mãe) e <b>Geschwister</b> (irmãos e irmãs). Para marido e esposa, no dia a dia se diz <b>mein Mann</b> e <b>meine Frau</b>.",
      [["Hast du Geschwister?", "Você tem irmãos?"], ["Das ist meine Frau.", "Essa é minha esposa."]]],
  },
};
COMPLEMENTOS.animais = {
  palavras: [
    ["Coelho", "Rabbit", "Conejo", "Lapin", "Coniglio", "Kaninchen", "🐰"],
    ["Leão", "Lion", "León", "Lion", "Leone", "Löwe", "🦁"],
    ["Macaco", "Monkey", "Mono", "Singe", "Scimmia", "Affe", "🐒"],
    ["Tartaruga", "Turtle", "Tortuga", "Tortue", "Tartaruga", "Schildkröte", "🐢"],
  ],
  frases: [
    ["Você tem algum animal de estimação?", "Do you have any pets?", "¿Tienes mascotas?", "Tu as des animaux ?", "Hai animali domestici?", "Hast du Haustiere?"],
    ["Eu tenho medo de cachorro", "I'm afraid of dogs", "Me dan miedo los perros", "J'ai peur des chiens", "Ho paura dei cani", "Ich habe Angst vor Hunden"],
    ["Os gatos dormem muito", "Cats sleep a lot", "Los gatos duermen mucho", "Les chats dorment beaucoup", "I gatti dormono molto", "Katzen schlafen viel"],
    ["O leão é o rei da selva", "The lion is the king of the jungle", "El león es el rey de la selva", "Le lion est le roi de la jungle", "Il leone è il re della giungla", "Der Löwe ist der König des Dschungels"],
  ],
  dialogo: [
    ["A", "Você tem algum animal de estimação?", "Do you have any pets?", "¿Tienes mascotas?", "Tu as des animaux ?", "Hai animali domestici?", "Hast du Haustiere?"],
    ["B", "Tenho um gato e uma tartaruga.", "I have a cat and a turtle.", "Tengo un gato y una tortuga.", "J'ai un chat et une tortue.", "Ho un gatto e una tartaruga.", "Ich habe eine Katze und eine Schildkröte."],
    ["A", "Que fofo! Eu tenho medo de gato.", "So cute! I'm afraid of cats.", "¡Qué mono! A mí me dan miedo los gatos.", "Trop mignon ! Moi, j'ai peur des chats.", "Che carino! Io ho paura dei gatti.", "Wie süß! Ich habe Angst vor Katzen."],
    ["B", "Sério? Os gatos dormem o dia todo!", "Really? Cats sleep all day!", "¿En serio? ¡Los gatos duermen todo el día!", "Sérieux ? Les chats dorment toute la journée !", "Davvero? I gatti dormono tutto il giorno!", "Echt? Katzen schlafen den ganzen Tag!"],
  ],
  notas: {
    en: ["Falando em geral: plural sem the", "Quando falamos de um grupo em geral, o inglês usa o plural <b>sem artigo</b>: <b>Cats sleep a lot</b> (os gatos dormem muito). Com <b>the</b>, você fala de gatos específicos. Medo é <b>to be afraid of</b>: <b>I'm afraid of dogs</b>.",
      [["Dogs are loyal.", "Os cachorros são leais."], ["I'm afraid of spiders.", "Tenho medo de aranha."]]],
    es: ["Me dan miedo: o medo é o sujeito", "É muito comum dizer <b>Me dan miedo los perros</b> (literalmente “os cachorros me dão medo”). Também existe <b>Tengo miedo a los perros</b>. Generalização leva artigo, como no português: <b>Los gatos duermen mucho</b>. E <b>¡Qué mono!</b> é “que fofo!”.",
      [["Me dan miedo las arañas.", "Tenho medo de aranha."], ["Los perros son fieles.", "Os cachorros são fiéis."]]],
    fr: ["J'ai peur des chats", "Medo usa <b>avoir peur de</b>: <b>J'ai peur des chiens</b> (des = de + les). Generalizações levam artigo: <b>Les chats dorment beaucoup</b>. Animal de estimação é <b>animal de compagnie</b>.",
      [["J'ai peur des chiens.", "Tenho medo de cachorro."], ["Les chats dorment beaucoup.", "Os gatos dormem muito."]]],
    it: ["Ho paura dei cani", "Medo usa <b>avere paura di</b>: <b>Ho paura dei cani</b> (dei = di + i). Generalizações levam artigo: <b>I gatti dormono molto</b>. Para “que fofo!”, diga <b>Che carino!</b>.",
      [["Ho paura dei ragni.", "Tenho medo de aranha."], ["Che carino!", "Que fofo!"]]],
    de: ["Angst vor e o plural sem artigo", "Medo é <b>Angst haben vor</b>, e o que vem depois muda de forma: <b>vor Hunden</b> (o plural ganha -n). Generalização vai sem artigo, como no inglês: <b>Katzen schlafen viel</b>. E repare: <b>die Katze</b> é feminino.",
      [["Ich habe Angst vor Hunden.", "Tenho medo de cachorro."], ["Katzen schlafen viel.", "Os gatos dormem muito."]]],
  },
};

COMPLEMENTOS.acoes = {
  palavras: [
    ["Estudar", "Study", "Estudiar", "Étudier", "Studiare", "Lernen", "📚"],
    ["Cozinhar", "Cook", "Cocinar", "Cuisiner", "Cucinare", "Kochen", "🍳"],
    ["Jogar", "Play", "Jugar", "Jouer", "Giocare", "Spielen", "⚽"],
    ["Assistir", "Watch", "Ver", "Regarder", "Guardare", "Schauen", "📺"],
  ],
  frases: [
    ["Ela estuda todo dia", "She studies every day", "Ella estudia todos los días", "Elle étudie tous les jours", "Lei studia ogni giorno", "Sie lernt jeden Tag"],
    ["Eu estou cozinhando agora", "I'm cooking right now", "Estoy cocinando ahora", "Je suis en train de cuisiner", "Sto cucinando adesso", "Ich koche gerade"],
    ["Você joga futebol?", "Do you play soccer?", "¿Juegas al fútbol?", "Tu joues au foot ?", "Giochi a calcio?", "Spielst du Fußball?"],
    ["Eu não assisto TV", "I don't watch TV", "No veo la tele", "Je ne regarde pas la télé", "Non guardo la TV", "Ich sehe nicht fern"],
  ],
  dialogo: [
    ["A", "O que você está fazendo?", "What are you doing?", "¿Qué estás haciendo?", "Qu'est-ce que tu fais ?", "Cosa stai facendo?", "Was machst du gerade?"],
    ["B", "Estou cozinhando. E você?", "I'm cooking. And you?", "Estoy cocinando. ¿Y tú?", "Je cuisine. Et toi ?", "Sto cucinando. E tu?", "Ich koche. Und du?"],
    ["A", "Estou estudando para a prova.", "I'm studying for the test.", "Estoy estudiando para el examen.", "Je révise pour l'examen.", "Sto studiando per l'esame.", "Ich lerne für die Prüfung."],
    ["B", "Boa sorte! Você estuda todo dia?", "Good luck! Do you study every day?", "¡Suerte! ¿Estudias todos los días?", "Bon courage ! Tu étudies tous les jours ?", "In bocca al lupo! Studi ogni giorno?", "Viel Glück! Lernst du jeden Tag?"],
  ],
  notas: {
    en: ["Do, does e o -s da 3ª pessoa", "No presente, <b>he, she, it</b> ganham <b>-s</b>: <b>She studies</b>, <b>He works</b>. Pergunta e negativa usam o auxiliar <b>do/does</b>: <b>Do you play?</b>, <b>She doesn't cook</b> (o -s vai para o does). Para algo acontecendo agora, use <b>am/is/are + -ing</b>: <b>I'm cooking</b>.",
      [["She works every day.", "Ela trabalha todo dia."], ["Do you play soccer?", "Você joga futebol?"], ["I don't watch TV.", "Eu não assisto TV."]]],
    es: ["Estar + gerúndio, igual ao português", "O espanhol forma o “estou fazendo” como nós: <b>estoy cocinando</b>. A pergunta não precisa de auxiliar, só a entonação: <b>¿Juegas al fútbol?</b>. Repare no <b>al</b>: jugar <b>a</b> + esporte.",
      [["Estoy cocinando.", "Estou cozinhando."], ["¿Juegas al tenis?", "Você joga tênis?"]]],
    fr: ["Ne... pas e être en train de", "A negativa abraça o verbo: <b>je ne regarde pas</b>. Na fala, o <b>ne</b> costuma sumir: “je regarde pas”. Para “estou fazendo agora”, use o presente simples ou <b>être en train de</b>: <b>je suis en train de cuisiner</b>.",
      [["Je ne regarde pas la télé.", "Não assisto TV."], ["Je suis en train de manger.", "Estou comendo."]]],
    it: ["Stare + gerundio", "Como no português: <b>sto cucinando</b>, <b>stai studiando</b>. A pergunta é só entonação: <b>Giochi a calcio?</b>. E para desejar boa sorte numa prova, os italianos dizem <b>In bocca al lupo!</b>, e a resposta é <b>Crepi!</b>.",
      [["Sto cucinando.", "Estou cozinhando."], ["In bocca al lupo! — Crepi!", "Boa sorte! — Valeu!"]]],
    de: ["Não existe o -ndo no alemão", "O alemão não tem tempo contínuo: <b>Ich koche</b> é “eu cozinho” e também “estou cozinhando”. Para reforçar o agora, use <b>gerade</b>: <b>Ich koche gerade</b>. Na pergunta, o verbo vai para o começo: <b>Spielst du Fußball?</b>.",
      [["Ich koche gerade.", "Estou cozinhando agora."], ["Spielst du Fußball?", "Você joga futebol?"]]],
  },
};

COMPLEMENTOS.viagem = {
  palavras: [
    ["Voo", "Flight", "Vuelo", "Vol", "Volo", "Flug", "🛫"],
    ["Reserva", "Reservation", "Reserva", "Réservation", "Prenotazione", "Reservierung", "📋"],
    ["Mapa", "Map", "Mapa", "Carte", "Mappa", "Karte", "🗺️"],
    ["Trem", "Train", "Tren", "Train", "Treno", "Zug", "🚆"],
  ],
  frases: [
    ["Eu tenho uma reserva no nome de Silva", "I have a reservation under Silva", "Tengo una reserva a nombre de Silva", "J'ai une réservation au nom de Silva", "Ho una prenotazione a nome Silva", "Ich habe eine Reservierung auf den Namen Silva"],
    ["A que horas sai o trem?", "What time does the train leave?", "¿A qué hora sale el tren?", "À quelle heure part le train ?", "A che ora parte il treno?", "Wann fährt der Zug ab?"],
    ["Meu voo está atrasado", "My flight is delayed", "Mi vuelo está retrasado", "Mon vol est en retard", "Il mio volo è in ritardo", "Mein Flug hat Verspätung"],
    ["Você pode me mostrar no mapa?", "Can you show me on the map?", "¿Me lo puede enseñar en el mapa?", "Vous pouvez me montrer sur la carte ?", "Me lo può mostrare sulla mappa?", "Können Sie mir das auf der Karte zeigen?"],
  ],
  dialogo: [
    ["A", "Boa noite! Tenho uma reserva no nome de Silva.", "Good evening! I have a reservation under Silva.", "¡Buenas noches! Tengo una reserva a nombre de Silva.", "Bonsoir ! J'ai une réservation au nom de Silva.", "Buonasera! Ho una prenotazione a nome Silva.", "Guten Abend! Ich habe eine Reservierung auf den Namen Silva."],
    ["B", "Claro. Seu passaporte, por favor.", "Of course. Your passport, please.", "Claro. Su pasaporte, por favor.", "Bien sûr. Votre passeport, s'il vous plaît.", "Certo. Il suo passaporto, per favore.", "Natürlich. Ihren Pass, bitte."],
    ["A", "Aqui está. A que horas é o café da manhã?", "Here you go. What time is breakfast?", "Aquí tiene. ¿A qué hora es el desayuno?", "Voilà. Le petit-déjeuner est à quelle heure ?", "Ecco. A che ora è la colazione?", "Bitte schön. Wann gibt es Frühstück?"],
    ["B", "Das sete às dez. Seu quarto fica no terceiro andar.", "From seven to ten. Your room is on the third floor.", "De siete a diez. Su habitación está en la tercera planta.", "De sept heures à dix heures. Votre chambre est au troisième étage.", "Dalle sette alle dieci. La sua camera è al terzo piano.", "Von sieben bis zehn. Ihr Zimmer ist im dritten Stock."],
  ],
  notas: {
    en: ["Can you...? e Could you...? para pedir", "Para pedir algo a um desconhecido, use <b>Can you...?</b> ou, mais educado, <b>Could you...?</b>. Reserva no nome de alguém é <b>under</b>: <b>a reservation under Silva</b>. E ao entregar algo, diga <b>Here you go</b> (aqui está).",
      [["Could you show me on the map?", "Você poderia me mostrar no mapa?"], ["Here you go.", "Aqui está."]]],
    es: ["Usted com os funcionários", "No hotel e no aeroporto, espere ouvir <b>usted</b>: <b>¿Me da su pasaporte?</b>. Na Espanha, o andar do prédio é <b>planta</b> ou <b>piso</b>. E ao entregar algo, diga <b>Aquí tiene</b>.",
      [["Aquí tiene mi pasaporte.", "Aqui está meu passaporte."], ["¿A qué hora sale el tren?", "A que horas sai o trem?"]]],
    fr: ["Vous é o padrão com estranhos", "Com funcionários, use sempre <b>vous</b>. <b>Voilà</b> é o “aqui está”, e atrasado é <b>en retard</b>. Na fala, a palavra de pergunta costuma ir para o fim: <b>Le train part à quelle heure ?</b>",
      [["Voilà mon passeport.", "Aqui está meu passaporte."], ["Mon vol est en retard.", "Meu voo está atrasado."]]],
    it: ["Lei, o você formal", "Com funcionários, use <b>Lei</b> e o verbo na 3ª pessoa: <b>Può ripetere?</b> (o senhor pode repetir?). <b>Ecco</b> é o “aqui está”. Reserva de hotel ou restaurante é <b>prenotazione</b>.",
      [["Ecco il mio passaporto.", "Aqui está meu passaporte."], ["Il mio volo è in ritardo.", "Meu voo está atrasado."]]],
    de: ["Verbos que se separam", "Muitos verbos alemães se partem em dois: <b>abfahren</b> (partir) vira <b>Der Zug fährt um acht Uhr ab</b>, com o <b>ab</b> no fim da frase. Atraso é <b>Verspätung haben</b>: <b>Der Flug hat Verspätung</b>.",
      [["Der Zug fährt um acht Uhr ab.", "O trem sai às oito."], ["Mein Flug hat Verspätung.", "Meu voo está atrasado."]]],
  },
};

COMPLEMENTOS.corpo = {
  palavras: [
    ["Cabeça", "Head", "Cabeza", "Tête", "Testa", "Kopf", "👤"],
    ["Cabelo", "Hair", "Pelo", "Cheveux", "Capelli", "Haare", "💇"],
    ["Dente", "Tooth", "Diente", "Dent", "Dente", "Zahn", "🦷"],
    ["Coração", "Heart", "Corazón", "Cœur", "Cuore", "Herz", "❤️"],
  ],
  frases: [
    ["Ela tem cabelo comprido", "She has long hair", "Tiene el pelo largo", "Elle a les cheveux longs", "Ha i capelli lunghi", "Sie hat lange Haare"],
    ["Lave as mãos antes de comer", "Wash your hands before eating", "Lávate las manos antes de comer", "Lave-toi les mains avant de manger", "Lavati le mani prima di mangiare", "Wasch dir die Hände vor dem Essen"],
    ["Eu escovo os dentes", "I brush my teeth", "Me lavo los dientes", "Je me brosse les dents", "Mi lavo i denti", "Ich putze mir die Zähne"],
    ["Ele quebrou o braço", "He broke his arm", "Se rompió el brazo", "Il s'est cassé le bras", "Si è rotto il braccio", "Er hat sich den Arm gebrochen"],
  ],
  dialogo: [
    ["A", "O que aconteceu com o seu braço?", "What happened to your arm?", "¿Qué te ha pasado en el brazo?", "Qu'est-ce qui est arrivé à ton bras ?", "Cosa ti è successo al braccio?", "Was ist mit deinem Arm passiert?"],
    ["B", "Eu caí jogando futebol.", "I fell playing soccer.", "Me caí jugando al fútbol.", "Je suis tombé en jouant au foot.", "Sono caduto giocando a calcio.", "Ich bin beim Fußballspielen hingefallen."],
    ["A", "Está doendo?", "Does it hurt?", "¿Te duele?", "Ça fait mal ?", "Ti fa male?", "Tut es weh?"],
    ["B", "Um pouco, mas estou bem.", "A little, but I'm fine.", "Un poco, pero estoy bien.", "Un peu, mais ça va.", "Un po', ma sto bene.", "Ein bisschen, aber es geht mir gut."],
  ],
  notas: {
    en: ["My hand, e não “the hand”", "Com partes do corpo, o inglês usa o possessivo: <b>I brush my teeth</b>, <b>He broke his arm</b>. Plurais irregulares: <b>tooth → teeth</b>, <b>foot → feet</b>. E <b>hair</b> é incontável: <b>long hair</b>, nunca “hairs” para o cabelo da cabeça.",
      [["I brush my teeth.", "Eu escovo os dentes."], ["She has long hair.", "Ela tem cabelo comprido."]]],
    es: ["Largo é comprido!", "Cuidado: <b>largo</b> em espanhol é comprido (o nosso largo é <b>ancho</b>). Com o corpo, usa-se artigo e verbo reflexivo: <b>Me lavo las manos</b>. Dor: <b>Me duele la cabeza</b> (literalmente “me dói a cabeça”).",
      [["Tiene el pelo largo.", "Tem o cabelo comprido."], ["Me duele la cabeza.", "Estou com dor de cabeça."]]],
    fr: ["J'ai mal à...", "Dor é <b>avoir mal à</b>: <b>J'ai mal à la tête</b>, <b>J'ai mal aux dents</b>. Cabelo é sempre plural: <b>les cheveux</b>. Com o corpo, usa-se artigo e verbo pronominal: <b>Je me brosse les dents</b>.",
      [["J'ai mal à la tête.", "Estou com dor de cabeça."], ["Elle a les cheveux longs.", "Ela tem cabelo comprido."]]],
    it: ["Plurais estranhos do corpo", "Algumas partes do corpo têm plural irregular: <b>il braccio → le braccia</b>, <b>la mano → le mani</b>, <b>l'orecchio → le orecchie</b>. Cabelo vai no plural: <b>i capelli</b>. E <b>testa</b> é cabeça (a testa é <b>fronte</b>). Dor: <b>Mi fa male il braccio</b>.",
      [["Mi fa male la testa.", "Estou com dor de cabeça."], ["Ha i capelli lunghi.", "Tem o cabelo comprido."]]],
    de: ["Tut weh e o dativo do corpo", "Dor: <b>Mein Kopf tut weh</b> ou <b>Ich habe Kopfschmerzen</b>. Com o corpo, usa-se um pronome reflexivo: <b>Ich putze mir die Zähne</b> (literalmente “eu limpo a mim os dentes”). E todo substantivo começa com maiúscula.",
      [["Mein Zahn tut weh.", "Meu dente está doendo."], ["Ich putze mir die Zähne.", "Eu escovo os dentes."]]],
  },
};

COMPLEMENTOS.roupas = {
  palavras: [
    ["Óculos", "Glasses", "Gafas", "Lunettes", "Occhiali", "Brille", "👓"],
    ["Bolsa", "Bag", "Bolso", "Sac", "Borsa", "Tasche", "👜"],
    ["Cachecol", "Scarf", "Bufanda", "Écharpe", "Sciarpa", "Schal", "🧣"],
    ["Tênis", "Sneakers", "Zapatillas", "Baskets", "Scarpe da ginnastica", "Turnschuhe", "👟"],
  ],
  frases: [
    ["Posso experimentar?", "Can I try it on?", "¿Me lo puedo probar?", "Je peux l'essayer ?", "Posso provarlo?", "Kann ich das anprobieren?"],
    ["Essa camisa fica bem em você", "That shirt looks good on you", "Esa camisa te queda bien", "Cette chemise te va bien", "Questa camicia ti sta bene", "Das Hemd steht dir gut"],
    ["Eu uso óculos", "I wear glasses", "Llevo gafas", "Je porte des lunettes", "Porto gli occhiali", "Ich trage eine Brille"],
    ["Tem em outra cor?", "Do you have it in another color?", "¿Lo tiene en otro color?", "Vous l'avez dans une autre couleur ?", "Ce l'ha in un altro colore?", "Haben Sie das in einer anderen Farbe?"],
  ],
  dialogo: [
    ["A", "Posso experimentar essa camisa?", "Can I try on this shirt?", "¿Me puedo probar esta camisa?", "Je peux essayer cette chemise ?", "Posso provare questa camicia?", "Kann ich dieses Hemd anprobieren?"],
    ["B", "Claro! O provador é ali.", "Sure! The fitting room is over there.", "¡Claro! El probador está ahí.", "Bien sûr ! La cabine d'essayage est là-bas.", "Certo! Il camerino è lì.", "Klar! Die Umkleidekabine ist dort."],
    ["A", "Ficou um pouco grande. Tem menor?", "It's a bit big. Do you have a smaller one?", "Me queda un poco grande. ¿La tiene más pequeña?", "Elle est un peu grande. Vous l'avez en plus petit ?", "È un po' grande. Ce l'ha più piccola?", "Es ist etwas zu groß. Haben Sie es kleiner?"],
    ["B", "Tenho, sim. E fica bem em você!", "Yes, we do. And it looks good on you!", "Sí, la tengo. ¡Y te queda bien!", "Oui. Et elle vous va bien !", "Sì, ce l'ho. E le sta bene!", "Ja, habe ich. Und es steht Ihnen gut!"],
  ],
  notas: {
    en: ["Wear, e não “use”", "Para roupas e acessórios, o verbo é <b>wear</b>: <b>I wear glasses</b>, <b>She's wearing a dress</b>. Provar é <b>try on</b>. Para dizer que algo fica bem: <b>It looks good on you</b>. E <b>pants</b> é calça nos EUA; no Reino Unido é <b>trousers</b>, porque lá <b>pants</b> é cueca!",
      [["I wear glasses.", "Eu uso óculos."], ["Can I try it on?", "Posso experimentar?"]]],
    es: ["Llevar e quedar bien", "Usar roupa é <b>llevar</b>: <b>Llevo gafas</b>. Provar é <b>probarse</b>. Para “fica bem em você”: <b>Te queda bien</b>. Cuidado: <b>bolso</b> é a bolsa de mão; o bolso da calça é <b>bolsillo</b>.",
      [["Llevo gafas.", "Uso óculos."], ["Te queda muy bien.", "Fica muito bem em você."]]],
    fr: ["Porter e aller bien", "Usar roupa é <b>porter</b>: <b>Je porte des lunettes</b>. Provar é <b>essayer</b>. Para elogiar: <b>Ça te va bien</b>. <b>Lunettes</b> e <b>vêtements</b> (roupas) estão sempre no plural.",
      [["Je porte des lunettes.", "Uso óculos."], ["Ça te va bien !", "Fica bem em você!"]]],
    it: ["Portare e stare bene", "Usar roupa é <b>portare</b> ou <b>indossare</b>. Provar é <b>provare</b>. Elogio: <b>Ti sta bene!</b>. E <b>Ce l'ha?</b> é o jeito comum de perguntar “o senhor tem?” numa loja.",
      [["Porto gli occhiali.", "Uso óculos."], ["Ti sta benissimo!", "Ficou ótimo em você!"]]],
    de: ["Tragen e stehen", "Usar roupa é <b>tragen</b>: <b>Ich trage eine Brille</b> (em alemão, óculos é singular!). Provar é <b>anprobieren</b>, verbo que se separa: <b>Ich probiere es an</b>. Elogio: <b>Das steht dir gut</b>.",
      [["Ich trage eine Brille.", "Uso óculos."], ["Das steht dir gut!", "Fica bem em você!"]]],
  },
};

COMPLEMENTOS.casa = {
  palavras: [
    ["Sofá", "Sofa", "Sofá", "Canapé", "Divano", "Sofa", "🛋️"],
    ["Chuveiro", "Shower", "Ducha", "Douche", "Doccia", "Dusche", "🚿"],
    ["Espelho", "Mirror", "Espejo", "Miroir", "Specchio", "Spiegel", "🪞"],
    ["Geladeira", "Fridge", "Nevera", "Frigo", "Frigorifero", "Kühlschrank", "🧊"],
  ],
  frases: [
    ["Tem uma geladeira na cozinha", "There is a fridge in the kitchen", "Hay una nevera en la cocina", "Il y a un frigo dans la cuisine", "C'è un frigorifero in cucina", "In der Küche gibt es einen Kühlschrank"],
    ["O controle está embaixo do sofá", "The remote is under the sofa", "El mando está debajo del sofá", "La télécommande est sous le canapé", "Il telecomando è sotto il divano", "Die Fernbedienung ist unter dem Sofa"],
    ["Eu moro em um apartamento", "I live in an apartment", "Vivo en un piso", "J'habite dans un appartement", "Abito in un appartamento", "Ich wohne in einer Wohnung"],
    ["Fique à vontade!", "Make yourself at home!", "¡Estás en tu casa!", "Fais comme chez toi !", "Fai come se fossi a casa tua!", "Fühl dich wie zu Hause!"],
  ],
  dialogo: [
    ["A", "Bem-vindo! Fique à vontade.", "Welcome! Make yourself at home.", "¡Bienvenido! Estás en tu casa.", "Bienvenue ! Fais comme chez toi.", "Benvenuto! Fai come se fossi a casa tua.", "Willkommen! Fühl dich wie zu Hause."],
    ["B", "Obrigado! Sua casa é linda.", "Thanks! Your house is beautiful.", "¡Gracias! Tu casa es preciosa.", "Merci ! Ta maison est magnifique.", "Grazie! La tua casa è bellissima.", "Danke! Dein Haus ist wunderschön."],
    ["A", "O banheiro é ali, perto da escada.", "The bathroom is over there, next to the stairs.", "El baño está allí, al lado de la escalera.", "La salle de bains est là-bas, à côté de l'escalier.", "Il bagno è lì, accanto alle scale.", "Das Bad ist da drüben, neben der Treppe."],
    ["B", "Tem água na geladeira?", "Is there any water in the fridge?", "¿Hay agua en la nevera?", "Il y a de l'eau dans le frigo ?", "C'è dell'acqua nel frigorifero?", "Gibt es Wasser im Kühlschrank?"],
  ],
  notas: {
    en: ["There is / there are, e não “have”", "Para dizer que algo existe num lugar, use <b>there is</b> (singular) e <b>there are</b> (plural): <b>There's a fridge in the kitchen</b>. O brasileiro tende a dizer “have”, que é possuir. Na pergunta: <b>Is there any water?</b>",
      [["There are two bedrooms.", "Tem dois quartos."], ["Is there any water in the fridge?", "Tem água na geladeira?"]]],
    es: ["Hay para existir, estar para localizar", "Para existir, use <b>hay</b> (igual no plural): <b>Hay dos baños</b>. Para localizar algo definido, use <b>estar</b>: <b>El baño está allí</b>. Nunca “hay el baño”.",
      [["Hay una nevera en la cocina.", "Tem uma geladeira na cozinha."], ["La llave está en la mesa.", "A chave está na mesa."]]],
    fr: ["Il y a e chez", "Existir é <b>il y a</b>: <b>Il y a un frigo</b>. E a palavrinha <b>chez</b> quer dizer “na casa de”: <b>chez moi</b> (na minha casa), <b>chez Paul</b> (na casa do Paul).",
      [["Il y a deux chambres.", "Tem dois quartos."], ["On va chez moi ?", "Vamos para a minha casa?"]]],
    it: ["C'è, ci sono e in cucina", "Existir: <b>c'è</b> e <b>ci sono</b>. Com cômodos da casa, o italiano usa <b>in</b> sem artigo: <b>in cucina</b>, <b>in bagno</b>, <b>in camera</b>. E “em casa” é <b>a casa</b>.",
      [["C'è un divano in salotto.", "Tem um sofá na sala."], ["Sono a casa.", "Estou em casa."]]],
    de: ["Es gibt e os três artigos", "Existir é <b>es gibt</b>: <b>Es gibt einen Kühlschrank</b>. Aprenda cada palavra com o artigo, porque ele muda tudo: <b>der Tisch</b>, <b>die Tür</b>, <b>das Bett</b>. “Em casa” é <b>zu Hause</b>; “para casa” é <b>nach Hause</b>.",
      [["Es gibt zwei Schlafzimmer.", "Tem dois quartos."], ["Ich bin zu Hause.", "Estou em casa."]]],
  },
};

COMPLEMENTOS.clima = {
  palavras: [
    ["Verão", "Summer", "Verano", "Été", "Estate", "Sommer", "🏖️"],
    ["Inverno", "Winter", "Invierno", "Hiver", "Inverno", "Winter", "⛄"],
    ["Primavera", "Spring", "Primavera", "Printemps", "Primavera", "Frühling", "🌷"],
    ["Outono", "Fall", "Otoño", "Automne", "Autunno", "Herbst", "🍂"],
  ],
  frases: [
    ["Como está o tempo hoje?", "What's the weather like today?", "¿Qué tiempo hace hoy?", "Quel temps fait-il aujourd'hui ?", "Che tempo fa oggi?", "Wie ist das Wetter heute?"],
    ["Está fazendo trinta graus", "It's thirty degrees", "Hace treinta grados", "Il fait trente degrés", "Ci sono trenta gradi", "Es sind dreißig Grad"],
    ["Leve um guarda-chuva", "Take an umbrella", "Llévate un paraguas", "Prends un parapluie", "Prendi un ombrello", "Nimm einen Regenschirm mit"],
    ["Eu adoro o verão", "I love summer", "Me encanta el verano", "J'adore l'été", "Adoro l'estate", "Ich liebe den Sommer"],
  ],
  dialogo: [
    ["A", "Como está o tempo aí?", "What's the weather like there?", "¿Qué tiempo hace allí?", "Quel temps fait-il là-bas ?", "Che tempo fa lì?", "Wie ist das Wetter bei euch?"],
    ["B", "Está chovendo muito e faz frio.", "It's raining a lot and it's cold.", "Está lloviendo mucho y hace frío.", "Il pleut beaucoup et il fait froid.", "Piove molto e fa freddo.", "Es regnet stark und es ist kalt."],
    ["A", "Aqui está sol e trinta graus!", "It's sunny and thirty degrees here!", "¡Aquí hace sol y treinta grados!", "Ici, il fait beau et trente degrés !", "Qui c'è il sole e ci sono trenta gradi!", "Hier scheint die Sonne und es sind dreißig Grad!"],
    ["B", "Que inveja! Eu adoro o verão.", "I'm so jealous! I love summer.", "¡Qué envidia! Me encanta el verano.", "Je suis jaloux ! J'adore l'été.", "Che invidia! Adoro l'estate.", "Ich bin so neidisch! Ich liebe den Sommer."],
  ],
  notas: {
    en: ["It's raining: o tempo também tem sujeito", "Em inglês, até o tempo precisa de sujeito: <b>It's raining</b>, <b>It's cold</b>, <b>It's sunny</b>. Nada de começar com “Is raining”. Estações vêm sem artigo: <b>I love summer</b>. Nos EUA a temperatura é em Fahrenheit: 86 °F são 30 °C.",
      [["It's cold today.", "Está frio hoje."], ["What's the weather like?", "Como está o tempo?"]]],
    es: ["Hace frío, hace calor", "Para o tempo, o espanhol usa <b>hacer</b>: <b>hace frío</b>, <b>hace calor</b>, <b>hace sol</b>, <b>hace viento</b>. Para chuva e neve, o próprio verbo: <b>llueve</b>, <b>nieva</b>.",
      [["Hace mucho calor.", "Está muito calor."], ["Hoy llueve.", "Hoje está chovendo."]]],
    fr: ["Il fait beau", "O tempo usa <b>il fait</b>: <b>il fait beau</b> (tempo bom), <b>il fait froid</b>, <b>il fait chaud</b>. Chuva e neve: <b>il pleut</b>, <b>il neige</b>. Estações: <b>en été</b>, <b>en hiver</b>, mas <b>au printemps</b>.",
      [["Il fait froid.", "Está frio."], ["Au printemps, il pleut.", "Na primavera, chove."]]],
    it: ["Fa freddo e c'è il sole", "Temperatura usa <b>fare</b>: <b>fa freddo</b>, <b>fa caldo</b>. Sol e vento: <b>c'è il sole</b>, <b>c'è vento</b>. Chuva: <b>piove</b>. E <b>estate</b> é verão, não “estado”!",
      [["Oggi fa caldo.", "Hoje está calor."], ["Piove da ieri.", "Está chovendo desde ontem."]]],
    de: ["Es ist kalt e mir ist kalt", "Como no inglês, o tempo usa o sujeito <b>es</b>: <b>Es ist kalt</b>, <b>Es regnet</b>, <b>Es schneit</b>. Cuidado: <b>Mir ist kalt</b> é “estou com frio”, mas <b>Ich bin kalt</b> é “eu sou frio”, sem sentimentos!",
      [["Es regnet heute.", "Está chovendo hoje."], ["Mir ist kalt.", "Estou com frio."]]],
  },
};
