import React, { useState, useEffect } from 'react';
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

// Weather icon component
const WeatherIcon = ({ condition, animate, greyscale, size = 32 }) => {
  const iconProps = {
    size,
    className: `${animate ? 'animate-pulse' : ''} ${greyscale ? 'grayscale' : ''}`,
    style: { color: greyscale ? JAZER_BRAND.colors.softSlate : JAZER_BRAND.colors.sunburstGold }
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

  return conditionMap[condition?.toLowerCase()] || <CloudSun {...iconProps} style={{ ...iconProps.style, color: JAZER_BRAND.colors.aetherTeal }} />;
};

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
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
  const fetchWeatherData = async (location) => {
    setLoading(true);
    setError(null);

    try {
      // Geocode the location using Open-Meteo Geocoding API
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
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
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}&precipitation_unit=${precipUnit}&timezone=auto`
      );

      if (!weatherResponse.ok) throw new Error('Failed to fetch weather data');

      const data = await weatherResponse.json();

      // Map WMO weather codes to conditions
      const getConditionFromWMO = (code) => {
        if (code === 0) return 'Clear';
        if (code <= 3) return 'Partly Cloudy';
        if (code <= 48) return 'Fog';
        if (code <= 67) return 'Rain';
        if (code <= 77) return 'Snow';
        if (code <= 82) return 'Rain';
        if (code <= 86) return 'Snow';
        if (code <= 99) return 'Thunderstorm';
        return 'Cloudy';
      };

      const getIconFromWMO = (code) => {
        if (code === 0) return 'clear';
        if (code <= 3) return 'partly-cloudy';
        if (code <= 48) return 'fog';
        if (code <= 57) return 'drizzle';
        if (code <= 67) return 'rain';
        if (code <= 77) return 'snow';
        if (code <= 82) return 'rain';
        if (code <= 86) return 'snow';
        if (code >= 95) return 'thunderstorm';
        return 'clouds';
      };

      // Transform API data to our format
      const transformedData = {
        current: {
          temperature: Math.round(data.current.temperature_2m),
          condition: getConditionFromWMO(data.current.weather_code),
          humidity: Math.round(data.current.relative_humidity_2m),
          wind: Math.round(data.current.wind_speed_10m),
          feelsLike: Math.round(data.current.apparent_temperature),
          uvIndex: 0, // Open-Meteo doesn't provide UV index in free tier
          icon: getIconFromWMO(data.current.weather_code)
        },
        forecast: data.daily.time.slice(0, config.numberOfDays + 1).map((dateStr, idx) => ({
          day: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
          date: config.displayDates ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null,
          high: Math.round(data.daily.temperature_2m_max[idx]),
          low: Math.round(data.daily.temperature_2m_min[idx]),
          condition: getConditionFromWMO(data.daily.weather_code[idx]),
          precipitation: Math.round(data.daily.precipitation_probability_max[idx] || 0),
          wind: Math.round(data.daily.wind_speed_10m_max[idx]),
          icon: getIconFromWMO(data.daily.weather_code[idx])
        })),
        alerts: [] // Open-Meteo free tier doesn't include alerts
      };

      setWeatherData(transformedData);
      setLoading(false);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err.message);
      setWeatherData(MOCK_WEATHER);
      setLoading(false);
    }
  };

  // Auto-detect location using geolocation
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode to get location name using Open-Meteo
          const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`
          );
          
          if (!response.ok) throw new Error('Failed to get location name');
          
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            const { name, admin1, country } = data.results[0];
            const locationName = admin1 ? `${name}, ${admin1}` : `${name}, ${country}`;
            setCurrentLocation(locationName);
            
            // Fetch weather directly with coordinates
            fetchWeatherByCoordinates(latitude, longitude, locationName);
          }
        } catch (err) {
          console.error('Geolocation error:', err);
          setError('Failed to detect location');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        alert('Unable to retrieve your location');
        setLoading(false);
      }
    );
  };

  // Fetch weather by coordinates (for geolocation)
  const fetchWeatherByCoordinates = async (latitude, longitude, locationName) => {
    setLoading(true);
    setError(null);

    try {
      const tempUnit = config.preferredUnits === 'metric' ? 'celsius' : 'fahrenheit';
      const windUnit = config.preferredUnits === 'metric' ? 'kmh' : 'mph';
      const precipUnit = config.preferredUnits === 'metric' ? 'mm' : 'inch';
      
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}&precipitation_unit=${precipUnit}&timezone=auto`
      );

      if (!weatherResponse.ok) throw new Error('Failed to fetch weather data');

      const data = await weatherResponse.json();

      const getConditionFromWMO = (code) => {
        if (code === 0) return 'Clear';
        if (code <= 3) return 'Partly Cloudy';
        if (code <= 48) return 'Fog';
        if (code <= 67) return 'Rain';
        if (code <= 77) return 'Snow';
        if (code <= 82) return 'Rain';
        if (code <= 86) return 'Snow';
        if (code <= 99) return 'Thunderstorm';
        return 'Cloudy';
      };

      const getIconFromWMO = (code) => {
        if (code === 0) return 'clear';
        if (code <= 3) return 'partly-cloudy';
        if (code <= 48) return 'fog';
        if (code <= 57) return 'drizzle';
        if (code <= 67) return 'rain';
        if (code <= 77) return 'snow';
        if (code <= 82) return 'rain';
        if (code <= 86) return 'snow';
        if (code >= 95) return 'thunderstorm';
        return 'clouds';
      };

      const transformedData = {
        current: {
          temperature: Math.round(data.current.temperature_2m),
          condition: getConditionFromWMO(data.current.weather_code),
          humidity: Math.round(data.current.relative_humidity_2m),
          wind: Math.round(data.current.wind_speed_10m),
          feelsLike: Math.round(data.current.apparent_temperature),
          uvIndex: 0,
          icon: getIconFromWMO(data.current.weather_code)
        },
        forecast: data.daily.time.slice(0, config.numberOfDays + 1).map((dateStr, idx) => ({
          day: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
          date: config.displayDates ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null,
          high: Math.round(data.daily.temperature_2m_max[idx]),
          low: Math.round(data.daily.temperature_2m_min[idx]),
          condition: getConditionFromWMO(data.daily.weather_code[idx]),
          precipitation: Math.round(data.daily.precipitation_probability_max[idx] || 0),
          wind: Math.round(data.daily.wind_speed_10m_max[idx]),
          icon: getIconFromWMO(data.daily.weather_code[idx])
        })),
        alerts: []
      };

      setCurrentLocation(locationName);
      setWeatherData(transformedData);
      setLoading(false);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err.message);
      setWeatherData(MOCK_WEATHER);
      setLoading(false);
    }
  };

  // Fetch weather on mount and when location changes
  useEffect(() => {
    if (config.useGeolocation) {
      detectLocation();
    } else {
      fetchWeatherData(currentLocation);
    }
  }, [config.preferredUnits]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (config.useGeolocation) {
        detectLocation();
      } else {
        fetchWeatherData(currentLocation);
      }
    }, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, [currentLocation, config.useGeolocation]);

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
  
  // Dynamic gradient backgrounds based on weather condition
  const getWeatherGradient = () => {
    if (config.useTransparentBackground) return 'transparent';
    if (config.setBackgroundColor && !weatherData) return config.backgroundColor;
    
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
  };
  
  const bgColor = getWeatherGradient();
  
  // Glassmorphism styles for transparent background
  const glassmorphismStyles = config.useTransparentBackground ? {
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    backgroundColor: isDark ? 'rgba(11, 14, 18, 0.7)' : 'rgba(248, 249, 255, 0.7)',
    borderRadius: '12px',
    border: `1px solid ${isDark ? 'rgba(248, 249, 255, 0.1)' : 'rgba(11, 14, 18, 0.1)'}`
  } : {};

  const textShadow = config.textShadows ? '0 2px 4px rgba(0,0,0,0.1)' : 'none';

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

  return (
    <div
      className="h-full w-full p-6"
      style={{
        background: bgColor,
        color: textColor,
        fontFamily: JAZER_BRAND.fonts.body,
        ...glassmorphismStyles
      }}
    >
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
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
                  <h2 className="text-xl font-bold" style={{ fontFamily: JAZER_BRAND.fonts.heading, textShadow, fontSize: `${20 * config.fontScale}px` }}>
                    {currentLocation}
                  </h2>
                  {config.useGeolocation && (
                    <button
                      onClick={detectLocation}
                      className="flex items-center gap-1 text-xs opacity-70 hover:opacity-100 transition-opacity mt-1"
                      style={{ fontSize: `${12 * config.fontScale}px` }}
                    >
                      <MapPin size={12 * config.fontScale} />
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
            <div className="flex-1">
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
                          <Droplets size={10 * config.fontScale} />
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
            <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
              {error}
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
            >
              Customize
            </button>
          )}
        </>
      )}
    </div>
  );
};
