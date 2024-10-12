import { isDangerousInput, normalizeCityName } from '@/helpers';
import {
  getLocationByCityNameParams,
  getLocationByCityNameResponse,
  getWeatherByCityNameParams,
  getWeatherByCityNameResponse,
  weatherData,
  WeatherGroup,
  weatherGroupMap,
} from '@/types/api/sources/accuWeather';

const BASE_URL: string = 'https://dataservice.accuweather.com/';

// first-api-key
const API_KEY: string = 'lNG8O4GqNsonmBaUmGMkQSr0Gn8ONH5F';
// /*second-api-key*/ const API_KEY: string = '2rR1LJzKLGNyDhGXpcOan5mL3kShXuyY';

function getWeatherGroup(iconPhrase: string): WeatherGroup {
  const iconName: WeatherGroup = weatherGroupMap[iconPhrase];
  return iconName ?? 'Sun';
}

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

    const response = await fetch(
      `${BASE_URL}locations/v1/cities/search?apikey=${API_KEY}&q=${cityNameFormated}&language=${locale}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data[0]?.Key) {
      errorMessage = t('cityNotFound');
      throw new Error();
    }

    key = data[0].Key;
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
    iconName: '',
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

    const response = await fetch(
      `${BASE_URL}/forecasts/v1/daily/1day/${locationKey.key}?apikey=${API_KEY}&language=${locale}&metric=true`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data?.DailyForecasts?.length === 0 || data?.Headline?.length === 0) {
      errorMessage = t('cityNotFound');
      throw new Error();
    }

    weatherResponse.minTemperature =
      data.DailyForecasts[0].Temperature.Minimum.Value;
    weatherResponse.maxTemperature =
      data.DailyForecasts[0].Temperature.Maximum.Value;
    weatherResponse.temperatureType = data.Headline.Text;
    weatherResponse.searchDate = data.Headline.EffectiveDate;
    weatherResponse.iconName = getWeatherGroup(
      data.DailyForecasts[0].IconPhrasePrimary
    );
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
