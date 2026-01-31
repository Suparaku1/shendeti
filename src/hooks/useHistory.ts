import { useState, useEffect, useCallback } from 'react';
import type { MeasurementHistory, EnvironmentData, HealthRecommendation } from '@/types/health';

const STORAGE_KEY = 'healthadvisor_history';
const MAX_ITEMS = 30;

export function useHistory() {
  const [history, setHistory] = useState<MeasurementHistory[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const addMeasurement = useCallback((
    data: EnvironmentData,
    location?: string,
    recommendation?: HealthRecommendation
  ) => {
    const newEntry: MeasurementHistory = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      data,
      location,
      recommendation,
    };

    setHistory(prev => {
      const updated = [newEntry, ...prev].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    return newEntry;
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  const exportToCSV = useCallback(() => {
    if (history.length === 0) return '';

    const headers = ['Data', 'Ora', 'Cilësia e Ajrit', 'Temperatura (°C)', 'Lagështia (%)', 'Niveli i Gazit', 'Lokacioni', 'Niveli i Rrezikut'];
    
    const rows = history.map(entry => {
      const date = new Date(entry.date);
      return [
        date.toLocaleDateString('sq-AL'),
        date.toLocaleTimeString('sq-AL'),
        entry.data.airQuality,
        entry.data.temperature,
        entry.data.humidity,
        entry.data.gasLevel,
        entry.location || '',
        entry.recommendation?.riskLevel || '',
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }, [history]);

  return { history, addMeasurement, clearHistory, exportToCSV };
}
