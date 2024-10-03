import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'pt-br'];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as string)) {
    notFound();
  }

  return {
    messages: (await import(`./src/messages/${locale}.json`)).default,
  };
});
