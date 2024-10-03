import type { Props, Response } from '@/types/api';
import { weatherData } from '@/types/api/sources/accuWeather';
import { cepDetails } from '@/types/api/sources/viaCep';
import { getCepDetails } from './sources/viaCep';
import { getWeatherByCityName } from './sources/accuWeather';

async function Api({ source, params }: Props): Promise<Response> {
  let errorMessage: string = '';
  let response: weatherData | cepDetails | null = null;

  try {
    switch (source) {
      case 'viaCep':
        if (!params.cep) {
          errorMessage = params.t('cepRequired');
          throw new Error();
        }

        const viaCepResponse = await getCepDetails({
          cep: params.cep,
          t: params.t,
        });

        if (viaCepResponse.errorMessage) {
          errorMessage = viaCepResponse.errorMessage;
          throw new Error();
        }

        response = viaCepResponse.response;

        break;
      case 'accuWeather':
        if (!params.cityName) {
          errorMessage = params.t('cityNameRequired');
          throw new Error();
        }

        if (!params.locale) {
          params.locale = 'pt-br';
        }

        const accuWeatherResponse = await getWeatherByCityName({
          cityName: params.cityName,
          t: params.t,
          locale: params.locale,
        });

        if (accuWeatherResponse.errorMessage) {
          errorMessage = accuWeatherResponse.errorMessage;
          throw new Error();
        }

        response = accuWeatherResponse.weatherResponse;

        break;
      default:
        throw new Error();
    }
  } catch (error) {
    errorMessage = errorMessage ? errorMessage : params.t('unexpectedError');
    console.log('Error:', error);
  }

  return {
    errorMessage,
    response,
  };
}

export default Api;
