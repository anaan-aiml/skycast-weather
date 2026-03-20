import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  MapPin, 
  Wind, 
  Droplets, 
  Sun, 
  Cloud, 
  CloudSun, 
  CloudRain, 
  CloudLightning, 
  CloudSnow, 
  CloudFog, 
  CloudDrizzle,
  Navigation,
  Calendar,
  Clock,
  Thermometer,
  Sunrise,
  Sunset
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getWeatherData, searchCities } from './services/weatherService';
import { WeatherData } from './types';

const WeatherIcon = ({ condition, className }: { condition: string; className?: string }) => {
  const props = { className: className || "w-8 h-8" };
  switch (condition.toLowerCase()) {
    case 'clear sky': return <Sun {...props} className={`${props.className} text-yellow-400`} />;
    case 'mainly clear':
    case 'partly cloudy': return <CloudSun {...props} className={`${props.className} text-blue-300`} />;
    case 'overcast': return <Cloud {...props} className={`${props.className} text-gray-400`} />;
    case 'fog':
    case 'depositing rime fog': return <CloudFog {...props} className={`${props.className} text-gray-300`} />;
    case 'light drizzle':
    case 'moderate drizzle':
    case 'dense drizzle': return <CloudDrizzle {...props} className={`${props.className} text-blue-200`} />;
    case 'slight rain':
    case 'moderate rain':
    case 'heavy rain':
    case 'slight rain showers':
    case 'moderate rain showers':
    case 'violent rain showers': return <CloudRain {...props} className={`${props.className} text-blue-400`} />;
    case 'slight snow fall':
    case 'moderate snow fall':
    case 'heavy snow fall':
    case 'snow grains':
    case 'slight snow showers':
    case 'heavy snow showers': return <CloudSnow {...props} className={`${props.className} text-white`} />;
    case 'thunderstorm':
    case 'thunderstorm with slight hail':
    case 'thunderstorm with heavy hail': return <CloudLightning {...props} className={`${props.className} text-purple-400`} />;
    default: return <Cloud {...props} className={`${props.className} text-gray-400`} />;
  }
};

export default function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (lat: number, lon: number, name: string, country: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherData(lat, lon, name, country);
      setWeather(data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Default to London
    fetchWeather(51.5074, -0.1278, 'London', 'United Kingdom');
    
    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude, 'Your Location', '');
        },
        () => {
          console.log('Location access denied');
        }
      );
    }
  }, [fetchWeather]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      const results = await searchCities(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const selectCity = (city: any) => {
    fetchWeather(city.latitude, city.longitude, city.name, city.country);
    setSearchQuery('');
    setSearchResults([]);
  };

  if (loading && !weather) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-700 ${weather?.current.isDay ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-slate-900 to-slate-800'} text-white font-sans p-4 md:p-8`}>
      <div className="max-w-6xl mx-auto">
        {/* Header & Search */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <CloudSun className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">SkyCast</h1>
          </div>

          <div className="relative w-full md:w-96">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search city..."
                className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-10 pr-4 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/30 transition-all placeholder:text-white/40"
              />
            </div>
            
            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden z-50 shadow-2xl"
                >
                  {searchResults.map((city) => (
                    <button
                      key={`${city.latitude}-${city.longitude}`}
                      onClick={() => selectCity(city)}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center gap-3 border-b border-white/5 last:border-none"
                    >
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="font-medium">{city.name}</div>
                        <div className="text-xs text-white/50">{city.admin1}, {city.country}</div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-2xl mb-8 text-center">
            {error}
          </div>
        )}

        {weather && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Weather Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-2 space-y-8"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-4xl font-bold mb-1">{weather.location.name}</h2>
                      <p className="text-white/70 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-6xl font-bold tracking-tighter">{Math.round(weather.current.temp)}°</p>
                      <p className="text-xl text-white/80 font-medium">{weather.current.condition}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
                    <div className="bg-white/5 p-4 rounded-2xl flex flex-col items-center gap-2">
                      <Wind className="w-6 h-6 text-blue-300" />
                      <span className="text-sm text-white/60">Wind</span>
                      <span className="font-bold">{weather.current.windSpeed} km/h</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl flex flex-col items-center gap-2">
                      <Droplets className="w-6 h-6 text-blue-400" />
                      <span className="text-sm text-white/60">Humidity</span>
                      <span className="font-bold">{weather.current.humidity}%</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl flex flex-col items-center gap-2">
                      <Sun className="w-6 h-6 text-yellow-400" />
                      <span className="text-sm text-white/60">UV Index</span>
                      <span className="font-bold">{weather.current.uvIndex}</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl flex flex-col items-center gap-2">
                      <Thermometer className="w-6 h-6 text-red-400" />
                      <span className="text-sm text-white/60">Feels Like</span>
                      <span className="font-bold">{Math.round(weather.current.temp - 2)}°</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl flex flex-col items-center gap-2">
                      <Sunrise className="w-6 h-6 text-orange-400" />
                      <span className="text-sm text-white/60">Sunrise</span>
                      <span className="font-bold">
                        {new Date(weather.daily.sunrise[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl flex flex-col items-center gap-2">
                      <Sunset className="w-6 h-6 text-orange-600" />
                      <span className="text-sm text-white/60">Sunset</span>
                      <span className="font-bold">
                        {new Date(weather.daily.sunset[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Decorative background element */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              </div>

              {/* Hourly Forecast */}
              <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-5 h-5 text-white/60" />
                  <h3 className="text-lg font-bold uppercase tracking-wider text-white/60">Hourly Forecast</h3>
                </div>
                <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-hide">
                  {weather.hourly.time.map((time, i) => (
                    <div key={time} className="flex flex-col items-center gap-3 min-w-[60px]">
                      <span className="text-sm text-white/60">
                        {new Date(time).getHours()}:00
                      </span>
                      <WeatherIcon condition={weather.hourly.condition[i]} className="w-8 h-8" />
                      <span className="font-bold">{Math.round(weather.hourly.temp[i])}°</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Daily Forecast Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 shadow-xl h-full">
                <div className="flex items-center gap-2 mb-8">
                  <Navigation className="w-5 h-5 text-white/60" />
                  <h3 className="text-lg font-bold uppercase tracking-wider text-white/60">7-Day Forecast</h3>
                </div>
                <div className="space-y-6">
                  {weather.daily.time.map((day, i) => (
                    <div key={day} className="flex items-center justify-between group">
                      <div className="w-20">
                        <p className="font-medium">
                          {i === 0 ? 'Today' : new Date(day).toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <WeatherIcon condition={weather.daily.condition[i]} className="w-6 h-6" />
                        <span className="text-sm text-white/60 hidden sm:inline">{weather.daily.condition[i]}</span>
                      </div>
                      <div className="flex gap-3 w-20 justify-end">
                        <span className="font-bold">{Math.round(weather.daily.tempMax[i])}°</span>
                        <span className="text-white/40">{Math.round(weather.daily.tempMin[i])}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <footer className="mt-12 text-center text-white/40 text-sm pb-8">
        <p>Data provided by Open-Meteo API • Built with React & Tailwind</p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
