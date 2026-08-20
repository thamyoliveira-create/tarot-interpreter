import React from 'react';
import { TarotReading } from '../types/tarot';
import { InterpretationResultView } from '../components/InterpretationResultView';

interface ReadingResultProps {
  reading: TarotReading;
  onNewReading: () => void;
  onGoToHistory: () => void;
}

export const ReadingResult: React.FC<ReadingResultProps> = ({
  reading,
  onNewReading,
  onGoToHistory,
}) => {
  return (
    <div className="pt-2 animate-fadeIn">
      <InterpretationResultView
        reading={reading}
        onNewReading={onNewReading}
        onGoToHistory={onGoToHistory}
      />
    </div>
  );
};
