import React from 'react';

/**
 * This function is responsible for formatting a dateString to 'Week Day, MM of Month of YYYY' format.
 *
 * @param dateString
 * @returns 'Week Day, MM of Month of YYYY'
 */
function formatDateToLong(dateString: string, location: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  return new Intl.DateTimeFormat(location, options).format(date);
}

/**
 * This function is responsible for formatting a dateString to 'dd/mm/yyyy, 00:00 AM' format.
 *
 * @param dateString
 * @returns dd/mm/yyyy, 00:00 AM
 */
function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * This function is responsible for the cep masking, you should use this on onInput change event.
 *
 * @param event
 * @return masked cep code, format: '00000-000'
 */
function cepCodeMask(event: React.FormEvent<HTMLInputElement>) {
  const input = event.currentTarget;
  input.value = input.value.replace(/\D/g, '');
  input.value = input.value.replace(/(\d{5})(\d)/, '$1-$2');
}

/**
 * Validates if the given string is a valid cep.
 *
 * @param cep - The cep to validate
 * @returns boolean - true if the CEP is valid, false otherwise
 */
function validateCep(cep: string): boolean {
  const cleanCep = cep.replace(/\D/g, '');

  if (cleanCep.length !== 8 || /^0+$/.test(cleanCep)) {
    return false;
  }

  return true;
}

/**
 * This function should format the city name to be compatible with the API,
 *
 * @param input city - the city name to normalize
 * @returns city name normalized to be compatible with the API,
 */
function normalizeCityName(input: string): string {
  return input.replace(/'/g, '%27').replace(/\s+/g, '%20').toLowerCase();
}

/**
 * This function should valite if informed input have dangerous code,
 * like a sql injection, xss or other method to attack the server.
 *
 * @param string input - the value that your want to validate
 * @returns boolean - true if input contains dangerous code, false otherwise
 */
function isDangerousInput(input: string): boolean {
  const sqlInjectionPattern =
    /(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b)|(-{2}|\*|;)/i;

  const xssPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

  const jsCodePattern = /(javascript:|data:text\/html)/i;

  const dangerousPattern = new RegExp(
    `${sqlInjectionPattern.source}|${xssPattern.source}|${jsCodePattern.source}`,
    'i'
  );

  return dangerousPattern.test(input);
}

export {
  formatDateToLong,
  formatDate,
  cepCodeMask,
  validateCep,
  normalizeCityName,
  isDangerousInput,
};
