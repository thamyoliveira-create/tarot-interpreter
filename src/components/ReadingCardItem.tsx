import React from 'react';
import { ReadingCard, CardOrientation } from '../types/tarot';
import { TAROT_CARDS_MAP } from '../data/tarotCards';
import { TarotCardSelector } from './TarotCardSelector';

interface ReadingCardItemProps {
  index: number;
  readingCard: ReadingCard;
  onUpdateCard: (index: number, updated: ReadingCard) => void;
  onRemoveCard: (index: number) => void;
  canRemove: boolean;
}

export const ReadingCardItem: React.FC<ReadingCardItemProps> = ({
  index,
  readingCard,
  onUpdateCard,
  onRemoveCard,
  canRemove,
}) => {
  const cardData = TAROT_CARDS_MAP.get(readingCard.cardId);

  const handleSelectCardId = (cardId: string) => {
    onUpdateCard(index, { ...readingCard, cardId });
  };

  const handleOrientationToggle = (orientation: CardOrientation) => {
    onUpdateCard(index, { ...readingCard, orientation });
  };

  const handlePositionChange = (position: string) => {
    onUpdateCard(index, { ...readingCard, position });
  };

  return (
    <div className="relative p-4 md:p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-amber-500/30 transition-all shadow-md group">
      {/* Header do Card */}
      <div className="flex items-center justify-between gap-3 mb-3.5 pb-2.5 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold font-serif">
            {index + 1}
          </span>
          <h4 className="text-sm font-semibold text-zinc-200 font-serif">
            Carta {index + 1}
          </h4>
        </div>

        {canRemove && (
          <button
            type="button"
            onClick={() => onRemoveCard(index)}
            className="text-xs text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 px-2.5 py-1 rounded-md border border-transparent hover:border-rose-800/40 transition-colors flex items-center gap-1"
            title="Remover esta carta da tiragem"
          >
            <span>🗑️</span>
            <span>Remover</span>
          </button>
        )}
      </div>

      {/* Grid de Configurações da Carta */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
        {/* Seleção da Carta (78 cartas) */}
        <div className="md:col-span-6">
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
            Carta <span className="text-amber-400">*</span>
          </label>
          <TarotCardSelector
            selectedCardId={readingCard.cardId}
            onSelectCard={handleSelectCardId}
          />
        </div>

        {/* Orientação (Normal / Invertida) */}
        <div className="md:col-span-3">
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
            Orientação
          </label>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-950 rounded-lg border border-zinc-800">
            <button
              type="button"
              onClick={() => handleOrientationToggle('upright')}
              className={`py-1.5 px-2 rounded text-xs font-medium transition-all text-center flex items-center justify-center gap-1 ${
                readingCard.orientation === 'upright'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>⬆️</span>
              <span>Normal</span>
            </button>
            <button
              type="button"
              onClick={() => handleOrientationToggle('reversed')}
              className={`py-1.5 px-2 rounded text-xs font-medium transition-all text-center flex items-center justify-center gap-1 ${
                readingCard.orientation === 'reversed'
                  ? 'bg-purple-900/80 text-purple-200 font-bold border border-purple-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>🔄</span>
              <span>Invertida</span>
            </button>
          </div>
        </div>

        {/* Posição na Tiragem (Opcional) */}
        <div className="md:col-span-3">
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
            Posição na tiragem <span className="text-zinc-500 text-[10px]">(opcional)</span>
          </label>
          <input
            type="text"
            value={readingCard.position || ''}
            onChange={(e) => handlePositionChange(e.target.value)}
            placeholder="Ex: situação atual, desafio..."
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-lg text-xs text-zinc-100 placeholder-zinc-600 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Mini Resumo das Palavras-Chave da Carta Selecionada */}
      {cardData && (
        <div className="mt-3 pt-2.5 border-t border-zinc-800/50 flex items-center gap-2 flex-wrap text-xs text-zinc-400">
          <span className="text-[11px] text-zinc-500 font-medium">
            {readingCard.orientation === 'upright' ? 'Aspectos normais:' : 'Aspectos invertidos:'}
          </span>
          {(readingCard.orientation === 'upright'
            ? cardData.upright.keywords
            : cardData.reversed.keywords
          )
            .slice(0, 4)
            .map((kw, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded bg-zinc-950/80 border border-zinc-800 text-zinc-300 text-[11px]"
              >
                {kw}
              </span>
            ))}
        </div>
      )}
    </div>
  );
};
