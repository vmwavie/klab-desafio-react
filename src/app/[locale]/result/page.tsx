'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Map from '@/components/map';
import { formatDateToLong } from '@/helpers';
import { getCookie, setCookie } from 'cookies-next';
import { NavigateBefore } from '@mui/icons-material';
import HistoryIcon from '@mui/icons-material/History';

import cloudyBg from '@/assets/weather/clouds.jpg';
import rainyBg from '@/assets/weather/rain.jpg';
import snowyBg from '@/assets/weather/snowy.jpg';
import sunnyBg from '@/assets/weather/sunny.jpg';
import thunderBg from '@/assets/weather/thunder.jpg';
import { SearchData } from '@/types/historic';

export default function Result() {
  const router = useRouter();
  const locale = getCookie('NEXT_LOCALE') as string;
  const [searchData, setSearchData] = useState<SearchData | null>(null);

  useEffect(() => {
    const cookieData = getCookie('currentSearchData');
    if (cookieData) {
      try {
        const parsedData = JSON.parse(cookieData as string) as SearchData;
        console.log(parsedData);
        if (!parsedData) {
          throw new Error('Null cookie data');
        }

        setSearchData(parsedData);
      } catch (error) {
        console.error('Error parsing cookie data:', error);
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router]);

  if (!searchData) {
    return null;
  }

  const { cepData, weatherData } = searchData;

  setCookie('currentSearchData', null);

  function redirectToHistory() {
    setCookie('currentSearchData', JSON.stringify(searchData), {
      maxAge: 2678400,
    });
    router.push('/historic');
  }

  const weatherBackgrounds = {
    Cloudy: cloudyBg,
    Rainy: rainyBg,
    Snowy: snowyBg,
    Sun: sunnyBg,
    Thunder: thunderBg,
  };

  function getWeatherBackground(iconName: keyof typeof weatherBackgrounds) {
    return weatherBackgrounds[iconName] || sunnyBg;
  }

  const backgroundImage = getWeatherBackground(
    weatherData.iconName as keyof typeof weatherBackgrounds
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full text-black h-dvh">
        <div className="mb-4 flex justify-between items-start">
          <button
            className="p-2 rounded-full text-gray-500 hover:cursor-pointer"
            aria-label="Back"
            onClick={() => router.push('/')}
          >
            <NavigateBefore fontSize="large" />
          </button>
          <button
            className="p-4 rounded-full text-textSecondary hover:cursor-pointer"
            aria-label="History"
            onClick={() => redirectToHistory()}
          >
            <HistoryIcon fontSize="large" />
          </button>
        </div>

        <Map
          street={cepData.logradouro}
          neighborhood={cepData.bairro}
          localidade={cepData.localidade}
          uf={cepData.uf}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pb-4">
          <div className="p-4 bg-gray-50 rounded-md border-solid border border-borderPrimary">
            <h2 className="text-lg font-semibold mb-2">
              Informações da localização:
            </h2>
            <p id="street-name">Rua: {cepData.logradouro}</p>
            <p id="neighborhood-name">Bairro: {cepData.bairro}</p>
            <p id="city-name">Cidade: {cepData.localidade}</p>
            <p id="state-name">Estado: {cepData.estado}</p>
            <p id="country-name">País: Brasil</p>
            <p id="zipcode-name">Cep: {cepData.cep}</p>
          </div>

          <div
            className="p-4 bg-gray-50 rounded-md flex flex-col items-center justify-center relative border-solid border border-borderPrimary"
            style={{
              backgroundImage: `url(${backgroundImage.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            id="weather-info"
          >
            <p className="text-md font-semibold pt-4 pl-4 text-textPrimary">
              {formatDateToLong(weatherData.searchDate, locale || 'pt-BR')}
            </p>
            <div className="p-4 flex items-end justify-center">
              <p
                className="text-6xl font-bold text-textPrimary"
                id="maxTemperature"
              >
                {weatherData.maxTemperature}°
              </p>
              <p
                className="text-3xl font-bold ml-2 text-textPrimary opacity-80"
                id="minTemperature"
              >
                / {weatherData.minTemperature}°
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
