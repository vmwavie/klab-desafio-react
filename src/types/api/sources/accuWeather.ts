import { useTranslations } from 'next-intl';

interface getLocationByCityNameParams {
  t: ReturnType<typeof useTranslations>;
  cityName: string;
  locale: string;
}

interface getLocationByCityNameResponse {
  key: string;
  errorMessage: string;
}

interface getWeatherByCityNameParams {
  t: ReturnType<typeof useTranslations>;
  cityName: string;
  locale: string;
}

interface weatherData {
  minTemperature: number;
  maxTemperature: number;
  temperatureType: string;
  searchDate: string;
  iconName: string;
}

interface getWeatherByCityNameResponse {
  weatherResponse: weatherData;
  errorMessage: string;
}

type WeatherGroup =
  | 'Thunder'
  | 'ThunderWithRain'
  | 'Sun'
  | 'Rain'
  | 'Hurricane'
  | 'Clouds';

const weatherGroupMap: Record<string, WeatherGroup> = {
  Thunderstorms: 'Thunder',
  'Mostly Cloudy with Thunderstorms': 'Thunder',
  'Partly Cloudy with Thunderstorms': 'Thunder',

  'Showers with Thunderstorms': 'ThunderWithRain',
  'Rain with Thunderstorms': 'ThunderWithRain',

  Sunny: 'Sun',
  'Mostly Sunny': 'Sun',
  'Partly Sunny': 'Sun',
  'Hazy Sunshine': 'Sun',
  Hot: 'Sun',

  Rain: 'Rain',
  Showers: 'Rain',
  'Mostly Cloudy with Showers': 'Rain',
  'Partly Cloudy with Showers': 'Rain',
  'Freezing Rain': 'Rain',
  Sleet: 'Rain',

  Hurricane: 'Hurricane',
  'Tropical Storm': 'Hurricane',

  Cloudy: 'Clouds',
  'Mostly Cloudy': 'Clouds',
  'Partly Cloudy': 'Clouds',
  'Intermittent Clouds': 'Clouds',
  Dreary: 'Clouds',
  Fog: 'Clouds',
  'Hazy Moonlight': 'Clouds',
};

export type {
  getLocationByCityNameParams,
  getLocationByCityNameResponse,
  getWeatherByCityNameParams,
  getWeatherByCityNameResponse,
  weatherData,
  WeatherGroup,
};

export { weatherGroupMap };
