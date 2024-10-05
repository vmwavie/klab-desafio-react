import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import localFont from 'next/font/local';
import '../../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { ReduxProvider } from '@/redux/provider';

const geistSans = localFont({
  src: '../../assets/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: '../../assets/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Klab Interview Test',
  authors: [{ name: 'Matheus Fernandes', url: 'https://github.com/vmwavie' }],
  creator: 'vmwavie',
  keywords: [
    'klab',
    'frontend',
    'test',
    'interview',
    'pleno',
    'pl',
    'teste ténico',
    'emprego',
    'desenvolvedor web',
    'reeaact',
    'nextjs',
  ],
  icons: {
    icon: '../../assets/favicon.ico',
  },
  description:
    'Esse é um desafio técnico proposto pela Klab, em uma entrevista de uma vaga para Desenvolvedor Frontend Pleno.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-100 ntialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Toaster position="top-right" />
          <ReduxProvider>{children}</ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
