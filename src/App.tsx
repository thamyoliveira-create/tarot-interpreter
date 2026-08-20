import React, { useState, useEffect } from 'react';
import { TarotReading } from './types/tarot';
import { storageService } from './services/storage';
import { Header } from './components/Header';
import { NewReading } from './pages/NewReading';
import { ReadingResult } from './pages/ReadingResult';
import { History } from './pages/History';
import { ApiKeyModal } from './components/ApiKeyModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'history' | 'result'>('new');
  const [currentReading, setCurrentReading] = useState<TarotReading | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [newReadingKey, setNewReadingKey] = useState(Date.now());

  const refreshSavedCount = () => {
    setSavedCount(storageService.getReadings().length);
  };

  useEffect(() => {
    refreshSavedCount();
  }, [activeTab]);

  const handleReadingComplete = (reading: TarotReading) => {
    setCurrentReading(reading);
    setActiveTab('result');
    refreshSavedCount();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFromHistory = (reading: TarotReading) => {
    setCurrentReading(reading);
    setActiveTab('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewReading = () => {
    setNewReadingKey(Date.now());
    setActiveTab('new');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToHistory = () => {
    setActiveTab('history');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-zinc-950">
      {/* Barra de Navegação */}
      <Header
        currentTab={activeTab}
        onNavigate={(tab) => {
          if (tab === 'new') handleNewReading();
          if (tab === 'history') handleGoToHistory();
        }}
        savedCount={savedCount}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 lg:px-8 py-6 md:py-10">
        {activeTab === 'new' && (
          <NewReading
            key={newReadingKey}
            onReadingComplete={handleReadingComplete}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {activeTab === 'result' && currentReading && (
          <ReadingResult
            reading={currentReading}
            onNewReading={handleNewReading}
            onGoToHistory={handleGoToHistory}
          />
        )}

        {activeTab === 'history' && (
          <History
            onSelectReading={handleSelectFromHistory}
            onNewReading={handleNewReading}
          />
        )}
      </main>

      {/* Rodapé Elegante */}
      <footer className="mt-auto border-t border-zinc-900 bg-zinc-950 py-6 px-4 text-center text-xs text-zinc-400 space-y-1.5">
        <p className="font-serif text-zinc-300">
          Tarot Interpreter — Interpretação Simbólica Tradicional Rider-Waite-Smith
        </p>
        <p className="text-[11px] text-zinc-400">
          Uso ético e reflexivo • Sem simulações ou sorteios automatizados • As cartas iluminam possibilidades e reflexões conscientes.
        </p>
      </footer>

      {/* Modal de Configurações / IA */}
      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default App;
