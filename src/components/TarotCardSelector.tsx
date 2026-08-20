import React, { useState, useRef, useEffect, useMemo } from 'react';
import { TAROT_CARDS, TAROT_CARDS_MAP } from '../data/tarotCards';
import { TarotCard } from '../types/tarot';

interface TarotCardSelectorProps {
  selectedCardId: string;
  onSelectCard: (cardId: string) => void;
  placeholder?: string;
}

export const TarotCardSelector: React.FC<TarotCardSelectorProps> = ({
  selectedCardId,
  onSelectCard,
  placeholder = 'Selecione ou busque uma carta...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCard = useMemo(
    () => TAROT_CARDS_MAP.get(selectedCardId),
    [selectedCardId]
  );

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Foco no input ao abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Filtragem das 78 cartas por pesquisa e categoria
  const filteredCards = useMemo(() => {
    return TAROT_CARDS.filter((card) => {
      const matchesSearch =
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.upright.keywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (card.suit && card.suit.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      if (activeCategory === 'all') return true;
      if (activeCategory === 'major') return card.arcana === 'major';
      if (activeCategory === 'wands') return card.suit === 'wands';
      if (activeCategory === 'cups') return card.suit === 'cups';
      if (activeCategory === 'swords') return card.suit === 'swords';
      if (activeCategory === 'pentacles') return card.suit === 'pentacles';

      return true;
    });
  }, [searchTerm, activeCategory]);

  const getSuitBadge = (card: TarotCard) => {
    if (card.arcana === 'major') {
      return (
        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-950/70 text-purple-300 border border-purple-500/30">
          Arcano Maior
        </span>
      );
    }
    const suitMap: Record<string, { label: string; color: string }> = {
      wands: { label: 'Paus • Fogo', color: 'bg-amber-950/70 text-amber-300 border-amber-500/30' },
      cups: { label: 'Copas • Água', color: 'bg-sky-950/70 text-sky-300 border-sky-500/30' },
      swords: { label: 'Espadas • Ar', color: 'bg-slate-800 text-slate-300 border-slate-500/30' },
      pentacles: { label: 'Ouros • Terra', color: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30' },
    };
    const s = card.suit ? suitMap[card.suit] : null;
    if (!s) return null;
    return (
      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${s.color}`}>
        {s.label}
      </span>
    );
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Botão de Trigger do Selector */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 bg-zinc-900/90 hover:bg-zinc-800/90 text-left rounded-lg border border-zinc-700 hover:border-amber-500/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all shadow-sm"
      >
        <div className="flex items-center gap-2.5 truncate">
          {selectedCard ? (
            <>
              <span className="text-amber-400 text-sm font-semibold truncate font-serif">
                {selectedCard.name}
              </span>
              {getSuitBadge(selectedCard)}
            </>
          ) : (
            <span className="text-zinc-500 text-sm">{placeholder}</span>
          )}
        </div>
        <span className="text-zinc-400 text-xs transition-transform duration-200">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-zinc-950/98 backdrop-blur-xl border border-amber-500/30 rounded-xl shadow-2xl shadow-black/80 max-h-[380px] flex flex-col overflow-hidden animate-fadeIn">
          {/* Caixa de Busca */}
          <div className="p-3 border-b border-zinc-800 bg-zinc-900/50">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digitar nome da carta (ex: O Mago, 2 de Copas)..."
                className="w-full pl-8 pr-8 py-2 bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors"
              />
              <span className="absolute left-2.5 top-2.5 text-zinc-500 text-xs">🔍</span>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2 text-zinc-400 hover:text-zinc-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Categorias Rápidas */}
            <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
              {[
                { id: 'all', label: 'Todas (78)' },
                { id: 'major', label: 'Maiores (22)' },
                { id: 'wands', label: 'Paus' },
                { id: 'cups', label: 'Copas' },
                { id: 'swords', label: 'Espadas' },
                { id: 'pentacles', label: 'Ouros' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                      : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Resultados */}
          <div className="overflow-y-auto max-h-[260px] divide-y divide-zinc-900/60 p-1">
            {filteredCards.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-sm">
                Nenhuma carta encontrada para "{searchTerm}".
              </div>
            ) : (
              filteredCards.map((card) => {
                const isSelected = card.id === selectedCardId;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => {
                      onSelectCard(card.id);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full flex items-center justify-between gap-3 p-2.5 rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-200 border-l-2 border-amber-400'
                        : 'hover:bg-zinc-900/90 text-zinc-200'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5 truncate">
                      <span className="font-serif font-medium text-sm text-zinc-100 group-hover:text-amber-300">
                        {card.name}
                      </span>
                      <span className="text-[11px] text-zinc-400 truncate">
                        {card.upright.keywords.slice(0, 3).join(' • ')}
                      </span>
                    </div>
                    <div>{getSuitBadge(card)}</div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
