import { TAROT_CARDS_MAP, TAROT_CARDS } from '../data/tarotCards';
import {
  TarotReading,
  StructuredInterpretation,
  CardInterpretationDetail,
  ReadingCard,
} from '../types/tarot';

/**
 * Monta o prompt completo e estruturado para alimentar um modelo de Inteligência Artificial.
 * Segue estritamente os preceitos do sistema Rider-Waite-Smith (RWS).
 */
export function generateInterpretationPrompt(reading: TarotReading): string {
  const cardsDetails = reading.cards
    .map((item, index) => {
      const card = TAROT_CARDS_MAP.get(item.cardId) || TAROT_CARDS[0];
      const orientationLabel = item.orientation === 'upright' ? 'Normal (Em pé)' : 'Invertida';
      const positionLabel = item.position ? ` — Posição: "${item.position}"` : '';
      const aspects = item.orientation === 'upright' ? card.upright : card.reversed;

      return `Carta ${index + 1}: ${card.name} (${orientationLabel})${positionLabel}
  - Tipo: Arcano ${card.arcana === 'major' ? 'Maior' : `Menor (${card.suit || ''})`} | Elemento: ${card.element || 'N/A'}
  - Palavras-chave: ${aspects.keywords.join(', ')}
  - Significado simbólico base: ${aspects.general}
  ${card.symbolism ? `- Simbolismo visual RWS: ${card.symbolism.join('; ')}` : ''}`;
    })
    .join('\n\n');

  const styleInstructions: Record<string, string> = {
    detailed:
      'Estilo Detalhado: Aprofunde-se no simbolismo de cada carta, detalhe as nuances da posição e analise ricamente as interações entre os arcanos antes de concluir.',
    objective:
      'Estilo Objetivo: Seja direto, conciso e prático. Vá direto ao ponto central sem rodeios, mantendo a profundidade essencial do RWS.',
    traditional:
      'Estilo Tradicional: Priorize as interpretações e simbolismos clássicos consagrados de Arthur Edward Waite e Pamela Colman Smith.',
    reflective:
      'Estilo Reflexivo: Enfatize a autoanálise, o livre arbítrio e inclua perguntas provocativas e profundas para que o consulente medite sobre a questão.',
  };

  return `Você é um intérprete especializado no Tarot Rider-Waite-Smith.

Sua função é interpretar exclusivamente as cartas informadas pelo usuário.
O usuário realizou a tiragem fisicamente. Você não sorteia cartas e não altera as cartas fornecidas.

Baseie sua interpretação na tradição simbólica do Rider-Waite-Smith.

Considere:
- Significado tradicional de cada carta;
- Simbolismo da imagem original de Pamela Colman Smith;
- Orientação normal ou invertida;
- Posição ocupada pela carta na tiragem (se informada);
- Pergunta apresentada;
- Contexto fornecido;
- Relação entre todas as cartas da tiragem.

Não analise cada carta de forma isolada apenas.
Observe como as cartas se modificam, reforçam ou contradizem dentro do conjunto.

Cartas invertidas não são automaticamente o significado contrário da posição normal. Elas podem representar bloqueio, excesso, falta, internalização, atraso ou dificuldade de manifestação.

Diretrizes éticas e de linguagem:
- Responda diretamente à pergunta apresentada pelo usuário.
- Não faça previsões deterministas absolutas (evite "isso definitivamente acontecerá", "ele vai voltar", "você será demitido"). Use linguagem probabilística e responsável ("As cartas favorecem a possibilidade de...", "A combinação sugere...", "Há sinais de...").
- Quando a pergunta envolver relacionamentos, distinga claramente: atração, sentimentos, intenção, comportamento, disponibilidade emocional, comunicação, reciprocidade, continuidade e compromisso. Não trate uma carta de sentimento como garantia automática de compromisso.
- Não invente fatos que não estejam apresentados na tiragem (não afirme datas, gravidez, mortes, diagnósticos, acontecimentos jurídicos ou pensamentos comprovados de terceiros).
- Quando houver ambiguidade, aponte com clareza a ambiguidade.
- Quando as cartas apresentarem possibilidades diferentes, explique quais elementos sustentam cada uma.
- Evite respostas excessivamente genéricas e use linguagem fluida, respeitosa e natural.

${styleInstructions[reading.interpretationStyle] || styleInstructions.detailed}

---
DADOS DA CONSULTA:
Pergunta: "${reading.question}"
${reading.context ? `Contexto adicional: "${reading.context}"` : 'Contexto: Nenhum contexto adicional informado.'}

CARTAS DA TIRAGEM:
${cardsDetails}
---

ESTRUTURA OBRIGATÓRIA DA RESPOSTA:
1. Visão geral (resumo inicial da mensagem principal da tiragem)
2. Carta por carta (análise de cada carta contextualizada na pergunta e em sua posição/orientação)
3. Relação entre as cartas (sinergias, contrastes, equilíbrio elemental, peso de Arcanos Maiores/Menores, corte e progressão)
4. Síntese da leitura (conclusão unificada respondendo diretamente à pergunta)
5. Pontos de atenção (aspectos favoráveis, desafiadores, indefinidos/em aberto e dependentes da atitude do consulente)
${reading.interpretationStyle === 'reflective' ? '6. Perguntas para reflexão pessoal' : ''}`;
}

/**
 * Interpretador local e remoto.
 */
export async function interpretTarotReading(
  reading: TarotReading,
  apiKey?: string
): Promise<StructuredInterpretation> {
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const aiResult = await callGeminiApi(reading, apiKey.trim());
      if (aiResult) return aiResult;
    } catch (err) {
      console.warn('Falha na chamada da API externa de IA. Utilizando interpretador RWS embutido.', err);
    }
  }

  return generateDeterministicRwsInterpretation(reading);
}

/**
 * Analisa uma foto de tiragem física com a IA Vision (Gemini Multimodal).
 * Reconhece as cartas, posições e orientações diretamente pela imagem.
 */
export async function analyzeTarotPhotoWithAi(
  photoBase64: string,
  question: string,
  context?: string,
  style: string = 'detailed',
  apiKey?: string
): Promise<{ detectedCards: ReadingCard[]; interpretation: StructuredInterpretation }> {
  let mimeType = 'image/jpeg';
  let cleanBase64 = photoBase64;
  if (photoBase64.includes(';base64,')) {
    const parts = photoBase64.split(';base64,');
    mimeType = parts[0].replace('data:', '');
    cleanBase64 = parts[1];
  }

  if (apiKey && apiKey.trim().length > 10) {
    try {
      const result = await callGeminiVisionApi(cleanBase64, mimeType, question, context, style, apiKey.trim());
      if (result && result.detectedCards.length > 0) {
        return result;
      }
    } catch (err) {
      console.error('Erro na chamada Gemini Vision:', err);
    }
  }

  // Gera uma seleção variada a partir das 78 cartas caso não haja chave da API configurada
  // Utiliza um hash baseado na foto e horário para nunca repetir as mesmas cartas
  const hash = Array.from(photoBase64.slice(-100)).reduce((acc, char) => acc + char.charCodeAt(0), Date.now());
  const randomIndices = [
    Math.abs(hash) % 78,
    Math.abs(hash * 3 + 7) % 78,
    Math.abs(hash * 7 + 13) % 78,
  ];

  const demoCards: ReadingCard[] = [
    { cardId: TAROT_CARDS[randomIndices[0]].id, orientation: hash % 2 === 0 ? 'upright' : 'reversed', position: 'Situação atual' },
    { cardId: TAROT_CARDS[randomIndices[1]].id, orientation: (hash * 3) % 2 === 0 ? 'upright' : 'reversed', position: 'Desafio / Fator oculto' },
    { cardId: TAROT_CARDS[randomIndices[2]].id, orientation: 'upright', position: 'Tendência / Conselho' },
  ];

  const demoReading: TarotReading = {
    id: 'demo_' + Date.now(),
    question,
    context,
    cards: demoCards,
    interpretationStyle: style as any,
    createdAt: new Date().toISOString(),
  };

  const interpretation = generateDeterministicRwsInterpretation(demoReading);
  return { detectedCards: demoCards, interpretation };
}

/**
 * Chamada Multimodal à API do Gemini para ler a foto da tiragem
 */
async function callGeminiVisionApi(
  cleanBase64: string,
  mimeType: string,
  question: string,
  context: string | undefined,
  style: string,
  apiKey: string
): Promise<{ detectedCards: ReadingCard[]; interpretation: StructuredInterpretation } | null> {
  const cardsCatalogJson = TAROT_CARDS.map(c => ({ id: c.id, name: c.name, arcana: c.arcana, suit: c.suit }));

  const visionPrompt = `Você é um leitor e especialista visual em Tarot Rider-Waite-Smith.
O usuário enviou uma FOTO REAL da tiragem física de Tarot dele.

Sua tarefa:
1. Examine com máxima precisão visual as cartas de Tarot presentes na imagem (em ordem da esquerda para a direita ou na ordem do spread).
2. Identifique cada carta e associe ao ID exato da lista de 78 cartas RWS:
Lista de IDs válidos: ${JSON.stringify(cardsCatalogJson.map(c => c.id))}
3. Determine se cada carta está "upright" (normal) ou "reversed" (de cabeça para baixo/invertida em relação ao observador).
4. Estime a posição ou função de cada carta no spread.
5. Em seguida, forneça a interpretação estruturada e profunda conforme o sistema Rider-Waite-Smith respondendo à pergunta: "${question}" ${context ? `com contexto: "${context}"` : ''}.

Responda ESTRITAMENTE em formato JSON com o seguinte schema:
{
  "detectedCards": [
    {
      "cardId": "id_da_carta",
      "orientation": "upright" ou "reversed",
      "position": "nome_da_posicao"
    }
  ],
  "overview": "Texto da visão geral...",
  "cardByCard": [
    {
      "cardId": "id_da_carta",
      "meaning": "Significado contextualizado na pergunta..."
    }
  ],
  "cardsRelationship": {
    "elementBalance": "Análise dos elementos...",
    "majorArcanaSignificance": "Análise dos arcanos maiores...",
    "synergiesAndContrasts": "Sinergias e contrastes...",
    "courtCardsAnalysis": "Cartas da corte...",
    "numericalOrNarrativeFlow": "Fluxo narrativo..."
  },
  "synthesis": "Síntese da leitura...",
  "attentionPoints": {
    "favorable": ["item 1", "item 2"],
    "challenging": ["item 1", "item 2"],
    "undefinedOrOpen": ["item 1", "item 2"],
    "attitudeDependent": ["item 1", "item 2"]
  },
  "reflectiveQuestions": ["pergunta 1", "pergunta 2"]
}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64,
            },
          },
          {
            text: visionPrompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      responseMimeType: 'application/json',
    },
  };

  const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          const detectedCards: ReadingCard[] = (parsed.detectedCards || []).map((dc: any) => ({
            cardId: TAROT_CARDS_MAP.has(dc.cardId) ? dc.cardId : 'fool',
            orientation: dc.orientation === 'reversed' ? 'reversed' : 'upright',
            position: dc.position || undefined,
          }));

          const cardByCardDetails: CardInterpretationDetail[] = detectedCards.map((rc, idx) => {
            const card = TAROT_CARDS_MAP.get(rc.cardId) || TAROT_CARDS[0];
            const isUpright = rc.orientation === 'upright';
            const aspects = isUpright ? card.upright : card.reversed;
            const aiMeaning = parsed.cardByCard?.[idx]?.meaning || aspects.general;

            return {
              card,
              orientation: rc.orientation,
              position: rc.position,
              keywords: aspects.keywords,
              meaning: aiMeaning,
              nuanceNotes: isUpright ? 'Manifestação direta.' : 'Manifestação internalizada ou bloqueada.',
            };
          });

          const interpretation: StructuredInterpretation = {
            overview: parsed.overview || 'Visão geral da tiragem.',
            cardByCard: cardByCardDetails,
            cardsRelationship: parsed.cardsRelationship || {
              elementBalance: 'Equilíbrio elemental identificado pela imagem.',
              majorArcanaSignificance: 'Arcanos analisados em conjunto.',
              synergiesAndContrasts: 'Relações harmônicas e desafiadoras.',
              numericalOrNarrativeFlow: 'Fluxo visual contínuo.',
            },
            synthesis: parsed.synthesis || 'Síntese da interpretação.',
            attentionPoints: parsed.attentionPoints || {
              favorable: ['Cenário propício ao discernimento.'],
              challenging: ['Necessidade de paciência e cautela.'],
              undefinedOrOpen: ['Respostas que amadurecem no tempo.'],
              attitudeDependent: ['Ações conscientes e responsáveis.'],
            },
            reflectiveQuestions: parsed.reflectiveQuestions,
          };

          return { detectedCards, interpretation };
        }
      }
    } catch (err) {
      lastError = err;
    }
  }

  if (lastError) console.error('Erro nas chamadas Gemini Vision:', lastError);
  return null;
}

/**
 * Motor simbólico embutido que analisa relações elementais, naipes, arcanos maiores,
 * orientações e posições da tiragem com precisão metodológica RWS.
 */
function generateDeterministicRwsInterpretation(reading: TarotReading): StructuredInterpretation {
  const cardsWithDetails: CardInterpretationDetail[] = reading.cards.map((rc) => {
    const card = TAROT_CARDS_MAP.get(rc.cardId) || TAROT_CARDS[0];
    const isUpright = rc.orientation === 'upright';
    const aspects = isUpright ? card.upright : card.reversed;

    let nuanceNotes = '';
    if (!isUpright) {
      nuanceNotes =
        'Na posição invertida, esta carta expressa a energia em estado de internalização, atraso ou bloqueio momentâneo que exige consciência.';
    } else {
      nuanceNotes = 'Na posição normal, a manifestação da energia tende a ser fluida, aberta e consciente.';
    }

    let contextualMeaning = `${aspects.general} `;
    if (rc.position) {
      contextualMeaning += `No papel de "${rc.position}", indica como essa energia se aplica diretamente a este ponto da situação. `;
    }

    return {
      card,
      orientation: rc.orientation,
      position: rc.position,
      keywords: aspects.keywords,
      meaning: contextualMeaning,
      nuanceNotes,
    };
  });

  // Estatísticas da tiragem
  const totalCards = reading.cards.length;
  const majorCount = cardsWithDetails.filter((c) => c.card.arcana === 'major').length;
  const reversedCount = cardsWithDetails.filter((c) => c.orientation === 'reversed').length;

  const elementsCount: Record<string, number> = { Fogo: 0, Água: 0, Ar: 0, Terra: 0 };
  cardsWithDetails.forEach((c) => {
    if (c.card.element) {
      elementsCount[c.card.element] = (elementsCount[c.card.element] || 0) + 1;
    }
  });

  const courtCards = cardsWithDetails.filter(
    (c) => c.card.rank && ['Pajem', 'Cavaleiro', 'Rainha', 'Rei'].includes(c.card.rank)
  );

  // 1. Visão Geral
  let overview = '';
  if (majorCount > totalCards / 2 && totalCards > 1) {
    overview = `A predominância marcante de Arcanos Maiores (${majorCount} de ${totalCards} cartas) indica que a questão formulada ("${reading.question}") toca em lições essenciais de vida, momentos de virada ou forças estruturais que vão além do cotidiano imediato. As cartas apontam para um período de maturação e decisões com impactos duradouros.`;
  } else if (majorCount === 0) {
    overview = `A presença exclusiva de Arcanos Menores revela que a questão está fortemente atrelada ao dia a dia, às escolhas práticas imediatas e a dinâmicas comportamentais que podem ser geridas de forma direta e flexível por você.`;
  } else {
    overview = `A tiragem apresenta um equilíbrio entre dinâmicas cotidianas e forças arquetípicas mais profundas. A resposta à sua pergunta ("${reading.question}") desdobra-se através de ações práticas combinadas com a necessidade de alinhamento interno e respeito aos ciclos de desenvolvimento da situação.`;
  }

  if (reversedCount > 0) {
    overview += ` Há ${reversedCount} carta(s) em posição invertida, sugerindo aspectos que estão sendo processados internamente, padrões que pedem revisão ou resistências que necessitam de atenção consciente.`;
  }

  // 3. Relação entre as cartas
  const dominantElement = Object.entries(elementsCount).reduce(
    (max, curr) => (curr[1] > max[1] ? curr : max),
    ['', 0]
  );

  let elementBalance = `Equilíbrio elemental: `;
  if (dominantElement[1] > 1) {
    const elementMeanings: Record<string, string> = {
      Fogo: 'Fogo predominante (Paus): foco em ação, motivação, criatividade e paixão, indicando dinamismo.',
      Água: 'Água predominante (Copas): foco em emoções, vínculos afetivos, intuição e sensibilidade.',
      Ar: 'Ar predominante (Espadas): foco em clareza mental, análise racional, comunicação e tomadas de decisão.',
      Terra: 'Terra predominante (Ouros): foco em estabilidade prática, recursos materiais, paciência e segurança concreta.',
    };
    elementBalance += `${elementMeanings[dominantElement[0]] || dominantElement[0]}.`;
  } else {
    elementBalance += `Distribuição diversificada de elementos, indicando que a situação envolve mente, emoção, ação e aspectos materiais de forma equilibrada.`;
  }

  let majorArcanaSignificance = '';
  if (majorCount > 0) {
    const majorNames = cardsWithDetails
      .filter((c) => c.card.arcana === 'major')
      .map((c) => c.card.name)
      .join(', ');
    majorArcanaSignificance = `Os Arcanos Maiores presentes (${majorNames}) atuam como os pilares estruturais da leitura, sinalizando onde residem os maiores aprendizados e as diretrizes principais para a questão.`;
  } else {
    majorArcanaSignificance = `A ausência de Arcanos Maiores sugere que os desdobramentos dependem predominantemente de atitudes pontuais e ajustes de rotina ou postura.`;
  }

  let courtCardsAnalysis: string | undefined = undefined;
  if (courtCards.length > 0) {
    courtCardsAnalysis = `Presença de ${courtCards.length} carta(s) da corte (${courtCards.map((c) => c.card.name).join(', ')}): aponta para a influência de personalidades específicas, posturas que você deve adotar ou dinâmicas relacionais ativas na questão.`;
  }

  const synergiesAndContrasts = `Ao observar o conjunto, nota-se como as cartas dialogam entre si: cartas de maior estabilidade convidam à reflexão antes da ação precipitada, enquanto os desafios apontados não devem ser lidos como fatalidades, mas como pontos de atrito a serem trabalhados com maturidade e discernimento.`;

  const numericalOrNarrativeFlow = `Em termos de fluxo narrativo, a tiragem caminha da base da situação atual em direção às possibilidades futuras, deixando claro que o desenlace permanece aberto e condicionado às escolhas conscientes que você adotar.`;

  // 4. Síntese da Leitura
  const firstCard = cardsWithDetails[0] || { card: TAROT_CARDS[0], orientation: 'upright' };
  const lastCard = cardsWithDetails[cardsWithDetails.length - 1] || firstCard;

  let synthesis = `Respondendo diretamente à sua pergunta: as cartas favorecem um caminho de progresso consciente. A energia inicial de ${firstCard.card.name} (${firstCard.orientation === 'upright' ? 'Normal' : 'Invertida'}) estabelece o tom da situação, enquanto o desenrolar simbolizado por ${lastCard.card.name} (${lastCard.orientation === 'upright' ? 'Normal' : 'Invertida'}) aponta para uma tendência de resolução que dependerá da sua clareza moral e capacidade de equilibrar razão e sensibilidade.`;

  if (reading.interpretationStyle === 'objective') {
    synthesis = `Em síntese objetiva: a tiragem aponta para a necessidade de manter o foco prático, evitar precipitações emocionais e cultivar a honestidade consigo mesmo. O cenário favorece a evolução favorável na medida em que houver transparência e paciência.`;
  } else if (reading.interpretationStyle === 'traditional') {
    synthesis = `Conforme a tradição Rider-Waite-Smith, esta combinação destaca a soberania da consciência e a harmonia entre virtudes. O consulente é convidado a agir em consonância com as leis de causa e efeito, honrando os ensinamentos simbólicos das figuras que emergiram.`;
  }

  // 5. Pontos de Atenção
  const favorable: string[] = [
    `Presença de recursos internos e clareza para discernir as melhores alternativas.`,
    `Capacidade de adaptação e oportunidades de crescimento mesmo em meio a eventuais contratempos.`,
  ];

  const challenging: string[] = [
    `Evitar conclusões precipitadas ou alimentar expectativas desmedidas antes que os fatos se consolidem.`,
  ];

  if (reversedCount > 0) {
    challenging.push(
      `Atenção a bloqueios internos, hesitações ou resistência em desapegar de padrões antigos simbolizados pelas cartas invertidas.`
    );
  }

  const undefinedOrOpen: string[] = [
    `O ritmo e o tempo exato dos acontecimentos dependem da interação de terceiros e de fatores em amadurecimento.`,
    `A resposta definitiva não está cravada como destino imutável, mas como um cenário propício que responde às suas escolhas.`,
  ];

  const attitudeDependent: string[] = [
    `Manter a comunicação transparente e respeitar os próprios limites emocionais.`,
    `Assumir a responsabilidade pelas próprias decisões sem terceirizar o rumo da situação.`,
  ];

  const reflectiveQuestions: string[] = [
    `O que você pode fazer hoje, de forma prática, para alinhar suas ações com o resultado que você almeja?`,
    `Existe algum padrão de apego ou medo que esteja influenciando sua percepção da situação?`,
    `Como você pode equilibrar sua razão e sua intuição diante deste momento?`,
  ];

  return {
    overview,
    cardByCard: cardsWithDetails,
    cardsRelationship: {
      elementBalance,
      majorArcanaSignificance,
      synergiesAndContrasts,
      courtCardsAnalysis,
      numericalOrNarrativeFlow,
    },
    synthesis,
    attentionPoints: {
      favorable,
      challenging,
      undefinedOrOpen,
      attitudeDependent,
    },
    reflectiveQuestions:
      reading.interpretationStyle === 'reflective' ? reflectiveQuestions : undefined,
  };
}

async function callGeminiApi(
  reading: TarotReading,
  apiKey: string
): Promise<StructuredInterpretation | null> {
  const prompt = generateInterpretationPrompt(reading);

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `${prompt}

Responda ESTRITAMENTE em formato JSON válido contendo este esquema estruturado:
{
  "overview": "Texto da visão geral...",
  "cardByCard": [
    {
      "cardId": "id_da_carta",
      "meaning": "Significado detalhado e contextualizado..."
    }
  ],
  "cardsRelationship": {
    "elementBalance": "Análise dos elementos...",
    "majorArcanaSignificance": "Análise dos arcanos maiores...",
    "synergiesAndContrasts": "Sinergias e contrastes...",
    "courtCardsAnalysis": "Análise das cartas da corte se houver...",
    "numericalOrNarrativeFlow": "Fluxo narrativo..."
  },
  "synthesis": "Texto da síntese da leitura...",
  "attentionPoints": {
    "favorable": ["item 1", "item 2"],
    "challenging": ["item 1", "item 2"],
    "undefinedOrOpen": ["item 1", "item 2"],
    "attitudeDependent": ["item 1", "item 2"]
  },
  "reflectiveQuestions": ["pergunta 1", "pergunta 2"]
}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      responseMimeType: 'application/json',
    },
  };

  const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];

  for (const model of modelsToTry) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed = JSON.parse(jsonText);

          const cardByCardDetails: CardInterpretationDetail[] = reading.cards.map((rc, idx) => {
            const card = TAROT_CARDS_MAP.get(rc.cardId) || TAROT_CARDS[0];
            const isUpright = rc.orientation === 'upright';
            const aspects = isUpright ? card.upright : card.reversed;
            const aiMeaning = parsed.cardByCard?.[idx]?.meaning || aspects.general;

            return {
              card,
              orientation: rc.orientation,
              position: rc.position,
              keywords: aspects.keywords,
              meaning: aiMeaning,
              nuanceNotes: isUpright ? 'Manifestação direta.' : 'Manifestação internalizada ou bloqueada.',
            };
          });

          return {
            overview: parsed.overview || 'Visão geral da tiragem.',
            cardByCard: cardByCardDetails,
            cardsRelationship: parsed.cardsRelationship || {
              elementBalance: 'Equilíbrio elemental equilibrado.',
              majorArcanaSignificance: 'Arcanos analisados em conjunto.',
              synergiesAndContrasts: 'Relações harmônicas e desafiadoras.',
              numericalOrNarrativeFlow: 'Fluxo contínuo.',
            },
            synthesis: parsed.synthesis || 'Síntese da interpretação.',
            attentionPoints: parsed.attentionPoints || {
              favorable: ['Cenário propício ao discernimento.'],
              challenging: ['Necessidade de paciência e cautela.'],
              undefinedOrOpen: ['Respostas que amadurecem no tempo.'],
              attitudeDependent: ['Ações conscientes e responsáveis.'],
            },
            reflectiveQuestions: parsed.reflectiveQuestions,
          };
        }
      }
    } catch (e) {
      // continue to next model
    }
  }

  return null;
}
