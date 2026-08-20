import React, { useState } from 'react';
import { ReadingCard, InterpretationStyle, TarotReading } from '../types/tarot';
import { ReadingCardItem } from './ReadingCardItem';

interface ReadingFormProps {
  onSubmit: (readingData: Omit<TarotReading, 'id' | 'createdAt'>) => void;
  isLoading: boolean;
}

export const ReadingForm: React.FC<ReadingFormProps> = ({ onSubmit, isLoading }) => {
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [cards, setCards] = useState<ReadingCard[]>([
    { cardId: 'fool', orientation: 'upright', position: '' },
  ]);
  const [interpretationStyle, setInterpretationStyle] =
    useState<InterpretationStyle>('detailed');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Manipulação da lista de cartas
  const handleAddCard = () => {
    setCards([...cards, { cardId: '', orientation: 'upright', position: '' }]);
    setValidationError(null);
  };

  const handleUpdateCard = (index: number, updated: ReadingCard) => {
    const newCards = [...cards];
    newCards[index] = updated;
    setCards(newCards);
    setValidationError(null);
  };

  const handleRemoveCard = (index: number) => {
    if (cards.length <= 1) return;
    const newCards = cards.filter((_, i) => i !== index);
    setCards(newCards);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações amigáveis
    if (!question.trim()) {
      setValidationError('Por favor, informe a sua pergunta para orientar a interpretação das cartas.');
      return;
    }

    const unselectedCardIndex = cards.findIndex((c) => !c.cardId || c.cardId.trim() === '');
    if (unselectedCardIndex !== -1) {
      setValidationError(
        `Por favor, selecione qual carta você tirou para a Carta ${unselectedCardIndex + 1}.`
      );
      return;
    }

    setValidationError(null);

    onSubmit({
      question: question.trim(),
      context: context.trim() ? context.trim() : undefined,
      cards,
      interpretationStyle,
    });
  };

  const styleOptions: Array<{
    id: InterpretationStyle;
    label: string;
    description: string;
    icon: string;
  }> = [
    {
      id: 'detailed',
      label: 'Detalhada',
      description: 'Explica cada carta individualmente e depois analisa a combinação aprofundada.',
      icon: '📖',
    },
    {
      id: 'objective',
      label: 'Objetiva',
      description: 'Resposta mais curta, prática e direta ao cerne da questão.',
      icon: '🎯',
    },
    {
      id: 'traditional',
      label: 'Tradicional',
      description: 'Prioriza os significados clássicos do Rider-Waite-Smith.',
      icon: '🏛️',
    },
    {
      id: 'reflective',
      label: 'Reflexiva',
      description: 'Apresenta a interpretação e formula perguntas reflexivas para o consulente.',
      icon: '🪞',
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-7 max-w-4xl mx-auto">
      {/* 1. Pergunta */}
      <div className="p-5 md:p-6 rounded-2xl bg-zinc-950/80 border border-amber-500/20 shadow-xl">
        <label className="block text-sm font-semibold text-amber-100 mb-2 font-serif flex items-center justify-between">
          <span>
            Qual é a sua pergunta? <span className="text-amber-400">*</span>
          </span>
          <span className="text-[11px] font-normal text-zinc-400">Obrigatório</span>
        </label>
        <textarea
          rows={3}
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            if (validationError) setValidationError(null);
          }}
          placeholder="Como tende a evoluir minha relação com essa pessoa?"
          className="w-full p-3.5 bg-zinc-900/90 border border-zinc-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all resize-y leading-relaxed"
        />
        <p className="text-xs text-zinc-400 mt-2">
          Dica: Formulações claras e reflexivas favorecem uma leitura mais rica e conectada.
        </p>
      </div>

      {/* 2. Contexto Adicional */}
      <div className="p-5 md:p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 shadow-xl">
        <label className="block text-sm font-semibold text-zinc-200 mb-2 font-serif flex items-center justify-between">
          <span>Contexto adicional</span>
          <span className="text-[11px] font-normal text-zinc-500">Opcional</span>
        </label>
        <textarea
          rows={2}
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Adicione informações que podem ajudar na interpretação. Não é necessário informar nomes reais."
          className="w-full p-3.5 bg-zinc-900/90 border border-zinc-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all resize-y leading-relaxed"
        />
      </div>

      {/* 3. Área da Leitura — Cartas da Tiragem */}
      <div className="p-5 md:p-6 rounded-2xl bg-zinc-950/80 border border-amber-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-amber-100 font-serif">
              Cartas da tiragem
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Informe as cartas que você tirou fisicamente com o seu baralho.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
            {cards.length} {cards.length === 1 ? 'carta' : 'cartas'}
          </span>
        </div>

        {/* Lista de Cards */}
        <div className="space-y-3.5">
          {cards.map((card, index) => (
            <ReadingCardItem
              key={index}
              index={index}
              readingCard={card}
              onUpdateCard={handleUpdateCard}
              onRemoveCard={handleRemoveCard}
              canRemove={cards.length > 1}
            />
          ))}
        </div>

        {/* Botão Adicionar Carta */}
        <button
          type="button"
          onClick={handleAddCard}
          className="w-full py-3 px-4 rounded-xl border border-dashed border-zinc-700 hover:border-amber-400/60 bg-zinc-900/40 hover:bg-amber-500/5 text-zinc-300 hover:text-amber-200 text-xs md:text-sm font-medium transition-all flex items-center justify-center gap-2 group"
        >
          <span className="text-base group-hover:scale-110 transition-transform">➕</span>
          <span>Adicionar carta à tiragem</span>
        </button>
      </div>

      {/* 4. Estilo da Interpretação */}
      <div className="p-5 md:p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 shadow-xl">
        <h3 className="text-sm font-bold text-amber-100 mb-1 font-serif">
          Estilo da interpretação
        </h3>
        <p className="text-xs text-zinc-400 mb-4">
          Escolha o tom e o nível de profundidade desejados para a análise.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {styleOptions.map((opt) => {
            const isSelected = interpretationStyle === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setInterpretationStyle(opt.id)}
                className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400/80 shadow-md ring-1 ring-amber-400/40'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base">{opt.icon}</span>
                    <span
                      className={`text-sm font-bold font-serif ${
                        isSelected ? 'text-amber-300' : 'text-zinc-200'
                      }`}
                    >
                      {opt.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
                {isSelected && (
                  <span className="text-[10px] font-bold text-amber-400 mt-2.5 flex items-center gap-1">
                    ✓ Selecionado
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Alerta de Validação */}
      {validationError && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs md:text-sm flex items-center gap-3 animate-shake">
          <span className="text-lg">⚠️</span>
          <span>{validationError}</span>
        </div>
      )}

      {/* Botão Interpretar Tiragem */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-serif font-bold text-base md:text-lg tracking-wide shadow-xl shadow-amber-950/40 hover:shadow-amber-500/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin"></div>
              <span>Decodificando simbolismos da tiragem...</span>
            </>
          ) : (
            <>
              <span className="text-xl">✨</span>
              <span>Interpretar tiragem</span>
            </>
          )}
        </button>
        <p className="text-center text-xs text-zinc-400 mt-2.5">
          Interpretação baseada na tradição clássica Rider-Waite-Smith • Sem sorteios automatizados
        </p>
      </div>
    </form>
  );
};
