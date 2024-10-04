'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import Map from '@/components/map';
import { formatDateToLong } from '@/helpers';
import { getCookie } from 'cookies-next';
import { NavigateBefore } from '@mui/icons-material';
import HistoryIcon from '@mui/icons-material/History';

import cloudyBg from '@/assets/weather/clouds.jpg';
import rainyBg from '@/assets/weather/rain.jpg';
import snowyBg from '@/assets/weather/snowy.jpg';
import sunnyBg from '@/assets/weather/sunny.jpg';
import thunderBg from '@/assets/weather/thunder.jpg';

export default function Result() {
  const router = useRouter();
  const locale = getCookie('NEXT_LOCALE');
  const searchData = useSelector((state: RootState) => state.search.searchData);

  if (!searchData) {
    router.push('/');
    return null;
  }

  const { cepData, weatherData } = searchData;

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
            onClick={() => router.push('/historic')}
          >
            <HistoryIcon fontSize="large" />
          </button>
        </div>

        <Map localidade={cepData.localidade} uf={cepData.uf} />

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
              {formatDateToLong(
                weatherData.searchDate,
                locale ? locale : 'pt-BR'
              )}
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
