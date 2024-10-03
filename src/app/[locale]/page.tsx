'use client';

import { useTranslations } from 'next-intl';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import { cepCodeMask } from '@/helpers';
import { useRef, useState } from 'react';
import Api from '@/api';
import { cepDetails } from '@/types/api/sources/viaCep';
import { Autorenew } from '@mui/icons-material';
import { setCookie, getCookie } from 'cookies-next';
import { weatherData } from '@/types/api/sources/accuWeather';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface SearchData {
  weatherData: weatherData;
  cepData: cepDetails;
}

export default function Home() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations('HomePage');
  const inputCepRef = useRef<HTMLInputElement>(null);

  function updateSearchHistory(newSearchData: SearchData): SearchData[] {
    const existingCookie = getCookie('searchHistory');

    const searchHistory: SearchData[] = existingCookie
      ? JSON.parse(existingCookie as string)
      : [];

    const existingIndex = searchHistory.findIndex(
      (item) => item.cepData.cep === newSearchData.cepData.cep
    );

    if (existingIndex !== -1) {
      searchHistory.splice(existingIndex, 1);
    } else if (searchHistory.length >= 10) {
      searchHistory.pop();
    }

    searchHistory.unshift(newSearchData);

    return searchHistory;
  }

  async function handleSearch() {
    setIsLoading(true);

    const loadingToast = toast.loading(t('loading'));

    try {
      const cep = inputCepRef.current?.value;
      const currentLocale = navigator.language;

      console.log(currentLocale);

      if (!cep) return;

      const cepData = await Api({ source: 'viaCep', params: { cep, t } });

      if (cepData?.errorMessage) {
        toast.error(cepData.errorMessage);
        return;
      }

      let weatherData = await Api({
        source: 'accuWeather',
        params: {
          cityName: `${(cepData.response as cepDetails)?.localidade}, ${
            (cepData.response as cepDetails)?.uf
          }`,
          t,
          locale: currentLocale,
        },
      });

      if (weatherData.errorMessage) {
        toast.error(weatherData.errorMessage);
        return;
      }

      if (cepData.response && weatherData.response) {
        let weatherDataToSave = weatherData.response as weatherData;

        weatherDataToSave.searchDate = new Date().toISOString();

        const newSearchData: SearchData = {
          weatherData: weatherDataToSave,
          cepData: cepData.response as cepDetails,
        };

        const updatedHistory = updateSearchHistory(newSearchData);

        setCookie('searchHistory', JSON.stringify(updatedHistory), {
          maxAge: 2678400,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(t('unexpectedError'));
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="absolute top-4 right-4">
        <button
          className="p-4 rounded-full text-textSecondary hover:cursor-pointer"
          aria-label="History"
        >
          <HistoryIcon
            fontSize="large"
            onClick={() => router.push('/historic')}
          />
        </button>
      </div>
      <div className="relative w-full max-w-xl shadow-primary rounded-md focus:shadow-none hover:shadow-none">
        <input
          ref={inputCepRef}
          type="text"
          id="cepInput"
          placeholder={t('zipPlaceholder')}
          className="rounded-md w-full p-4 pl-5 pr-16 text-md border-none outline-none font-medium text-textPrimary"
          onInput={cepCodeMask}
          maxLength={9}
          disabled={isLoading}
        />
        <button
          onClick={() => handleSearch()}
          className="rounded-l-none rounded-md absolute top-0 right-0 w-20 h-full bg-secondary flex items-center justify-center text-white shadow-lg hover:bg-secondaryHover"
        >
          {isLoading ? <Autorenew className="animate-spin" /> : <SearchIcon />}
        </button>
      </div>
    </div>
  );
}
