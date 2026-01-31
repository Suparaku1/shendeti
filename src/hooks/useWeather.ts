import { useState, useCallback } from 'react';
import type { WeatherData, DayForecast } from '@/types/health';

const WEATHER_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: 'Kthjellët', icon: '☀️' },
  1: { description: 'Kryesisht kthjellët', icon: '🌤️' },
  2: { description: 'Pjesërisht me re', icon: '⛅' },
  3: { description: 'Me re', icon: '☁️' },
  45: { description: 'Mjegull', icon: '🌫️' },
  48: { description: 'Mjegull me ngricë', icon: '🌫️' },
  51: { description: 'Shi i lehtë', icon: '🌧️' },
  53: { description: 'Shi mesatar', icon: '🌧️' },
  55: { description: 'Shi i dendur', icon: '🌧️' },
  61: { description: 'Shi i lehtë', icon: '🌧️' },
  63: { description: 'Shi mesatar', icon: '🌧️' },
  65: { description: 'Shi i fortë', icon: '🌧️' },
  71: { description: 'Borë e lehtë', icon: '🌨️' },
  73: { description: 'Borë mesatare', icon: '🌨️' },
  75: { description: 'Borë e dendur', icon: '❄️' },
  80: { description: 'Reshje shiu', icon: '🌦️' },
  81: { description: 'Reshje shiu mesatare', icon: '🌦️' },
  82: { description: 'Reshje shiu të forta', icon: '⛈️' },
  95: { description: 'Stuhi', icon: '⛈️' },
  96: { description: 'Stuhi me breshër', icon: '⛈️' },
  99: { description: 'Stuhi me breshër të fortë', icon: '⛈️' },
};

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);

    try {
      // Open-Meteo (pa API key)
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean&timezone=auto&forecast_days=7`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Dështoi marrja e të dhënave të motit');
      }

      const data = await response.json();

      // Emri i lokacionit (reverse geocoding) – pa headers të ndaluara nga browser
      let locationName = 'Lokacioni juaj';
      try {
        const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=sq`;
        const geoResponse = await fetch(geoUrl);
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          locationName =
            geoData.address?.city ||
            geoData.address?.town ||
            geoData.address?.municipality ||
            geoData.address?.county ||
            geoData.address?.state ||
            'Lokacioni juaj';
        }
      } catch {
        // keep default
      }

      const weatherCode = data.current.weather_code;
      const weatherInfo = WEATHER_CODES[weatherCode] || { description: 'I panjohur', icon: '🌡️' };

      const forecast: DayForecast[] = data.daily.time.slice(1, 8).map((date: string, index: number) => {
        const code = data.daily.weather_code[index + 1];
        const info = WEATHER_CODES[code] || { description: 'I panjohur', icon: '🌡️' };
        return {
          date,
          tempMax: Math.round(data.daily.temperature_2m_max[index + 1]),
          tempMin: Math.round(data.daily.temperature_2m_min[index + 1]),
          humidity: Math.round(data.daily.relative_humidity_2m_mean[index + 1]),
          description: info.description,
        };
      });

      setWeather({
        location: locationName,
        temperature: Math.round(data.current.temperature_2m * 10) / 10,
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m * 10) / 10,
        description: weatherInfo.description,
        icon: weatherInfo.icon,
        forecast,
      });
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err instanceof Error ? err.message : 'Gabim i panjohur');
    } finally {
      setLoading(false);
    }
  }, []);

  return { weather, loading, error, fetchWeather };
}
