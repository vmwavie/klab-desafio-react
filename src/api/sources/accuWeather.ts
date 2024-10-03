import { isDangerousInput, normalizeCityName } from '@/helpers';
import {
  getLocationByCityNameParams,
  getLocationByCityNameResponse,
  getWeatherByCityNameParams,
  getWeatherByCityNameResponse,
  weatherData,
} from '@/types/api/sources/accuWeather';
import axios from 'axios';

const BASE_URL: string = 'https://dataservice.accuweather.com/';
const API_KEY: string = 'lNG8O4GqNsonmBaUmGMkQSr0Gn8ONH5F';

async function getLocationByCityName({
  cityName,
  t,
  locale,
}: getLocationByCityNameParams): Promise<getLocationByCityNameResponse> {
  let errorMessage: string = '';
  let key: string = '';

  try {
    if (!API_KEY) {
      errorMessage = t('envError');
      throw new Error();
    }

    if (isDangerousInput(cityName)) {
      throw new Error();
    }

    const cityNameFormated: string = normalizeCityName(cityName);

    const axiosResponse = await axios.get(
      `${BASE_URL}locations/v1/cities/search?apikey=${API_KEY}&q=${cityNameFormated}&language=${locale}`
    );

    if (!axiosResponse.data[0]?.Key) {
      errorMessage = t('cityNotFound');
      throw new Error();
    }

    key = axiosResponse.data[0].Key;
  } catch (error) {
    errorMessage = errorMessage ? errorMessage : t('unexpectedError');
    console.error(error);
  }

  return {
    key,
    errorMessage,
  };
}

async function getWeatherByCityName({
  cityName,
  t,
  locale,
}: getWeatherByCityNameParams): Promise<getWeatherByCityNameResponse> {
  let errorMessage: string = '';
  const weatherResponse: weatherData = {
    minTemperature: 0,
    maxTemperature: 0,
    temperatureType: '',
    searchDate: '',
  };

  try {
    if (!API_KEY) {
      errorMessage = t('envError');
      throw new Error();
    }

    const locationKey: getLocationByCityNameResponse =
      await getLocationByCityName({ cityName, t, locale });

    if (locationKey.errorMessage) {
      errorMessage = locationKey.errorMessage;
      throw new Error();
    }

    const axiosResponse = await axios.get(
      `${BASE_URL}/forecasts/v1/daily/1day/${locationKey.key}?apikey=${API_KEY}&language=${locale}&metric=true`
    );

    if (
      axiosResponse.data?.DailyForecasts?.length === 0 ||
      axiosResponse.data?.Headline?.length === 0
    ) {
      errorMessage = t('cityNotFound');
      throw new Error();
    }

    weatherResponse.minTemperature =
      axiosResponse.data.DailyForecasts[0].Temperature.Minimum.Value;
    weatherResponse.maxTemperature =
      axiosResponse.data.DailyForecasts[0].Temperature.Maximum.Value;
    weatherResponse.temperatureType = axiosResponse.data.Headline.Text;
    weatherResponse.searchDate = axiosResponse.data.Headline.EffectiveDate;
  } catch (error) {
    errorMessage = errorMessage ? errorMessage : t('unexpectedError');
    console.log(error);
  }

  return {
    weatherResponse,
    errorMessage,
  };
}

export { getLocationByCityName, getWeatherByCityName };
