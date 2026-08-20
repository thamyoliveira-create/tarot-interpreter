export type ArcanaType = 'major' | 'minor';
export type SuitType = 'wands' | 'cups' | 'swords' | 'pentacles';
export type CardOrientation = 'upright' | 'reversed';
export type InterpretationStyle = 'detailed' | 'objective' | 'traditional' | 'reflective';
export type InputMode = 'manual' | 'photo';

export interface CardAspects {
  keywords: string[];
  general: string;
  love?: string;
  career?: string;
  money?: string;
  feelings?: string;
  advice?: string;
  outcome?: string;
  spiritual?: string;
}

export interface TarotCard {
  id: string;
  name: string;
  number?: number;
  romanNumeral?: string;
  arcana: ArcanaType;
  suit?: SuitType;
  rank?: string;
  element?: 'Fogo' | 'Água' | 'Ar' | 'Terra';
  upright: CardAspects;
  reversed: CardAspects;
  symbolism?: string[];
}

export interface ReadingCard {
  cardId: string;
  orientation: CardOrientation;
  position?: string;
  confidence?: number;
}

export interface CardInterpretationDetail {
  card: TarotCard;
  orientation: CardOrientation;
  position?: string;
  keywords: string[];
  meaning: string;
  nuanceNotes?: string;
}

export interface AttentionPoints {
  favorable: string[];
  challenging: string[];
  undefinedOrOpen: string[];
  attitudeDependent: string[];
}

export interface StructuredInterpretation {
  overview: string;
  cardByCard: CardInterpretationDetail[];
  cardsRelationship: {
    elementBalance: string;
    majorArcanaSignificance: string;
    suitDominance?: string;
    synergiesAndContrasts: string;
    courtCardsAnalysis?: string;
    numericalOrNarrativeFlow: string;
  };
  synthesis: string;
  attentionPoints: AttentionPoints;
  reflectiveQuestions?: string[];
}

export interface TarotReading {
  id: string;
  question: string;
  context?: string;
  cards: ReadingCard[];
  interpretationStyle: InterpretationStyle;
  createdAt: string;
  photoBase64?: string;
  inputMode?: InputMode;
  structuredInterpretation?: StructuredInterpretation;
  rawAiPrompt?: string;
  aiGeneratedText?: string;
}
