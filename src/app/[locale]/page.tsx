import { useTranslations } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Messages } from '../../types/i18n';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const messages = (await getMessages({ locale })) as Messages;
  const title = messages.HomePage.helloWorld;

  return {
    title,
  };
}

export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <div>
      <h1>{t('helloWorld')}</h1>
    </div>
  );
}
