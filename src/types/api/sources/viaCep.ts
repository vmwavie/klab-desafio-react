import { useTranslations } from 'next-intl';

interface Params {
  cep: string;
  t: ReturnType<typeof useTranslations>;
}

/**
 * Example of format:
 *  {
      "cep": "01001-000",
      "logradouro": "Praça da Sé",
      "complemento": "lado ímpar",
      "unidade": "",
      "bairro": "Sé",
      "localidade": "São Paulo",
      "uf": "SP",
      "estado": "São Paulo",
      "regiao": "Sudeste",
      "ibge": "3550308",
      "gia": "1004",
      "ddd": "11",
      "siafi": "7107"
    }    
 */
interface cepDetails {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

interface getCepDetailsResponse {
  response: cepDetails | null;
  errorMessage: string;
}

export type { Params, cepDetails, getCepDetailsResponse };
