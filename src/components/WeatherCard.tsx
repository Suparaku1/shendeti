import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Droplets, Wind, ChevronDown, ChevronUp, Loader2, MapPinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { WeatherData } from '@/types/health';

interface WeatherCardProps {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  onRequestLocation: () => void;
  locationLoading: boolean;
}

export function WeatherCard({ 
  weather, 
  loading, 
  error, 
  onRequestLocation, 
  locationLoading 
}: WeatherCardProps) {
  const [showForecast, setShowForecast] = useState(false);

  if (!weather && !loading && !error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="p-6 shadow-card border-0 rounded-2xl gradient-card">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
              <MapPinOff className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Moti në lokacionin tuaj</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Lejo aksesin në lokacion për të parë motin aktual
              </p>
            </div>
            <Button
              onClick={onRequestLocation}
              disabled={locationLoading}
              className="rounded-xl gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity"
            >
              {locationLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Duke kërkuar...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  Lejo lokacionin
                </>
              )}
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="p-6 shadow-card border-0 rounded-2xl gradient-card">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Duke marrë të dhënat e motit...</span>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="p-6 shadow-card border-0 rounded-2xl border-danger/20 bg-danger/5">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-danger">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={onRequestLocation}
              className="rounded-xl"
            >
              Provo përsëri
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (!weather) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="overflow-hidden shadow-card border-0 rounded-2xl gradient-card">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <motion.span 
                className="text-5xl"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {weather.icon}
              </motion.span>
              <div>
                <p className="text-4xl font-bold text-foreground">{weather.temperature}°C</p>
                <p className="text-sm text-muted-foreground">{weather.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">{weather.location}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-4">
            <div className="flex items-center gap-2 rounded-xl bg-secondary/50 px-3 py-2">
              <Droplets className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-secondary/50 px-3 py-2">
              <Wind className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{weather.windSpeed} km/h</span>
            </div>
          </div>
        </div>

        {weather.forecast && weather.forecast.length > 0 && (
          <>
            <div className="border-t border-border/50">
              <button
                onClick={() => setShowForecast(!showForecast)}
                className="flex w-full items-center justify-center gap-2 py-3 text-sm font-medium text-primary hover:bg-secondary/30 transition-colors"
              >
                {showForecast ? (
                  <>
                    Fshih parashikimin 7-ditor
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Shfaq parashikimin 7-ditor
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            <AnimatePresence>
              {showForecast && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden border-t border-border/50"
                >
                  <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 md:grid-cols-7">
                    {weather.forecast.map((day, index) => (
                      <motion.div
                        key={day.date}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="rounded-xl bg-secondary/30 p-3 text-center"
                      >
                        <p className="text-xs font-medium text-muted-foreground">
                          {new Date(day.date).toLocaleDateString('sq-AL', { weekday: 'short' })}
                        </p>
                        <p className="mt-1 text-lg font-bold text-foreground">
                          {day.tempMax}°
                        </p>
                        <p className="text-sm text-muted-foreground">{day.tempMin}°</p>
                        <p className="mt-1 text-xs text-muted-foreground truncate">
                          {day.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </Card>
    </motion.div>
  );
}
