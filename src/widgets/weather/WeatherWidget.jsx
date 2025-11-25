import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { CloudSun, CloudRain, Cloud, Sun, Wind, Droplets, CloudSnow, CloudDrizzle, CloudLightning, CloudFog, AlertTriangle, MapPin } from 'lucide-react';

// JAZER_BRAND constants
const JAZER_BRAND = {
  colors: {
    electricPurple: '#8B5CF6',
    cosmicBlue: '#3B82F6',
    neonPink: '#EC4899',
    sunburstGold: '#F59E0B',
    aetherTeal: '#06B6D4',
    ultraviolet: '#A78BFA',
    nightBlack: '#0B0E12',
    stardustWhite: '#F8F9FF',
    graphite: '#1F2937',
    softSlate: '#94A3B8',
  },
  fonts: {
    heading: '"Orbitron", system-ui, sans-serif',
    body: '"Montserrat", system-ui, sans-serif'
  },
  gradient: 'linear-gradient(90deg, #EC4899 0%, #F59E0B 28%, #06B6D4 50%, #3B82F6 74%, #8B5CF6 100%)',
  glow: '0 0 4px rgba(139, 92, 246, 0.5)'
};

// Mock weather data
const MOCK_WEATHER = {
  current: {
    temperature: 72,
    condition: 'Partly Cloudy',
    humidity: 65,
    wind: 12,
    feelsLike: 70,
    uvIndex: 6,
    icon: 'partly-cloudy'
  },
  forecast: [
    { day: 'Mon', high: 75, low: 58, condition: 'Sunny', precipitation: 0, wind: 8, icon: 'sunny' },
    { day: 'Tue', high: 72, low: 60, condition: 'Cloudy', precipitation: 10, wind: 10, icon: 'cloudy' },
    { day: 'Wed', high: 68, low: 55, condition: 'Rainy', precipitation: 80, wind: 15, icon: 'rainy' },
    { day: 'Thu', high: 70, low: 57, condition: 'Partly Cloudy', precipitation: 20, wind: 12, icon: 'partly-cloudy' },
    { day: 'Fri', high: 74, low: 59, condition: 'Sunny', precipitation: 0, wind: 7, icon: 'sunny' },
    { day: 'Sat', high: 76, low: 61, condition: 'Sunny', precipitation: 0, wind: 9, icon: 'sunny' },
    { day: 'Sun', high: 73, low: 60, condition: 'Partly Cloudy', precipitation: 15, wind: 11, icon: 'partly-cloudy' }
  ]
};

// WMO Weather Code Mapping (single source of truth)
const WMO_WEATHER_MAPPING = {
  0: { condition: 'Clear', icon: 'clear' },
  1: { condition: 'Partly Cloudy', icon: 'partly-cloudy' },
  2: { condition: 'Partly Cloudy', icon: 'partly-cloudy' },
  3: { condition: 'Partly Cloudy', icon: 'partly-cloudy' },
  45: { condition: 'Fog', icon: 'fog' },
  48: { condition: 'Fog', icon: 'fog' },
  51: { condition: 'Drizzle', icon: 'drizzle' },
  53: { condition: 'Drizzle', icon: 'drizzle' },
  55: { condition: 'Drizzle', icon: 'drizzle' },
  56: { condition: 'Drizzle', icon: 'drizzle' },
  57: { condition: 'Drizzle', icon: 'drizzle' },
  61: { condition: 'Rain', icon: 'rain' },
  63: { condition: 'Rain', icon: 'rain' },
  65: { condition: 'Rain', icon: 'rain' },
  66: { condition: 'Rain', icon: 'rain' },
  67: { condition: 'Rain', icon: 'rain' },
  71: { condition: 'Snow', icon: 'snow' },
  73: { condition: 'Snow', icon: 'snow' },
  75: { condition: 'Snow', icon: 'snow' },
  77: { condition: 'Snow', icon: 'snow' },
  80: { condition: 'Rain', icon: 'rain' },
  81: { condition: 'Rain', icon: 'rain' },
  82: { condition: 'Rain', icon: 'rain' },
  85: { condition: 'Snow', icon: 'snow' },
  86: { condition: 'Snow', icon: 'snow' },
  95: { condition: 'Thunderstorm', icon: 'thunderstorm' },
  96: { condition: 'Thunderstorm', icon: 'thunderstorm' },
  99: { condition: 'Thunderstorm', icon: 'thunderstorm' },
};

/**
 * Get weather condition and icon from WMO code
 * @param {number} code - WMO weather code
 * @returns {{ condition: string, icon: string }} Weather condition and icon
 */
const getWeatherFromWMO = (code) => {
  // Direct lookup first
  if (WMO_WEATHER_MAPPING[code]) {
    return WMO_WEATHER_MAPPING[code];
  }
  
  // Range-based fallback for codes not explicitly mapped
  if (code <= 3) return { condition: 'Partly Cloudy', icon: 'partly-cloudy' };
  if (code <= 48) return { condition: 'Fog', icon: 'fog' };
  if (code <= 57) return { condition: 'Drizzle', icon: 'drizzle' };
  if (code <= 67) return { condition: 'Rain', icon: 'rain' };
  if (code <= 77) return { condition: 'Snow', icon: 'snow' };
  if (code <= 82) return { condition: 'Rain', icon: 'rain' };
  if (code <= 86) return { condition: 'Snow', icon: 'snow' };
  if (code >= 95) return { condition: 'Thunderstorm', icon: 'thunderstorm' };
  
  return { condition: 'Cloudy', icon: 'clouds' };
};

// Weather icon component
const WeatherIcon = ({ condition, animate, greyscale, size = 32 }) => {
  const iconProps = {
    size,
    className: `${animate ? 'animate-pulse' : ''} ${greyscale ? 'grayscale' : ''}`,
    style: { color: greyscale ? JAZER_BRAND.colors.softSlate : JAZER_BRAND.colors.sunburstGold },
    'aria-hidden': true
  };

  // Map OpenWeatherMap condition codes to icons
  const conditionMap = {
    'sunny': <Sun {...iconProps} />,
    'clear': <Sun {...iconProps} />,
    'rainy': <CloudRain {...iconProps} style={{ ...iconProps.style, color: JAZER_BRAND.colors.cosmicBlue }} />,
    'rain': <CloudRain {...iconProps} style={{ ...iconProps.style, color: JAZER_BRAND.colors.cosmicBlue }} />,
    'drizzle': <CloudDrizzle {...iconProps} style={{ ...iconProps.style, color: JAZER_BRAND.colors.aetherTeal }} />,
    'cloudy': <Cloud {...iconProps} style={{ ...iconProps.style, color: JAZER_BRAND.colors.softSlate }} />,
    'clouds': <Cloud {...iconProps} style={{ ...iconProps.style, color: JAZER_BRAND.colors.softSlate }} />,
    'partly-cloudy': <CloudSun {...iconProps} style={{ ...iconProps.style, color: JAZER_BRAND.colors.aetherTeal }} />,
    'snow': <CloudSnow {...iconProps} style={{ ...iconProps.style, color: JAZER_BRAND.colors.stardustWhite }} />,
    'thunderstorm': <CloudLightning {...iconProps} style={{ ...iconProps.style, color: JAZER_BRAND.colors.electricPurple }} />,
    'mist': <CloudFog {...iconProps} style={{ ...iconProps.style, color: JAZER_BRAND.colors.softSlate }} />,
    'fog': <CloudFog {...iconProps} style={{ ...iconProps.style, color: JAZER_BRAND.colors.softSlate }} />,
    'haze': <CloudFog {...iconProps} style={{ ...iconProps.style, color: JAZER_BRAND.colors.softSlate }} />,
    'smoke': <CloudFog {...iconProps} style={{ ...iconProps.style, color: JAZER_BRAND.colors.graphite }} />,
    'dust': <Wind {...iconProps} style={{ ...iconProps.style, color: JAZER_BRAND.colors.sunburstGold }} />,
    'sand': <Wind {...iconProps} style={{ ...iconProps.style, color: JAZER_BRAND.colors.sunburstGold }} />,
    'tornado': <Wind {...iconProps} style={{ ...iconProps.style, color: JAZER_BRAND.colors.electricPurple }} />
  };

  const displayCondition = condition?.toLowerCase() || 'partly-cloudy';
  const ariaLabel = `Weather condition: ${condition || 'Partly Cloudy'}`;
  
  return (
    <span role="img" aria-label={ariaLabel}>
      {conditionMap[displayCondition] || <CloudSun {...iconProps} style={{ ...iconProps.style, color: JAZER_BRAND.colors.aetherTeal }} />}
    </span>
  );
};

// Loading skeleton component
const LoadingSkeleton = () => (
  <div 
    className="animate-pulse space-y-4"
    role="status"
    aria-label="Loading weather data"
    aria-live="polite"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
      <div className="h-6 bg-gray-300 rounded w-32"></div>
    </div>
    <div className="h-12 bg-gray-300 rounded w-24 mb-2"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
    <span className="sr-only">Loading weather data...</span>
  </div>
);

// Severe weather alert component
const SevereWeatherAlert = ({ alert }) => (
  <div 
    className="flex items-start gap-3 p-4 mb-4 rounded-lg border-l-4"
    style={{
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderLeftColor: '#EF4444',
      color: '#DC2626'
    }}
  >
    <AlertTriangle size={24} className="flex-shrink-0 mt-0.5" />
    <div>
      <div className="font-bold text-sm mb-1">{alert.event}</div>
      <div className="text-xs opacity-90">{alert.description}</div>
    </div>
  </div>
);

export const WeatherWidget = ({ config }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(config.weatherLocation);
  
  const [isDark, setIsDark] = useState(() => {
    if (config.appearanceMode === 'dark') return true;
    if (config.appearanceMode === 'light') return false;
    if (config.appearanceMode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Fetch weather data from Open-Meteo API (free, no key required)
  const fetchWeatherData = useCallback(async (location, options = {}) => {
    const { signal } = options;
    setLoading(true);
    setError(null);
    setGeoError(null);

    try {
      // Geocode the location using Open-Meteo Geocoding API
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`,
        { signal }
      );
      
      if (!geoResponse.ok) throw new Error('Location not found');
      
      const geoData = await geoResponse.json();
      if (!geoData.results || geoData.results.length === 0) throw new Error('Location not found');

      const { latitude, longitude, name, admin1, country } = geoData.results[0];
      const displayLocation = admin1 ? `${name}, ${admin1}` : `${name}, ${country}`;
      setCurrentLocation(displayLocation);

      // Fetch weather data using Open-Meteo Weather API
      const tempUnit = config.preferredUnits === 'metric' ? 'celsius' : 'fahrenheit';
      const windUnit = config.preferredUnits === 'metric' ? 'kmh' : 'mph';
      const precipUnit = config.preferredUnits === 'metric' ? 'mm' : 'inch';
      
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}&precipitation_unit=${precipUnit}&timezone=auto`,
        { signal }
      );

      if (!weatherResponse.ok) throw new Error('Failed to fetch weather data');

      const data = await weatherResponse.json();

      // Transform API data to our format using shared utility function
      const transformedData = {
        current: {
          temperature: Math.round(data.current.temperature_2m),
          condition: getWeatherFromWMO(data.current.weather_code).condition,
          humidity: Math.round(data.current.relative_humidity_2m),
          wind: Math.round(data.current.wind_speed_10m),
          feelsLike: Math.round(data.current.apparent_temperature),
          uvIndex: 0, // Open-Meteo doesn't provide UV index in free tier
          icon: getWeatherFromWMO(data.current.weather_code).icon
        },
        forecast: data.daily.time.slice(0, config.numberOfDays + 1).map((dateStr, idx) => ({
          day: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
          date: config.displayDates ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null,
          high: Math.round(data.daily.temperature_2m_max[idx]),
          low: Math.round(data.daily.temperature_2m_min[idx]),
          condition: getWeatherFromWMO(data.daily.weather_code[idx]).condition,
          precipitation: Math.round(data.daily.precipitation_probability_max[idx] || 0),
          wind: Math.round(data.daily.wind_speed_10m_max[idx]),
          icon: getWeatherFromWMO(data.daily.weather_code[idx]).icon
        })),
        alerts: [] // Open-Meteo free tier doesn't include alerts
      };

      setWeatherData(transformedData);
      setLoading(false);
    } catch (err) {
      // Only handle error if not aborted
      if (err.name !== 'AbortError') {
        console.error('Weather fetch error:', err);
        setError(err.message);
        setWeatherData(MOCK_WEATHER);
        setLoading(false);
      }
    }
  }, [config.preferredUnits, config.numberOfDays, config.displayDates]);

  // Fetch weather by coordinates (for geolocation)
  const fetchWeatherByCoordinates = useCallback(async (latitude, longitude, locationName, options = {}) => {
    const { signal } = options;
    setLoading(true);
    setError(null);
    setGeoError(null);

    try {
      const tempUnit = config.preferredUnits === 'metric' ? 'celsius' : 'fahrenheit';
      const windUnit = config.preferredUnits === 'metric' ? 'kmh' : 'mph';
      const precipUnit = config.preferredUnits === 'metric' ? 'mm' : 'inch';
      
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}&precipitation_unit=${precipUnit}&timezone=auto`,
        { signal }
      );

      if (!weatherResponse.ok) throw new Error('Failed to fetch weather data');

      const data = await weatherResponse.json();

      // Transform API data to our format using shared utility function
      const transformedData = {
        current: {
          temperature: Math.round(data.current.temperature_2m),
          condition: getWeatherFromWMO(data.current.weather_code).condition,
          humidity: Math.round(data.current.relative_humidity_2m),
          wind: Math.round(data.current.wind_speed_10m),
          feelsLike: Math.round(data.current.apparent_temperature),
          uvIndex: 0,
          icon: getWeatherFromWMO(data.current.weather_code).icon
        },
        forecast: data.daily.time.slice(0, config.numberOfDays + 1).map((dateStr, idx) => ({
          day: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
          date: config.displayDates ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null,
          high: Math.round(data.daily.temperature_2m_max[idx]),
          low: Math.round(data.daily.temperature_2m_min[idx]),
          condition: getWeatherFromWMO(data.daily.weather_code[idx]).condition,
          precipitation: Math.round(data.daily.precipitation_probability_max[idx] || 0),
          wind: Math.round(data.daily.wind_speed_10m_max[idx]),
          icon: getWeatherFromWMO(data.daily.weather_code[idx]).icon
        })),
        alerts: []
      };

      setCurrentLocation(locationName);
      setWeatherData(transformedData);
      setLoading(false);
    } catch (err) {
      // Only handle error if not aborted
      if (err.name !== 'AbortError') {
        console.error('Weather fetch error:', err);
        setError(err.message);
        setWeatherData(MOCK_WEATHER);
        setLoading(false);
      }
    }
  }, [config.preferredUnits, config.numberOfDays, config.displayDates]);

  // Auto-detect location using geolocation
  const detectLocation = useCallback((options = {}) => {
    const { signal } = options;
    
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setGeoError(null);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // Check if aborted before proceeding
        if (signal?.aborted) return;
        
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode to get location name using Open-Meteo
          const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`,
            { signal }
          );
          
          if (!response.ok) throw new Error('Failed to get location name');
          
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            const { name, admin1, country } = data.results[0];
            const locationName = admin1 ? `${name}, ${admin1}` : `${name}, ${country}`;
            setCurrentLocation(locationName);
            
            // Fetch weather directly with coordinates
            fetchWeatherByCoordinates(latitude, longitude, locationName, { signal });
          }
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.error('Geolocation error:', err);
            setError('Failed to detect location');
            setLoading(false);
          }
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        setGeoError('Unable to retrieve your location. Please check your browser permissions.');
        setLoading(false);
      }
    );
  }, [fetchWeatherByCoordinates]);

  // Fetch weather on mount and when location/config changes
  useEffect(() => {
    const controller = new AbortController();
    
    if (config.useGeolocation) {
      detectLocation({ signal: controller.signal });
    } else {
      fetchWeatherData(currentLocation, { signal: controller.signal });
    }
    
    return () => controller.abort();
  }, [config.preferredUnits, config.useGeolocation, currentLocation, detectLocation, fetchWeatherData]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const controller = new AbortController();
    
    const interval = setInterval(() => {
      if (config.useGeolocation) {
        detectLocation({ signal: controller.signal });
      } else {
        fetchWeatherData(currentLocation, { signal: controller.signal });
      }
    }, 600000); // 10 minutes

    return () => {
      clearInterval(interval);
      controller.abort();
    };
  }, [currentLocation, config.useGeolocation, detectLocation, fetchWeatherData]);

  // Load Google Font if selected
  useEffect(() => {
    if (config.googleFont !== 'none') {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${config.googleFont}&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      return () => {
        try {
          if (link && document.head.contains(link)) {
            document.head.removeChild(link);
          }
        } catch (e) {
          console.warn('Font cleanup error:', e);
        }
      };
    }
  }, [config.googleFont]);

  // Listen for system dark mode changes
  useEffect(() => {
    if (config.appearanceMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e) => setIsDark(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else if (config.appearanceMode === 'dark') {
      setIsDark(true);
    } else if (config.appearanceMode === 'light') {
      setIsDark(false);
    }
  }, [config.appearanceMode]);

  // Get colors based on appearance mode
  const textColor = isDark ? config.textColorDark : config.textColorLight;
  
  // Get font family based on config (memoized)
  const fontFamily = useMemo(() => {
    if (config.googleFont && config.googleFont !== 'none') {
      return `"${String(config.googleFont).replace(/\+/g, ' ')}", system-ui, sans-serif`;
    }
    
    switch (config.textFontFamily) {
      case 'serif':
        return 'Georgia, serif';
      case 'mono':
        return 'ui-monospace, monospace';
      default:
        return JAZER_BRAND.fonts.body;
    }
  }, [config.googleFont, config.textFontFamily]);

  // Get background texture pattern (memoized)
  const bgTexture = useMemo(() => {
    if (config.backgroundTexture === 'none') return '';
    
    const textures = {
      noise: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="300" height="300" filter="url(%23n)" opacity="0.05"/%3E%3C/svg%3E',
      stars: 'radial-gradient(2px 2px at 20px 30px, white, transparent), radial-gradient(2px 2px at 60px 70px, white, transparent), radial-gradient(1px 1px at 50px 50px, white, transparent), radial-gradient(1px 1px at 130px 80px, white, transparent), radial-gradient(2px 2px at 90px 10px, white, transparent)',
      dots: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
      grid: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
      waves: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)'
    };
    
    return textures[config.backgroundTexture] || '';
  }, [config.backgroundTexture]);

  // Apply preset themes (memoized)
  const presetTheme = useMemo(() => {
    if (config.presetTheme === 'none') return {};
    
    const themes = {
      cyberpunk: {
        primary: JAZER_BRAND.colors.neonPink,
        secondary: JAZER_BRAND.colors.electricPurple,
        gradient: `linear-gradient(135deg, ${JAZER_BRAND.colors.neonPink}, ${JAZER_BRAND.colors.electricPurple})`,
        glow: '0 0 20px rgba(236, 72, 153, 0.5)'
      },
      stealth: {
        primary: JAZER_BRAND.colors.graphite,
        secondary: JAZER_BRAND.colors.nightBlack,
        gradient: `linear-gradient(135deg, ${JAZER_BRAND.colors.graphite}, ${JAZER_BRAND.colors.nightBlack})`,
        glow: 'none'
      },
      ocean: {
        primary: JAZER_BRAND.colors.aetherTeal,
        secondary: JAZER_BRAND.colors.cosmicBlue,
        gradient: `linear-gradient(135deg, ${JAZER_BRAND.colors.aetherTeal}, ${JAZER_BRAND.colors.cosmicBlue})`,
        glow: '0 0 15px rgba(6, 182, 212, 0.4)'
      },
      sunset: {
        primary: JAZER_BRAND.colors.sunburstGold,
        secondary: JAZER_BRAND.colors.neonPink,
        gradient: `linear-gradient(135deg, ${JAZER_BRAND.colors.sunburstGold}, ${JAZER_BRAND.colors.neonPink})`,
        glow: '0 0 20px rgba(245, 158, 11, 0.5)'
      },
      forest: {
        primary: '#10b981',
        secondary: '#059669',
        gradient: 'linear-gradient(135deg, #10b981, #059669)',
        glow: '0 0 15px rgba(16, 185, 129, 0.4)'
      },
      neon: {
        primary: JAZER_BRAND.colors.ultraviolet,
        secondary: JAZER_BRAND.colors.neonPink,
        gradient: JAZER_BRAND.gradient,
        glow: JAZER_BRAND.glow
      },
      midnight: {
        primary: JAZER_BRAND.colors.nightBlack,
        secondary: JAZER_BRAND.colors.ultraviolet,
        gradient: `linear-gradient(135deg, ${JAZER_BRAND.colors.nightBlack}, ${JAZER_BRAND.colors.ultraviolet})`,
        glow: '0 0 10px rgba(167, 139, 250, 0.3)'
      }
    };
    
    return themes[config.presetTheme] || {};
  }, [config.presetTheme]);
  
  // Dynamic gradient backgrounds based on weather condition (memoized)
  const bgColor = useMemo(() => {
    if (config.useTransparentBackground) return 'transparent';
    if (config.setBackgroundColor && !weatherData) return config.backgroundColor;
    
    // Apply preset theme if selected
    if (config.presetTheme !== 'none' && presetTheme.gradient) {
      return presetTheme.gradient;
    }
    
    const condition = weatherData?.current?.icon || 'clear';
    const gradients = {
      clear: `linear-gradient(135deg, ${JAZER_BRAND.colors.sunburstGold} 0%, ${JAZER_BRAND.colors.cosmicBlue} 100%)`,
      sunny: `linear-gradient(135deg, ${JAZER_BRAND.colors.sunburstGold} 0%, ${JAZER_BRAND.colors.cosmicBlue} 100%)`,
      clouds: `linear-gradient(135deg, ${JAZER_BRAND.colors.softSlate} 0%, ${JAZER_BRAND.colors.graphite} 100%)`,
      cloudy: `linear-gradient(135deg, ${JAZER_BRAND.colors.softSlate} 0%, ${JAZER_BRAND.colors.graphite} 100%)`,
      rain: `linear-gradient(135deg, ${JAZER_BRAND.colors.cosmicBlue} 0%, ${JAZER_BRAND.colors.graphite} 100%)`,
      rainy: `linear-gradient(135deg, ${JAZER_BRAND.colors.cosmicBlue} 0%, ${JAZER_BRAND.colors.graphite} 100%)`,
      drizzle: `linear-gradient(135deg, ${JAZER_BRAND.colors.aetherTeal} 0%, ${JAZER_BRAND.colors.cosmicBlue} 100%)`,
      thunderstorm: `linear-gradient(135deg, ${JAZER_BRAND.colors.electricPurple} 0%, ${JAZER_BRAND.colors.nightBlack} 100%)`,
      snow: `linear-gradient(135deg, ${JAZER_BRAND.colors.stardustWhite} 0%, ${JAZER_BRAND.colors.cosmicBlue} 100%)`,
      mist: `linear-gradient(135deg, ${JAZER_BRAND.colors.softSlate} 0%, ${JAZER_BRAND.colors.stardustWhite} 100%)`,
      fog: `linear-gradient(135deg, ${JAZER_BRAND.colors.softSlate} 0%, ${JAZER_BRAND.colors.stardustWhite} 100%)`
    };
    
    return config.setBackgroundColor 
      ? config.backgroundColor 
      : (gradients[condition] || (isDark ? JAZER_BRAND.colors.nightBlack : JAZER_BRAND.colors.stardustWhite));
  }, [config.useTransparentBackground, config.setBackgroundColor, config.backgroundColor, config.presetTheme, presetTheme, weatherData, isDark]);
  
  // Glassmorphism styles for transparent background (memoized)
  const glassmorphismStyles = useMemo(() => {
    return config.useTransparentBackground ? {
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      backgroundColor: isDark ? 'rgba(11, 14, 18, 0.7)' : 'rgba(248, 249, 255, 0.7)',
      borderRadius: '12px',
      border: `1px solid ${isDark ? 'rgba(248, 249, 255, 0.1)' : 'rgba(11, 14, 18, 0.1)'}`
    } : {};
  }, [config.useTransparentBackground, isDark]);

  const textShadow = config.textShadows ? '0 2px 4px rgba(0,0,0,0.1)' : 'none';
  const glowEffect = config.glowEffect ? (presetTheme.glow || JAZER_BRAND.glow) : 'none';
  
  // Gradient text style (memoized)
  const gradientTextStyle = useMemo(() => {
    return config.gradientText ? {
      background: presetTheme.gradient || JAZER_BRAND.gradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    } : {};
  }, [config.gradientText, presetTheme.gradient]);

  // Convert temperature based on units (API already returns in correct units)
  const convertTemp = (temp) => Math.round(temp);

  const tempUnit = config.preferredUnits === 'metric' ? '°C' : '°F';
  const windUnit = config.preferredUnits === 'metric' ? 'km/h' : 'mph';

  // Use real data or fallback to mock
  const currentWeather = weatherData || MOCK_WEATHER;

  // Filter forecast days
  const forecastDays = currentWeather.forecast
    .slice(config.hideTodayInForecast ? 1 : 0)
    .slice(0, config.numberOfDays);

  // Render current weather field
  const renderCurrentField = (field) => {
    const { current } = currentWeather;
    switch (field) {
      case 'temperature':
        return (
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold" style={{ fontFamily: JAZER_BRAND.fonts.heading, fontSize: `${48 * config.fontScale}px` }}>
              {convertTemp(current.temperature)}{tempUnit}
            </span>
          </div>
        );
      case 'condition':
        return <span className="text-lg opacity-80" style={{ fontSize: `${18 * config.fontScale}px` }}>{current.condition}</span>;
      case 'humidity':
        return (
          <div className="flex items-center gap-1 text-sm" style={{ fontSize: `${14 * config.fontScale}px` }}>
            <Droplets size={16 * config.fontScale} />
            <span>Humidity: {current.humidity}%</span>
          </div>
        );
      case 'wind':
        return (
          <div className="flex items-center gap-1 text-sm" style={{ fontSize: `${14 * config.fontScale}px` }}>
            <Wind size={16 * config.fontScale} />
            <span>Wind: {current.wind} {windUnit}</span>
          </div>
        );
      case 'feelsLike':
        return <span className="text-sm" style={{ fontSize: `${14 * config.fontScale}px` }}>Feels like: {convertTemp(current.feelsLike)}{tempUnit}</span>;
      case 'uvIndex':
        return <span className="text-sm" style={{ fontSize: `${14 * config.fontScale}px` }}>UV Index: {current.uvIndex}</span>;
      default:
        return null;
    }
  };

  // Layout class based on orientation
  const getLayoutClass = () => {
    switch (config.orientation) {
      case 'horizontal':
        return 'flex-row';
      case 'compact':
        return 'flex-col max-w-xs';
      case 'wide':
        return 'flex-row w-full';
      default: // auto
        return 'flex-col md:flex-row';
    }
  };
  
  // Build background styles properly to avoid conflicts
  const backgroundStyles = useMemo(() => {
    const styles = {};
    const isGradient = typeof bgColor === 'string' && bgColor.includes('gradient');
    
    if (isGradient) {
      // For gradients, combine with texture using comma-separated backgrounds
      if (bgTexture) {
        styles.backgroundImage = `${bgTexture}, ${bgColor}`;
      } else {
        styles.backgroundImage = bgColor;
      }
    } else {
      // For solid colors, use backgroundColor and backgroundImage separately
      styles.backgroundColor = bgColor;
      if (bgTexture) {
        styles.backgroundImage = bgTexture;
      }
    }
    
    styles.backgroundSize = config.backgroundTexture === 'dots' || config.backgroundTexture === 'grid' 
      ? '20px 20px' 
      : 'auto';
    
    return styles;
  }, [bgColor, bgTexture, config.backgroundTexture]);

  return (
    <div
      className="h-full w-full p-6"
      style={{
        ...backgroundStyles,
        color: textColor,
        fontFamily: fontFamily,
        textAlign: config.textAlign,
        boxShadow: glowEffect,
        ...glassmorphismStyles
      }}
      role="region"
      aria-label="Weather widget"
    >
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* Geolocation Error Display */}
          {geoError && (
            <div 
              className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm"
              role="alert"
              aria-live="polite"
            >
              <AlertTriangle size={16} className="inline mr-2" aria-hidden="true" />
              {geoError}
            </div>
          )}

          {/* Severe Weather Alerts */}
          {config.showSevereAlerts && weatherData?.alerts && weatherData.alerts.length > 0 && (
            <div className="mb-4">
              {weatherData.alerts.slice(0, 2).map((alert, idx) => (
                <SevereWeatherAlert key={idx} alert={alert} />
              ))}
            </div>
          )}

          <div className={`flex gap-6 ${getLayoutClass()}`}>
            {/* Current Weather */}
            <div className="flex-shrink-0">
              <div className="flex items-center gap-3 mb-2">
                <WeatherIcon
                  condition={currentWeather.current.icon}
                  animate={config.animateIcons}
                  greyscale={config.greyscaleIcons}
                  size={48 * config.fontScale}
                />
                <div>
                  <h2 className="text-xl font-bold" style={{ 
                    fontFamily: JAZER_BRAND.fonts.heading, 
                    textShadow, 
                    fontSize: `${20 * config.fontScale}px`,
                    ...gradientTextStyle
                  }}>
                    {currentLocation}
                  </h2>
                  {config.useGeolocation && (
                    <button
                      onClick={() => detectLocation()}
                      className="flex items-center gap-1 text-xs opacity-70 hover:opacity-100 transition-opacity mt-1"
                      style={{ fontSize: `${12 * config.fontScale}px` }}
                      aria-label="Detect your current location"
                    >
                      <MapPin size={12 * config.fontScale} aria-hidden="true" />
                      Detect Location
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2" style={{ textShadow }}>
                {config.currentWeatherFields.slice(0, 4).map((field, idx) => (
                  <div key={idx}>{renderCurrentField(field)}</div>
                ))}
              </div>
            </div>

            {/* Forecast */}
            <div className="flex-1" role="region" aria-label="Weather forecast">
              <h3 className="text-sm font-semibold uppercase tracking-wider opacity-70 mb-3" style={{ textShadow, fontSize: `${14 * config.fontScale}px` }}>
                {config.numberOfDays}-Day Forecast
              </h3>

              <div className={`grid gap-3 ${config.orientation === 'horizontal' ? 'grid-cols-5' : 'grid-cols-3 md:grid-cols-5'}`}>
                {forecastDays.map((day, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${config.visuallyGroupForecast ? 'bg-opacity-10 bg-current' : ''}`}
                    style={{
                      textAlign: 'center',
                      textShadow,
                      ...(config.visuallyGroupForecast && {
                        backgroundColor: isDark
                          ? 'rgba(248, 249, 255, 0.1)'
                          : 'rgba(11, 14, 18, 0.05)'
                      })
                    }}
                  >
                    <div className="text-xs font-semibold mb-2 opacity-70" style={{ fontSize: `${12 * config.fontScale}px` }}>
                      {day.day}
                      {config.displayDates && day.date && (
                        <div className="text-xs opacity-50" style={{ fontSize: `${10 * config.fontScale}px` }}>{day.date}</div>
                      )}
                    </div>
                    <WeatherIcon
                      condition={day.icon}
                      animate={config.animateIcons}
                      greyscale={config.greyscaleIcons}
                      size={24 * config.fontScale}
                    />
                    <div className="mt-2 space-y-1">
                      {config.dailyWeatherFields.includes('high') && (
                        <div className="text-sm font-bold" style={{ fontSize: `${14 * config.fontScale}px` }}>{convertTemp(day.high)}{tempUnit}</div>
                      )}
                      {config.dailyWeatherFields.includes('low') && (
                        <div className="text-xs opacity-60" style={{ fontSize: `${12 * config.fontScale}px` }}>{convertTemp(day.low)}{tempUnit}</div>
                      )}
                      {config.dailyWeatherFields.includes('condition') && (
                        <div className="text-xs opacity-70" style={{ fontSize: `${12 * config.fontScale}px` }}>{day.condition}</div>
                      )}
                      {config.dailyWeatherFields.includes('precipitation') && day.precipitation > 0 && (
                        <div className="text-xs flex items-center justify-center gap-1" style={{ fontSize: `${12 * config.fontScale}px` }}>
                          <Droplets size={10 * config.fontScale} aria-hidden="true" />
                          {day.precipitation}%
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div 
              className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm flex items-center justify-between"
              role="alert"
              aria-live="assertive"
            >
              <span>{error}</span>
              <button
                onClick={() => {
                  if (config.useGeolocation) {
                    detectLocation();
                  } else {
                    fetchWeatherData(currentLocation);
                  }
                }}
                className="ml-3 px-3 py-1 bg-red-200 hover:bg-red-300 rounded text-red-800 text-xs font-medium transition-colors"
                aria-label="Retry fetching weather data"
              >
                Retry
              </button>
            </div>
          )}

          {/* Customize button */}
          {config.showCustomizeButton && (
            <button
              className="absolute bottom-4 right-4 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
              style={{
                backgroundColor: JAZER_BRAND.colors.cosmicBlue,
                color: JAZER_BRAND.colors.stardustWhite,
                fontFamily: JAZER_BRAND.fonts.heading,
                fontSize: `${14 * config.fontScale}px`
              }}
              aria-label="Customize weather widget settings"
            >
              Customize
            </button>
          )}
        </>
      )}
    </div>
  );
};

// PropTypes validation for config prop
WeatherWidget.propTypes = {
  config: PropTypes.shape({
    weatherLocation: PropTypes.string,
    useGeolocation: PropTypes.bool,
    preferredUnits: PropTypes.oneOf(['metric', 'imperial']),
    numberOfDays: PropTypes.number,
    displayDates: PropTypes.bool,
    hideTodayInForecast: PropTypes.bool,
    currentWeatherFields: PropTypes.arrayOf(PropTypes.string),
    dailyWeatherFields: PropTypes.arrayOf(PropTypes.string),
    showSevereAlerts: PropTypes.bool,
    showCustomizeButton: PropTypes.bool,
    appearanceMode: PropTypes.oneOf(['light', 'dark', 'system']),
    textColorLight: PropTypes.string,
    textColorDark: PropTypes.string,
    textFontFamily: PropTypes.oneOf(['sans', 'serif', 'mono']),
    googleFont: PropTypes.string,
    fontScale: PropTypes.number,
    textAlign: PropTypes.oneOf(['left', 'center', 'right']),
    textShadows: PropTypes.bool,
    gradientText: PropTypes.bool,
    glowEffect: PropTypes.bool,
    animateIcons: PropTypes.bool,
    greyscaleIcons: PropTypes.bool,
    useTransparentBackground: PropTypes.bool,
    setBackgroundColor: PropTypes.bool,
    backgroundColor: PropTypes.string,
    backgroundTexture: PropTypes.oneOf(['none', 'noise', 'stars', 'dots', 'grid', 'waves']),
    presetTheme: PropTypes.oneOf(['none', 'cyberpunk', 'stealth', 'ocean', 'sunset', 'forest', 'neon', 'midnight']),
    orientation: PropTypes.oneOf(['auto', 'horizontal', 'compact', 'wide']),
    visuallyGroupForecast: PropTypes.bool,
  }).isRequired,
};
