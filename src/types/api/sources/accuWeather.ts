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
}

interface getWeatherByCityNameResponse {
  weatherResponse: weatherData;
  errorMessage: string;
}

export type {
  getLocationByCityNameParams,
  getLocationByCityNameResponse,
  getWeatherByCityNameParams,
  getWeatherByCityNameResponse,
  weatherData,
};
