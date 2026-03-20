export interface WeatherData {
  current: {
    temp: number;
    condition: string;
    windSpeed: number;
    humidity: number;
    uvIndex: number;
    isDay: boolean;
    time: string;
  };
  hourly: {
    time: string[];
    temp: number[];
    condition: string[];
  };
  daily: {
    time: string[];
    tempMax: number[];
    tempMin: number[];
    condition: string[];
    sunrise: string[];
    sunset: string[];
  };
  location: {
    name: string;
    country: string;
    timezone: string;
  };
}

export const WEATHER_CONDITION_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: 'Clear sky', icon: 'Sun' },
  1: { label: 'Mainly clear', icon: 'CloudSun' },
  2: { label: 'Partly cloudy', icon: 'CloudSun' },
  3: { label: 'Overcast', icon: 'Cloud' },
  45: { label: 'Fog', icon: 'CloudFog' },
  48: { label: 'Depositing rime fog', icon: 'CloudFog' },
  51: { label: 'Light drizzle', icon: 'CloudDrizzle' },
  53: { label: 'Moderate drizzle', icon: 'CloudDrizzle' },
  55: { label: 'Dense drizzle', icon: 'CloudDrizzle' },
  61: { label: 'Slight rain', icon: 'CloudRain' },
  63: { label: 'Moderate rain', icon: 'CloudRain' },
  65: { label: 'Heavy rain', icon: 'CloudRain' },
  71: { label: 'Slight snow fall', icon: 'CloudSnow' },
  73: { label: 'Moderate snow fall', icon: 'CloudSnow' },
  75: { label: 'Heavy snow fall', icon: 'CloudSnow' },
  77: { label: 'Snow grains', icon: 'CloudSnow' },
  80: { label: 'Slight rain showers', icon: 'CloudRain' },
  81: { label: 'Moderate rain showers', icon: 'CloudRain' },
  82: { label: 'Violent rain showers', icon: 'CloudRain' },
  85: { label: 'Slight snow showers', icon: 'CloudSnow' },
  86: { label: 'Heavy snow showers', icon: 'CloudSnow' },
  95: { label: 'Thunderstorm', icon: 'CloudLightning' },
  96: { label: 'Thunderstorm with slight hail', icon: 'CloudLightning' },
  99: { label: 'Thunderstorm with heavy hail', icon: 'CloudLightning' },
};
