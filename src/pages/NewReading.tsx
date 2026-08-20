import React, { useState } from 'react';
import { TarotReading } from '../types/tarot';
import { ReadingForm } from '../components/ReadingForm';
import {
  interpretTarotReading,
  generateInterpretationPrompt,
  analyzeTarotPhotoWithAi,
} from '../services/tarotInterpreter';
import { storageService } from '../services/storage';

interface NewReadingProps {
  onReadingComplete: (reading: TarotReading) => void;
  onOpenSettings?: () => void;
}

export const NewReading: React.FC<NewReadingProps> = ({ onReadingComplete, onOpenSettings }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (
    formData: Omit<TarotReading, 'id' | 'createdAt'>
  ) => {
    setIsLoading(true);

    try {
      const readingId = 'reading_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      const createdAt = new Date().toISOString();
      const apiKey = storageService.getApiKey();

      let completeReading: TarotReading;

      if (formData.inputMode === 'photo' && formData.photoBase64) {
        // Leitura visual por IA
        const { detectedCards, interpretation } = await analyzeTarotPhotoWithAi(
          formData.photoBase64,
          formData.question,
          formData.context,
          formData.interpretationStyle,
          apiKey
        );

        completeReading = {
          ...formData,
          id: readingId,
          createdAt,
          cards: detectedCards,
          structuredInterpretation: interpretation,
        };
      } else {
        // Leitura por seleção manual de cartas
        const partialReading: TarotReading = {
          ...formData,
          id: readingId,
          createdAt,
        };

        const rawPrompt = generateInterpretationPrompt(partialReading);
        partialReading.rawAiPrompt = rawPrompt;

        const structuredResult = await interpretTarotReading(partialReading, apiKey);

        completeReading = {
          ...partialReading,
          structuredInterpretation: structuredResult,
        };
      }

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
          <span>Interpretação Rider-Waite-Smith • Manual ou Foto</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold font-serif text-zinc-100 tracking-wide">
          Nova Interpretação de Tarot
        </h1>

        <p className="text-xs md:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Tire suas cartas fisicamente e informe-as manualmente ou envie uma <strong>foto da tiragem</strong> para a IA identificar os arcanos e realizar a interpretação completa.
        </p>
      </div>

      {/* Formulário Principal */}
      <ReadingForm onSubmit={handleFormSubmit} isLoading={isLoading} onOpenSettings={onOpenSettings} />
    </div>
  );
};
