import { useTranslations } from 'next-intl';
import { cepDetails } from './sources/viaCep';
import { weatherData } from './sources/accuWeather';

interface Props {
  source: string;
  params: {
    cep?: string;
    cityName?: string;
    t: ReturnType<typeof useTranslations>;
    locale?: string;
  };
}

interface Response {
  errorMessage: string;
  response: weatherData | cepDetails | null;
}

export type { Props, Response };
