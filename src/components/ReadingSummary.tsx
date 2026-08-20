import React from 'react';
import { ReadingCard } from '../types/tarot';
import { TAROT_CARDS_MAP } from '../data/tarotCards';

interface ReadingSummaryProps {
  cards: ReadingCard[];
}

export const ReadingSummary: React.FC<ReadingSummaryProps> = ({ cards }) => {
  return (
    <div className="flex flex-wrap gap-2.5 items-center">
      {cards.map((item, index) => {
        const card = TAROT_CARDS_MAP.get(item.cardId);
        if (!card) return null;

        const isUpright = item.orientation === 'upright';

        return (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 shadow-sm"
          >
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold font-serif">
              {index + 1}
            </span>
            <span className="text-xs font-semibold text-zinc-100 font-serif">
              {card.name}
            </span>
            <span className="text-zinc-600 text-xs">•</span>
            <span
              className={`text-[11px] font-medium px-1.5 py-0.2 rounded ${
                isUpright
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                  : 'bg-purple-900/30 text-purple-300 border border-purple-500/30'
              }`}
            >
              {isUpright ? 'Normal' : 'Invertida'}
            </span>
            {item.position && (
              <>
                <span className="text-zinc-600 text-xs">•</span>
                <span className="text-[11px] text-zinc-400 italic">
                  {item.position}
                </span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
