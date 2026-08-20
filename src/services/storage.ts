import { TarotReading } from '../types/tarot';

const STORAGE_KEY = 'tarot_interpreter_readings';
const API_KEY_STORAGE = 'tarot_gemini_api_key';

export const storageService = {
  /**
   * Retorna todas as leituras salvas em ordem decrescente de criação
   */
  getReadings(): TarotReading[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Erro ao ler leituras do localStorage:', e);
      return [];
    }
  },

  /**
   * Salva ou atualiza uma leitura
   */
  saveReading(reading: TarotReading): void {
    try {
      const readings = this.getReadings();
      const existingIndex = readings.findIndex((r) => r.id === reading.id);

      if (existingIndex >= 0) {
        readings[existingIndex] = reading;
      } else {
        readings.unshift(reading);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
    } catch (e) {
      console.error('Erro ao salvar leitura no localStorage:', e);
    }
  },

  /**
   * Busca uma leitura específica por ID
   */
  getReadingById(id: string): TarotReading | null {
    const readings = this.getReadings();
    return readings.find((r) => r.id === id) || null;
  },

  /**
   * Remove uma leitura do histórico
   */
  deleteReading(id: string): void {
    try {
      const readings = this.getReadings().filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
    } catch (e) {
      console.error('Erro ao excluir leitura do localStorage:', e);
    }
  },

  /**
   * Gerencia a chave de API (opcional)
   */
  getApiKey(): string {
    return localStorage.getItem(API_KEY_STORAGE) || '';
  },

  setApiKey(key: string): void {
    if (key.trim()) {
      localStorage.setItem(API_KEY_STORAGE, key.trim());
    } else {
      localStorage.removeItem(API_KEY_STORAGE);
    }
  },
};
