import React, { useState, useEffect, useMemo } from 'react';
import { TarotReading } from '../types/tarot';
import { storageService } from '../services/storage';
import { ReadingSummary } from '../components/ReadingSummary';

interface HistoryProps {
  onSelectReading: (reading: TarotReading) => void;
  onNewReading: () => void;
}

export const History: React.FC<HistoryProps> = ({ onSelectReading, onNewReading }) => {
  const [readings, setReadings] = useState<TarotReading[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadReadings = () => {
    setReadings(storageService.getReadings());
  };

  useEffect(() => {
    loadReadings();
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza de que deseja excluir esta leitura do histórico?')) {
      storageService.deleteReading(id);
      loadReadings();
    }
  };

  const filteredReadings = useMemo(() => {
    if (!searchTerm.trim()) return readings;
    const term = searchTerm.toLowerCase();
    return readings.filter(
      (r) =>
        r.question.toLowerCase().includes(term) ||
        (r.context && r.context.toLowerCase().includes(term))
    );
  }, [readings, searchTerm]);

  return (
    <div className="max-w-4xl mx-auto space-y-7 animate-fadeIn pb-12">
      {/* Cabeçalho do Histórico */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-zinc-100 flex items-center gap-2.5">
            <span>📜</span>
            <span>Histórico de Leituras</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Revisite e acompanhe suas interpretações salvas localmente.
          </p>
        </div>

        <button
          type="button"
          onClick={onNewReading}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-serif font-bold text-xs md:text-sm shadow-md transition-all flex items-center gap-2"
        >
          <span>✨</span>
          <span>Nova interpretação</span>
        </button>
      </div>

      {/* Busca */}
      {readings.length > 0 && (
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por pergunta ou contexto..."
            className="w-full pl-9 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl text-xs md:text-sm text-zinc-100 placeholder-zinc-500 outline-none"
          />
          <span className="absolute left-3 top-3 text-zinc-500 text-xs">🔍</span>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-200 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Lista de Leituras */}
      {filteredReadings.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-4">
          <span className="text-4xl block">🎴</span>
          <h3 className="text-lg font-bold font-serif text-zinc-200">
            {readings.length === 0
              ? 'Nenhuma leitura salva ainda'
              : 'Nenhuma leitura encontrada para a busca'}
          </h3>
          <p className="text-xs md:text-sm text-zinc-400 max-w-md mx-auto">
            {readings.length === 0
              ? 'Faça sua primeira tiragem no baralho físico e clique em Nova Interpretação para analisar as cartas.'
              : 'Tente buscar com outros termos.'}
          </p>
          {readings.length === 0 && (
            <button
              type="button"
              onClick={onNewReading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-serif font-bold text-xs md:text-sm shadow-md transition-all"
            >
              <span>✨</span>
              <span>Iniciar primeira interpretação</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReadings.map((reading) => {
            const formattedDate = new Date(reading.createdAt).toLocaleString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={reading.id}
                onClick={() => onSelectReading(reading)}
                className="p-5 md:p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 hover:border-amber-500/40 transition-all cursor-pointer shadow-lg space-y-4 group"
              >
                {/* Cabeçalho do Card */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span>📅 {formattedDate}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-amber-400/90 font-medium capitalize">
                      Estilo {reading.interpretationStyle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(reading.id, e)}
                      className="text-zinc-500 hover:text-rose-400 px-2.5 py-1 rounded-md hover:bg-rose-950/40 border border-transparent hover:border-rose-800/40 text-xs transition-colors"
                      title="Excluir leitura"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>

                {/* Pergunta */}
                <div>
                  <h3 className="text-base md:text-lg font-bold font-serif text-zinc-100 group-hover:text-amber-200 transition-colors leading-snug">
                    "{reading.question}"
                  </h3>
                  {reading.context && (
                    <p className="text-xs text-zinc-400 italic line-clamp-1 mt-1">
                      Contexto: {reading.context}
                    </p>
                  )}
                </div>

                {/* Resumo das Cartas */}
                <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between gap-4 flex-wrap">
                  <ReadingSummary cards={reading.cards} />

                  <span className="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Ver interpretação</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
