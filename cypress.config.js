import { defineConfig } from 'cypress';

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  e2e: {
    baseUrl: 'http://localhost:3000/pt-br',
    supportFile: 'cypress/support/e2e.ts',
  },
  env: {
    API_KEY_ACCUWEATHER: 'lNG8O4GqNsonmBaUmGMkQSr0Gn8ONH5F',
  },
});
