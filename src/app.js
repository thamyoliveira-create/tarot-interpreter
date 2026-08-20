// Browser ES module entry point for standalone preview & production
import { TAROT_CARDS, TAROT_CARDS_MAP } from './data/tarotCards.js';
import { storageService } from './services/storage.js';
import { generateInterpretationPrompt, interpretTarotReading } from './services/tarotInterpreter.js';

// Export for window access if needed
window.TarotApp = {
  TAROT_CARDS,
  TAROT_CARDS_MAP,
  storageService,
  generateInterpretationPrompt,
  interpretTarotReading,
};
