import { isDangerousInput, validateCep } from '@/helpers';
import {
  cepDetails,
  Params,
  getCepDetailsResponse,
} from '@/types/api/sources/viaCep';

const BASE_URL: string = 'https://viacep.com.br/ws/';
const BASE_FORMAT: string = '/json';

/**
 * This function should fetch the cep details from the ViaCEP API.
 *
 * @param cep - The cep to fetch
 * @param t - The translations function from next-intl
 *
 * @returns Promise {
 *  response: Response | null,
 *  errorMessage: string
 * }
 */
async function getCepDetails({
  cep,
  t,
}: Params): Promise<getCepDetailsResponse> {
  let errorMessage: string = '';
  let response: cepDetails | null = null;

  try {
    if (isDangerousInput(cep)) {
      throw new Error();
    }

    if (!validateCep(cep)) {
      errorMessage = t('invalidCepFormat');
      throw new Error();
    }

    cep = cep.replace(/\D/g, '');

    const fetchResponse = await fetch(`${BASE_URL}${cep}${BASE_FORMAT}`);

    if (!fetchResponse.ok) {
      throw new Error(`HTTP error! status: ${fetchResponse.status}`);
    }

    const data = await fetchResponse.json();

    if (data?.erro) {
      errorMessage = t('cepNotFound');
      throw new Error();
    }

    response = data;
  } catch (error) {
    errorMessage = errorMessage ? errorMessage : t('unexpectedError');
    console.error(error);
  }

  return {
    response,
    errorMessage,
  };
}

export { getCepDetails };
