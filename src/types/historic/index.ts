import { cepDetails } from '@/types/api/sources/viaCep';
import { weatherData } from '@/types/api/sources/accuWeather';
import { useTranslations } from 'next-intl';

interface SearchData {
  id: string;
  weatherData: weatherData;
  cepData: cepDetails;
}

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  temperature: string;
  lastUpdateDate: string;
  translation: ReturnType<typeof useTranslations>;
}

type SortKey = 'id' | 'date' | 'address' | 'weather';
type SortDirection = 'asc' | 'desc';

export type { SortKey, SortDirection, SearchData, DetailsModalProps };
