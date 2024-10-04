import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        primary: '5px 4px 1px 1px rgba(0, 0, 0, 0.05)',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        secondary: '#FF6969',
        secondaryHover: '#D75555',
        textPrimary: '#404040',
        textSecondary: '#808080',
        borderPrimary: '#DCDCDC',
      },
    },
  },
  plugins: [],
};
export default config;
