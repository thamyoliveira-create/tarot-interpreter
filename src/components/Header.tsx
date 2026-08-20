import React from 'react';

interface HeaderProps {
  currentTab: 'new' | 'history' | 'result';
  onNavigate: (tab: 'new' | 'history') => void;
  savedCount: number;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  savedCount,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-amber-500/20 px-4 lg:px-8 py-3.5 shadow-lg shadow-black/40">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Nome do App */}
        <button
          onClick={() => onNavigate('new')}
          className="flex items-center gap-3 group text-left transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 via-amber-600/20 to-zinc-900 border border-amber-400/40 flex items-center justify-center shadow-inner group-hover:border-amber-400 transition-colors">
            <span className="text-xl select-none" role="img" aria-label="Tarot">
              🎴
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg lg:text-xl text-amber-100 tracking-wide">
                Tarot Interpreter
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                RWS
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Sistema Rider-Waite-Smith • Tiragem Física
            </p>
          </div>
        </button>

        {/* Navegação Principal */}
        <nav className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('new')}
            className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all flex items-center gap-1.5 ${
              currentTab === 'new'
                ? 'bg-amber-500/15 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'text-zinc-300 hover:text-amber-100 hover:bg-zinc-900/80 border border-transparent'
            }`}
          >
            <span>✨</span>
            <span>Nova interpretação</span>
          </button>

          <button
            onClick={() => onNavigate('history')}
            className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all flex items-center gap-2 ${
              currentTab === 'history'
                ? 'bg-amber-500/15 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'text-zinc-300 hover:text-amber-100 hover:bg-zinc-900/80 border border-transparent'
            }`}
          >
            <span>📜</span>
            <span>Histórico</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {savedCount}
              </span>
            )}
          </button>

          {/* Botão de Configurações / IA */}
          <button
            onClick={onOpenSettings}
            title="Configurar Conexão de IA"
            className="p-2 rounded-lg text-zinc-400 hover:text-amber-200 hover:bg-zinc-900 border border-zinc-800 transition-colors"
          >
            ⚙️
          </button>
        </nav>
      </div>
    </header>
  );
};
