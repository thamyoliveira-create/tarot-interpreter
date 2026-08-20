import React, { useState } from 'react';
import { TarotReading } from '../types/tarot';
import { ReadingForm } from '../components/ReadingForm';
import {
  interpretTarotReading,
  generateInterpretationPrompt,
} from '../services/tarotInterpreter';
import { storageService } from '../services/storage';

interface NewReadingProps {
  onReadingComplete: (reading: TarotReading) => void;
}

export const NewReading: React.FC<NewReadingProps> = ({ onReadingComplete }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (
    formData: Omit<TarotReading, 'id' | 'createdAt'>
  ) => {
    setIsLoading(true);

    try {
      const readingId = 'reading_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      const createdAt = new Date().toISOString();

      const partialReading: TarotReading = {
        ...formData,
        id: readingId,
        createdAt,
      };

      // Gera o prompt de IA
      const rawPrompt = generateInterpretationPrompt(partialReading);
      partialReading.rawAiPrompt = rawPrompt;

      // Executa a interpretação (com motor RWS embutido ou Gemini se configurado)
      const apiKey = storageService.getApiKey();
      const structuredResult = await interpretTarotReading(partialReading, apiKey);

      const completeReading: TarotReading = {
        ...partialReading,
        structuredInterpretation: structuredResult,
      };

      // Salva no LocalStorage
      storageService.saveReading(completeReading);

      // Conclui e exibe
      onReadingComplete(completeReading);
    } catch (error) {
      console.error('Erro durante a interpretação:', error);
      alert('Ocorreu um erro ao processar a interpretação da tiragem. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Hero / Introdução */}
      <div className="text-center space-y-3 pt-2 pb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <span>🔮</span>
          <span>Interpretação Rider-Waite-Smith</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold font-serif text-zinc-100 tracking-wide">
          Nova Interpretação de Tarot
        </h1>

        <p className="text-xs md:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Tire suas cartas com seu baralho físico e informe-as abaixo. O aplicativo analisa a
          combinação, orientações e posições segundo a tradição simbólica clássica do Rider-Waite.
        </p>
      </div>

      {/* Formulário Principal */}
      <ReadingForm onSubmit={handleFormSubmit} isLoading={isLoading} />
    </div>
  );
};
