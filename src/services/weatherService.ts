import { WeatherData, WEATHER_CONDITION_CODES } from '../types';

export async function getWeatherData(lat: number, lon: number, locationName: string, country: string): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m,uv_index&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch weather data');
  const data = await response.json();

  return {
    current: {
      temp: data.current.temperature_2m,
      condition: WEATHER_CONDITION_CODES[data.current.weather_code]?.label || 'Unknown',
      windSpeed: data.current.wind_speed_10m,
      humidity: data.current.relative_humidity_2m,
      uvIndex: data.current.uv_index,
      isDay: data.current.is_day === 1,
      time: data.current.time,
    },
    hourly: {
      time: data.hourly.time.slice(0, 24),
      temp: data.hourly.temperature_2m.slice(0, 24),
      condition: data.hourly.weather_code.slice(0, 24).map((code: number) => WEATHER_CONDITION_CODES[code]?.label || 'Unknown'),
    },
    daily: {
      time: data.daily.time,
      tempMax: data.daily.temperature_2m_max,
      tempMin: data.daily.temperature_2m_min,
      condition: data.daily.weather_code.map((code: number) => WEATHER_CONDITION_CODES[code]?.label || 'Unknown'),
      sunrise: data.daily.sunrise,
      sunset: data.daily.sunset,
    },
    location: {
      name: locationName,
      country: country,
      timezone: data.timezone,
    },
  };
}

export async function searchCities(query: string) {
  if (query.length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
  const response = await fetch(url);
  if (!response.ok) return [];
  const data = await response.json();
  return data.results || [];
}
