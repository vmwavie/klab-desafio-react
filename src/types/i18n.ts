import { AbstractIntlMessages } from 'next-intl';

export interface Messages extends AbstractIntlMessages {
  HomePage: {
    zipPlaceholder: string;
    title: string;
  };
}
