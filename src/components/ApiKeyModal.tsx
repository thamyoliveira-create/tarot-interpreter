import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storage';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(storageService.getApiKey());
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    storageService.setApiKey(apiKey);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    storageService.setApiKey('');
    setApiKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h3 className="font-serif font-bold text-base text-amber-200">
              Conexão com Inteligência Artificial
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 text-sm"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs md:text-sm text-zinc-300 leading-relaxed">
          <p>
            O <strong>Tarot Interpreter</strong> possui um motor simbólico nativo que interpreta
            todas as 78 cartas Rider-Waite-Smith diretamente no navegador, sem necessidade de internet
            ou chaves externas.
          </p>
          <p className="text-zinc-400">
            Se desejar conectar opcionalmente a <strong>API Google Gemini</strong> para geração via LLM,
            insira sua chave abaixo:
          </p>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 font-mono">
              Google Gemini API Key (Opcional):
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 focus:border-amber-400 rounded-xl text-xs font-mono text-zinc-100 placeholder-zinc-600 outline-none"
            />
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300/90">
            💡 <em>Sem chave configurada?</em> O app utiliza automaticamente o interpretador RWS
            avançado embutido em TypeScript.
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
          {apiKey ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-rose-400 hover:underline"
            >
              Remover chave
            </button>
          ) : (
            <span></span>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold font-serif shadow-md"
            >
              {saved ? '✓ Salvo!' : 'Salvar Preferência'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
