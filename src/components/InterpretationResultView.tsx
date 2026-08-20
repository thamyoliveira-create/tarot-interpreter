import React, { useState } from 'react';
import { TarotReading, StructuredInterpretation } from '../types/tarot';
import { ReadingSummary } from './ReadingSummary';
import { generateInterpretationPrompt } from '../services/tarotInterpreter';

interface InterpretationResultViewProps {
  reading: TarotReading;
  onNewReading: () => void;
  onGoToHistory: () => void;
}

export const InterpretationResultView: React.FC<InterpretationResultViewProps> = ({
  reading,
  onNewReading,
  onGoToHistory,
}) => {
  const [copied, setCopied] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);

  const interp: StructuredInterpretation | undefined = reading.structuredInterpretation;

  const handleCopyText = () => {
    if (!interp) return;

    const cardsText = reading.cards
      .map((c, i) => {
        const detail = interp.cardByCard[i];
        const cardName = detail ? detail.card.name : c.cardId;
        const orient = c.orientation === 'upright' ? 'Normal' : 'Invertida';
        const pos = c.position ? ` (${c.position})` : '';
        return `• ${cardName} — ${orient}${pos}`;
      })
      .join('\n');

    const cardByCardText = interp.cardByCard
      .map((c, i) => {
        const orient = c.orientation === 'upright' ? 'Normal' : 'Invertida';
        const pos = c.position ? ` [Posição: ${c.position}]` : '';
        return `### ${i + 1}. ${c.card.name} (${orient})${pos}\n${c.meaning}\nPalavras-chave: ${c.keywords.join(', ')}`;
      })
      .join('\n\n');

    const attentionText = `• Favoráveis: ${interp.attentionPoints.favorable.join('; ')}\n• Desafios: ${interp.attentionPoints.challenging.join('; ')}\n• Indefinidos: ${interp.attentionPoints.undefinedOrOpen.join('; ')}\n• Postura Recomendada: ${interp.attentionPoints.attitudeDependent.join('; ')}`;

    const fullText = `🔮 LEITURA DE TAROT (Rider-Waite-Smith)
Data: ${new Date(reading.createdAt).toLocaleDateString('pt-BR')}

❓ PERGUNTA:
${reading.question}
${reading.context ? `\nContexto: ${reading.context}` : ''}

🃏 CARTAS:
${cardsText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. VISÃO GERAL
${interp.overview}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. CARTA POR CARTA
${cardByCardText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. RELAÇÃO ENTRE AS CARTAS
- ${interp.cardsRelationship.elementBalance}
- ${interp.cardsRelationship.majorArcanaSignificance}
- ${interp.cardsRelationship.synergiesAndContrasts}
${interp.cardsRelationship.courtCardsAnalysis ? `- ${interp.cardsRelationship.courtCardsAnalysis}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. SÍNTESE DA LEITURA
${interp.synthesis}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. PONTOS DE ATENÇÃO
${attentionText}
`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (!interp) {
    return (
      <div className="p-8 text-center text-zinc-400">
        Nenhuma interpretação disponível para esta leitura.
      </div>
    );
  }

  const formattedDate = new Date(reading.createdAt).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Barra de Ações Superiores */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-zinc-950/70 border border-zinc-800">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span>📅</span>
          <span>{formattedDate}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-amber-400 capitalize">
            Estilo {reading.interpretationStyle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyText}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-amber-500/40 transition-all flex items-center gap-1.5"
          >
            <span>{copied ? '✓' : '📋'}</span>
            <span>{copied ? 'Copiado!' : 'Copiar leitura'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPromptModal(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 hover:border-amber-500/40 transition-all flex items-center gap-1"
            title="Visualizar prompt gerado para IA"
          >
            <span>🤖</span>
            <span>Prompt da IA</span>
          </button>

          <button
            type="button"
            onClick={onNewReading}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all flex items-center gap-1"
          >
            <span>✨</span>
            <span>Nova tiragem</span>
          </button>
        </div>
      </div>

      {/* Topo: Sua Pergunta & Contexto */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/30 shadow-2xl space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 font-mono">
            Sua pergunta
          </span>
          <h2 className="text-xl md:text-2xl font-bold font-serif text-zinc-100 mt-1 leading-snug">
            "{reading.question}"
          </h2>
        </div>

        {reading.context && (
          <div className="pt-3 border-t border-zinc-800/80">
            <span className="text-[11px] font-semibold text-zinc-400 block mb-1">
              Contexto adicional:
            </span>
            <p className="text-xs md:text-sm text-zinc-300 italic bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50 leading-relaxed">
              {reading.context}
            </p>
          </div>
        )}

        {/* Cartas da Tiragem */}
        <div className="pt-3 border-t border-zinc-800/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2 font-mono">
            Cartas da tiragem ({reading.cards.length})
          </span>
          <ReadingSummary cards={reading.cards} />
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 1. VISÃO GERAL */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="p-6 md:p-7 rounded-2xl bg-zinc-950/90 border border-amber-500/25 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-2.5 mb-3.5">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-serif font-bold text-xs">
            1
          </span>
          <h3 className="text-lg font-bold font-serif text-amber-200">
            Visão geral
          </h3>
        </div>
        <p className="text-sm md:text-base text-zinc-200 leading-relaxed">
          {interp.overview}
        </p>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 2. CARTA POR CARTA */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="p-6 md:p-7 rounded-2xl bg-zinc-950/90 border border-amber-500/20 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-800">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-serif font-bold text-xs">
            2
          </span>
          <div>
            <h3 className="text-lg font-bold font-serif text-amber-200">
              Carta por carta
            </h3>
            <p className="text-xs text-zinc-400">
              Significado aprofundado de cada arcano dentro do contexto da sua pergunta.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {interp.cardByCard.map((item, idx) => {
            const isUpright = item.orientation === 'upright';
            return (
              <div
                key={idx}
                className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/30 transition-all space-y-3 shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center text-xs font-serif font-bold">
                      {idx + 1}
                    </span>
                    <h4 className="text-base font-bold text-zinc-100 font-serif">
                      {item.card.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        isUpright
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-purple-900/40 text-purple-300 border-purple-500/40'
                      }`}
                    >
                      {isUpright ? '⬆️ Normal' : '🔄 Invertida'}
                    </span>
                    {item.position && (
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                        Posição: {item.position}
                      </span>
                    )}
                  </div>
                </div>

                {/* Palavras-Chave */}
                <div className="flex flex-wrap gap-1.5">
                  {item.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-zinc-950 text-zinc-400 text-[11px] border border-zinc-800/80"
                    >
                      {kw}
                    </span>
                  ))}
                </div>

                {/* Significado no Contexto */}
                <p className="text-xs md:text-sm text-zinc-200 leading-relaxed pt-1">
                  {item.meaning}
                </p>

                {/* Nuance de Inversão se houver */}
                {item.nuanceNotes && (
                  <p className="text-[11px] text-zinc-400 italic pt-1 border-t border-zinc-800/50">
                    💡 <span className="font-semibold text-zinc-300">Nuance RWS:</span> {item.nuanceNotes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 3. RELAÇÃO ENTRE AS CARTAS */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="p-6 md:p-7 rounded-2xl bg-zinc-950/90 border border-amber-500/20 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-800">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-serif font-bold text-xs">
            3
          </span>
          <div>
            <h3 className="text-lg font-bold font-serif text-amber-200">
              Relação entre as cartas
            </h3>
            <p className="text-xs text-zinc-400">
              Dinâmica conjunta, equilíbrios elementais e sinergias simbólicas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
              Equilíbrio dos Elementos
            </h5>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {interp.cardsRelationship.elementBalance}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
              Arcanos Maiores & Estrutura
            </h5>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {interp.cardsRelationship.majorArcanaSignificance}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 md:col-span-2 space-y-1.5">
            <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
              Sinergias e Contrastes
            </h5>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {interp.cardsRelationship.synergiesAndContrasts}
            </p>
          </div>

          {interp.cardsRelationship.courtCardsAnalysis && (
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 md:col-span-2 space-y-1.5">
              <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
                Cartas da Corte
              </h5>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {interp.cardsRelationship.courtCardsAnalysis}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 4. SÍNTESE DA LEITURA */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="p-6 md:p-7 rounded-2xl bg-gradient-to-r from-amber-950/40 via-zinc-950 to-amber-950/40 border border-amber-500/40 shadow-2xl space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500 text-zinc-950 font-serif font-bold text-xs">
            4
          </span>
          <h3 className="text-lg font-bold font-serif text-amber-100">
            Síntese da leitura
          </h3>
        </div>
        <p className="text-sm md:text-base text-zinc-100 font-serif leading-relaxed italic">
          "{interp.synthesis}"
        </p>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 5. PONTOS DE ATENÇÃO */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="p-6 md:p-7 rounded-2xl bg-zinc-950/90 border border-amber-500/20 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-800">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-serif font-bold text-xs">
            5
          </span>
          <div>
            <h3 className="text-lg font-bold font-serif text-amber-200">
              Pontos de atenção
            </h3>
            <p className="text-xs text-zinc-400">
              Aspectos da situação para orientar reflexões e posturas conscientes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Favoráveis */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 space-y-2">
            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <span>🌿</span> Aspectos Favoráveis
            </h4>
            <ul className="space-y-1.5 text-xs text-emerald-100/90 list-disc list-inside">
              {interp.attentionPoints.favorable.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Difíceis / Desafios */}
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/40 space-y-2">
            <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <span>⚡</span> Desafios & Cuidados
            </h4>
            <ul className="space-y-1.5 text-xs text-rose-100/90 list-disc list-inside">
              {interp.attentionPoints.challenging.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Indefinidos */}
          <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-800/40 space-y-2">
            <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <span>🌊</span> Em Aberto / Indefinidos
            </h4>
            <ul className="space-y-1.5 text-xs text-sky-100/90 list-disc list-inside">
              {interp.attentionPoints.undefinedOrOpen.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Dependentes de Decisões */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 space-y-2">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <span>🧭</span> Dependentes da sua Postura
            </h4>
            <ul className="space-y-1.5 text-xs text-amber-100/90 list-disc list-inside">
              {interp.attentionPoints.attitudeDependent.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Perguntas Reflexivas (se estilo reflexivo) */}
      {interp.reflectiveQuestions && interp.reflectiveQuestions.length > 0 && (
        <section className="p-6 md:p-7 rounded-2xl bg-purple-950/25 border border-purple-500/30 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🪞</span>
            <h3 className="text-base font-bold font-serif text-purple-200">
              Perguntas para auto-reflexão
            </h3>
          </div>
          <div className="space-y-2">
            {interp.reflectiveQuestions.map((q, i) => (
              <div
                key={i}
                className="p-3 bg-zinc-950/60 rounded-lg border border-purple-900/50 text-xs md:text-sm text-purple-100"
              >
                {q}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Botões de Rodapé */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          type="button"
          onClick={onNewReading}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-serif font-bold text-sm shadow-lg hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2"
        >
          <span>✨</span>
          <span>Fazer nova interpretação</span>
        </button>

        <button
          type="button"
          onClick={onGoToHistory}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-sm font-medium transition-all flex items-center justify-center gap-2"
        >
          <span>📜</span>
          <span>Ver histórico completo</span>
        </button>
      </div>

      {/* Modal de Exibição do Prompt da IA */}
      {showPromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-zinc-950 border border-amber-500/40 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <span>🤖</span>
                <h4 className="font-serif font-bold text-amber-200 text-sm">
                  Prompt Estruturado de IA (Rider-Waite-Smith)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowPromptModal(false)}
                className="text-zinc-400 hover:text-zinc-100 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto font-mono text-xs text-zinc-300 bg-zinc-950 leading-relaxed whitespace-pre-wrap select-all">
              {generateInterpretationPrompt(reading)}
            </div>

            <div className="p-3 border-t border-zinc-800 bg-zinc-900/40 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generateInterpretationPrompt(reading));
                  alert('Prompt copiado para a área de transferência!');
                }}
                className="px-4 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-semibold"
              >
                Copiar Prompt
              </button>
              <button
                type="button"
                onClick={() => setShowPromptModal(false)}
                className="px-4 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 text-xs font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
