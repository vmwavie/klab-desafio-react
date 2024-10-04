'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import Map from '@/components/map';
import { formatDateToLong } from '@/helpers';
import { getCookie } from 'cookies-next';

export default function Result() {
  const router = useRouter();
  const locale = getCookie('NEXT_LOCALE');
  const searchData = useSelector((state: RootState) => state.search.searchData);

  if (!searchData) {
    router.push('/');
    return null;
  }

  const { cepData, weatherData } = searchData;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full text-black h-dvh">
        <Map localidade={cepData.localidade} uf={cepData.uf} />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <h2 className="text-lg font-semibold mb-2">
              Informações da localização:
            </h2>
            <p>Rua: {cepData.logradouro}</p>
            <p>Bairro: {cepData.bairro}</p>
            <p>Cidade: {cepData.localidade}</p>
            <p>Estado: {cepData.estado}</p>
            <p>País: Brasil</p>
            <p>Cep: {cepData.cep}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-md flex flex-col items-center justify-center">
            <p className="text-lg font-semibold">
              {formatDateToLong(
                weatherData.searchDate,
                locale ? locale : 'pt-BR'
              )}
            </p>
            <p className="text-4xl font-bold">
              {weatherData.minTemperature}° / {weatherData.maxTemperature}°
            </p>
            <div className="mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-16 h-16 text-yellow-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 2a10 10 0 110 20 10 10 0 010-20z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
