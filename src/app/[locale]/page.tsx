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

  function updateSearchHistory(newSearchData: SearchData): void {
    let searchHistory1: SearchData[] = JSON.parse(
      getCookie('searchHistory1') || '[]'
    );
    let searchHistory2: SearchData[] = JSON.parse(
      getCookie('searchHistory2') || '[]'
    );

    const removeExistingItem = (history: SearchData[]) =>
      history.filter((item) => item.cepData.cep !== newSearchData.cepData.cep);

    searchHistory1 = removeExistingItem(searchHistory1);
    searchHistory2 = removeExistingItem(searchHistory2);

    searchHistory1.unshift(newSearchData);

    if (searchHistory1.length > 5) {
      const overflowItem = searchHistory1.pop()!;
      searchHistory2.unshift(overflowItem);
    }

    if (searchHistory2.length > 5) {
      searchHistory2.pop();
    }

    setCookie('searchHistory1', JSON.stringify(searchHistory1), {
      maxAge: 2678400,
    });
    setCookie('searchHistory2', JSON.stringify(searchHistory2), {
      maxAge: 2678400,
    });
  }

  async function handleSearch() {
    setIsLoading(true);

    const loadingToast = toast.loading(t('loading'));

    try {
      const cep = inputCepRef.current?.value;
      const currentLocale = getCookie('NEXT_LOCALE');

      console.log(currentLocale);

      if (!cep) return;

      const cepData = await Api({ source: 'viaCep', params: { cep, t } });

      if (cepData?.errorMessage) {
        toast.error(cepData.errorMessage);
        return;
      }

      const weatherData = await Api({
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
        const weatherDataToSave = weatherData.response as weatherData;
        weatherDataToSave.searchDate = new Date().toISOString();

        const newSearchData: SearchData = {
          weatherData: weatherDataToSave,
          cepData: cepData.response as cepDetails,
        };

        setCookie('currentSearchData', JSON.stringify(newSearchData), {
          maxAge: 2678400,
        });

        updateSearchHistory(newSearchData);

        router.push('/result');
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
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
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
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          aria-label="search area, type the cep here"
        />
        <button
          onClick={() => handleSearch()}
          className="rounded-l-none rounded-md absolute top-0 right-0 w-20 h-full bg-secondary flex items-center justify-center text-white shadow-lg hover:bg-secondaryHover"
          aria-label="click to search button"
        >
          {isLoading ? <Autorenew className="animate-spin" /> : <SearchIcon />}
        </button>
      </div>
    </div>
  );
}
