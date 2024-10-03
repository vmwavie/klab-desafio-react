'use client';
import { NavigateBefore, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import { SearchData, SortDirection, SortKey } from '@/types/historic';

import DetailsModal from '@/components/details-modal';
import { formatDate } from '@/helpers';
import { useTranslations } from 'next-intl';

export default function Historic() {
  const router = useRouter();

  const t = useTranslations('HistoricPage');

  const [data, setData] = useState<SearchData[]>([]);

  const [modalData, setModalData] = useState<SearchData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  }>({
    key: 'id',
    direction: 'asc',
  });

  function openModal(item: SearchData) {
    setModalData(item);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setModalData(null);
  }

  useEffect(() => {
    const cookieData = getCookie('searchHistory');

    if (cookieData) {
      const parsedData: SearchData[] = JSON.parse(cookieData as string);
      setData(parsedData);
    }
  }, []);

  function sortData(key: SortKey) {
    let direction: SortDirection = 'asc';

    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      switch (key) {
        case 'id':
          return direction === 'asc'
            ? a.id.localeCompare(b.id)
            : b.id.localeCompare(a.id);
          break;
        case 'date':
          return direction === 'asc'
            ? new Date(a.weatherData.searchDate).getTime() -
                new Date(b.weatherData.searchDate).getTime()
            : new Date(b.weatherData.searchDate).getTime() -
                new Date(a.weatherData.searchDate).getTime();
          break;
        case 'address':
          return direction === 'asc'
            ? a.cepData.logradouro.localeCompare(b.cepData.logradouro)
            : b.cepData.logradouro.localeCompare(a.cepData.logradouro);
          break;
        case 'weather':
          return direction === 'asc'
            ? a.weatherData.minTemperature - b.weatherData.minTemperature
            : b.weatherData.minTemperature - a.weatherData.minTemperature;
          break;
        default:
          return 0;
      }
    });

    setData(sortedData);
  }

  function getSortIcon(key: SortKey) {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼';
    }

    return '▲▼';
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4">
      <div className="w-full">
        <div className="mb-4">
          <button
            className="p-2 rounded-full text-gray-500 hover:cursor-pointer"
            aria-label="Back"
            onClick={() => router.push('/')}
          >
            <NavigateBefore fontSize="large" />
          </button>
        </div>

        <div className="overflow-x-auto sm:rounded-lg md:mx-10">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => sortData('date')}
                >
                  {t('searchDate')} {getSortIcon('date')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => sortData('address')}
                >
                  {t('address')} {getSortIcon('address')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => sortData('weather')}
                >
                  {t('weather')}* {getSortIcon('weather')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {formatDate(item.weatherData.searchDate)}
                  </td>
                  <td className="px-6 py-4">
                    {`${item.cepData.logradouro}, Bairro ${item.cepData.bairro}`
                      .slice(0, 30)
                      .padEnd(33, '.')}
                  </td>
                  <td className="px-6 py-4">
                    {`${item.weatherData.minTemperature}°c > ${item.weatherData.maxTemperature}°c`}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      aria-label="View"
                      className="text-black hover:text-textSecondary"
                      onClick={() => openModal(item)}
                    >
                      <Visibility />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalData && (
        <DetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          street={modalData.cepData.logradouro}
          neighborhood={modalData.cepData.bairro}
          city={modalData.cepData.localidade}
          state={modalData.cepData.estado}
          country="Brazil"
          zipCode={modalData.cepData.cep}
          temperature={`${modalData.weatherData.minTemperature}°c > ${modalData.weatherData.maxTemperature}°c`}
          lastUpdateDate={formatDate(modalData.weatherData.searchDate)}
          translation={t}
        />
      )}
    </div>
  );
}
