export type AirQuality = 'very_good' | 'good' | 'bad' | 'very_bad';

export interface EnvironmentData {
  airQuality: AirQuality;
  temperature: number;
  humidity: number;
  gasLevel: number;
}

export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  forecast?: DayForecast[];
}

export interface DayForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  humidity: number;
  description: string;
}

export interface HealthRecommendation {
  summary: string;
  riskLevel: 'low' | 'medium' | 'high';
  food: string[];
  drinks: string[];
  exercises: string[];
  walkSchedule: string;
  precautions: {
    children: string;
    elderly: string;
    asthmatic: string;
  };
  seekDoctor: string;
  sources: Source[];
}

export interface Source {
  title: string;
  url: string;
  date: string;
}

export interface MeasurementHistory {
  id: string;
  date: string;
  data: EnvironmentData;
  location?: string;
  recommendation?: HealthRecommendation;
}

export const AIR_QUALITY_LABELS: Record<AirQuality, string> = {
  very_good: 'Shumë mirë',
  good: 'Mirë',
  bad: 'Keq',
  very_bad: 'Shumë keq',
};
