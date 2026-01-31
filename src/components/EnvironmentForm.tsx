import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Thermometer, Droplets, Gauge, Send, Loader2, MapPin, MapPinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { EnvironmentData, AirQuality } from '@/types/health';
import { AIR_QUALITY_LABELS } from '@/types/health';

interface EnvironmentFormProps {
  onSubmit: (data: EnvironmentData) => void;
  isLoading: boolean;
  locationLabel?: string;
  hasLocation: boolean;
  locationLoading: boolean;
  locationError?: string | null;
  onRequestLocation: () => void;
}

interface FormErrors {
  airQuality?: string;
  temperature?: string;
  humidity?: string;
  gasLevel?: string;
  location?: string;
}

export function EnvironmentForm({
  onSubmit,
  isLoading,
  locationLabel,
  hasLocation,
  locationLoading,
  locationError,
  onRequestLocation,
}: EnvironmentFormProps) {
  const [airQuality, setAirQuality] = useState<AirQuality>('good');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [gasLevel, setGasLevel] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!hasLocation) {
      newErrors.location = 'Ju lutem lejoni lokacionin për të vazhduar.';
    }

    if (!temperature.trim()) {
      newErrors.temperature = 'Ju lutem plotësoni këtë fushë.';
    } else {
      const temp = parseFloat(temperature);
      if (isNaN(temp) || temp < -50 || temp > 60) {
        newErrors.temperature = 'Temperatura duhet të jetë midis -50 dhe 60 °C.';
      }
    }

    if (!humidity.trim()) {
      newErrors.humidity = 'Ju lutem plotësoni këtë fushë.';
    } else {
      const hum = parseFloat(humidity);
      if (isNaN(hum) || hum < 0 || hum > 100) {
        newErrors.humidity = 'Lagështia duhet të jetë 0–100%.';
      }
    }

    if (!gasLevel.trim()) {
      newErrors.gasLevel = 'Ju lutem plotësoni këtë fushë.';
    } else {
      const gas = parseInt(gasLevel, 10);
      if (isNaN(gas) || gas < 0 || gas > 999) {
        newErrors.gasLevel = 'Vlera e lejuar për nivelin e gazit është 0–999.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      airQuality,
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      gasLevel: parseInt(gasLevel, 10),
    });
  };

  const handleTemperatureChange = (value: string) => {
    // Allow negative numbers and decimals
    if (/^-?\d*\.?\d{0,1}$/.test(value) || value === '' || value === '-') {
      setTemperature(value);
      if (errors.temperature) {
        setErrors(prev => ({ ...prev, temperature: undefined }));
      }
    }
  };

  const handleHumidityChange = (value: string) => {
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setHumidity(value);
      if (errors.humidity) {
        setErrors(prev => ({ ...prev, humidity: undefined }));
      }
    }
  };

  const handleGasLevelChange = (value: string) => {
    if (/^\d{0,3}$/.test(value) || value === '') {
      setGasLevel(value);
      if (errors.gasLevel) {
        setErrors(prev => ({ ...prev, gasLevel: undefined }));
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="p-6 shadow-card border-0 rounded-2xl gradient-card">
        <h2 className="mb-6 text-xl font-semibold text-foreground">Matjet Mjedisore</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Location (required) */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              {hasLocation ? (
                <MapPin className="h-4 w-4 text-primary" />
              ) : (
                <MapPinOff className="h-4 w-4 text-primary" />
              )}
              Lokacioni
            </Label>

            <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {hasLocation ? (locationLabel ?? 'Lokacioni u gjet') : 'Nuk është marrë lokacioni'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Kjo ndihmon që këshillat të bazohen edhe në zonën tuaj.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={onRequestLocation}
                disabled={locationLoading}
                className="rounded-xl flex-shrink-0"
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

            {(errors.location || locationError) && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-danger"
                role="alert"
              >
                {errors.location ?? locationError}
              </motion.p>
            )}
          </div>

          {/* Air Quality */}
          <div className="space-y-2">
            <Label 
              htmlFor="airQuality" 
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Wind className="h-4 w-4 text-primary" />
              Cilësia e Ajrit
            </Label>
            <Select
              value={airQuality}
              onValueChange={(value: AirQuality) => setAirQuality(value)}
            >
              <SelectTrigger 
                id="airQuality"
                className="rounded-xl border-input bg-background h-12"
                aria-label="Zgjidhni cilësinë e ajrit"
              >
                <SelectValue placeholder="Zgjidhni cilësinë e ajrit" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(AIR_QUALITY_LABELS) as AirQuality[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {AIR_QUALITY_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <Label 
              htmlFor="temperature"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Thermometer className="h-4 w-4 text-primary" />
              Temperatura (°C)
            </Label>
            <div className="relative">
              <Input
                id="temperature"
                type="text"
                inputMode="decimal"
                value={temperature}
                onChange={(e) => handleTemperatureChange(e.target.value)}
                placeholder="p.sh. 23.4"
                className={`rounded-xl h-12 pr-12 ${errors.temperature ? 'border-danger focus-visible:ring-danger' : ''}`}
                aria-label="Shkruani temperaturën në gradë Celsius"
                aria-invalid={!!errors.temperature}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                °C
              </span>
            </div>
            {errors.temperature && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-danger"
                role="alert"
              >
                {errors.temperature}
              </motion.p>
            )}
          </div>

          {/* Humidity */}
          <div className="space-y-2">
            <Label 
              htmlFor="humidity"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Droplets className="h-4 w-4 text-primary" />
              Lagështia (%)
            </Label>
            <div className="relative">
              <Input
                id="humidity"
                type="text"
                inputMode="numeric"
                value={humidity}
                onChange={(e) => handleHumidityChange(e.target.value)}
                placeholder="p.sh. 45"
                className={`rounded-xl h-12 pr-12 ${errors.humidity ? 'border-danger focus-visible:ring-danger' : ''}`}
                aria-label="Shkruani lagështinë në përqindje"
                aria-invalid={!!errors.humidity}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </div>
            {errors.humidity && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-danger"
                role="alert"
              >
                {errors.humidity}
              </motion.p>
            )}
          </div>

          {/* Gas Level */}
          <div className="space-y-2">
            <Label 
              htmlFor="gasLevel"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Gauge className="h-4 w-4 text-primary" />
              Niveli i Gazit
            </Label>
            <Input
              id="gasLevel"
              type="text"
              inputMode="numeric"
              value={gasLevel}
              onChange={(e) => handleGasLevelChange(e.target.value)}
              placeholder="p.sh. 150"
              className={`rounded-xl h-12 ${errors.gasLevel ? 'border-danger focus-visible:ring-danger' : ''}`}
              aria-label="Shkruani nivelin e gazit (0-999)"
              aria-invalid={!!errors.gasLevel}
            />
            {errors.gasLevel && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-danger"
                role="alert"
              >
                {errors.gasLevel}
              </motion.p>
            )}
          </div>

          {/* Submit Button */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Button
              type="submit"
              disabled={isLoading || !hasLocation}
              className="w-full h-14 rounded-xl gradient-primary text-primary-foreground text-lg font-semibold shadow-glow hover:opacity-90 transition-opacity"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Duke analizuar...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Merr Këshilla
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </Card>
    </motion.div>
  );
}
