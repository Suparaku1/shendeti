import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { WeatherCard } from '@/components/WeatherCard';
import { EnvironmentForm } from '@/components/EnvironmentForm';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { HistoryModal } from '@/components/HistoryModal';
import { SettingsModal } from '@/components/SettingsModal';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useWeather } from '@/hooks/useWeather';
import { useHistory } from '@/hooks/useHistory';
import { generateHealthRecommendation } from '@/services/healthAI';
import type { EnvironmentData, HealthRecommendation } from '@/types/health';

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<HealthRecommendation | null>(null);
  const [currentData, setCurrentData] = useState<EnvironmentData | null>(null);

  const { latitude, longitude, error: locationError, loading: locationLoading, requestLocation } = useGeolocation();
  const { weather, loading: weatherLoading, error: weatherError, fetchWeather } = useWeather();
  const { history, addMeasurement, clearHistory, exportToCSV } = useHistory();

  const hasLocation = Boolean(latitude && longitude);
  const locationLabel = weather?.location ?? (hasLocation ? `${latitude!.toFixed(4)}, ${longitude!.toFixed(4)}` : undefined);

  // Fetch weather when location is available
  useEffect(() => {
    if (latitude && longitude) {
      fetchWeather(latitude, longitude);
    }
  }, [latitude, longitude, fetchWeather]);

  const handleSubmit = async (data: EnvironmentData) => {
    setIsAnalyzing(true);
    setCurrentData(data);

    try {
      const result = await generateHealthRecommendation(data, weather?.location);
      setRecommendation(result);
      
      // Save to history
      addMeasurement(data, weather?.location, result);
    } catch (error) {
      console.error('Error generating recommendation:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewMeasurement = () => {
    setRecommendation(null);
    setCurrentData(null);
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      <Header
        onSettingsClick={() => setSettingsOpen(true)}
        onHistoryClick={() => setHistoryOpen(true)}
      />

      <main className="container py-8 pb-16 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          {/* Weather Card */}
          <WeatherCard
            weather={weather}
            loading={weatherLoading}
            error={weatherError ?? locationError}
            onRequestLocation={requestLocation}
            locationLoading={locationLoading}
          />

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {!recommendation ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <EnvironmentForm
                  onSubmit={handleSubmit}
                  isLoading={isAnalyzing}
                  hasLocation={hasLocation}
                  locationLabel={locationLabel}
                  locationLoading={locationLoading}
                  locationError={locationError}
                  onRequestLocation={requestLocation}
                />
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <motion.button
                  onClick={handleNewMeasurement}
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  whileHover={{ x: -5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  ← Matje e re
                </motion.button>
                
                <ResultsDashboard
                  recommendation={recommendation}
                  data={currentData!}
                  location={weather?.location}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <p className="text-sm text-muted-foreground">
          Krijuar nga Esmerald Suparaku 2026
        </p>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <HistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onExport={exportToCSV}
        onClear={clearHistory}
      />
    </div>
  );
};

export default Index;
