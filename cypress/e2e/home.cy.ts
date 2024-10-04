/// <reference types="cypress" />

const API_KEY_ACCUWEATHER = Cypress.env('API_KEY_ACCUWEATHER');

describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the home page correctly', () => {
    cy.get('input#cepInput').should('be.visible');
    cy.get('button[aria-label="click to search button"]').should('be.visible');
    cy.get('button[aria-label="History"]').should('be.visible');
  });

  it('should apply CEP mask to input', () => {
    cy.get('input#cepInput').type('85507660');
    cy.get('input#cepInput').should('have.value', '85507-660');
  });

  it('should trigger search on Enter key press and navigate to result page', () => {
    cy.intercept('GET', 'https://viacep.com.br/ws/85507660/json', {
      fixture: 'cepResponse.json',
    }).as('getCep');

    cy.intercept(
      'GET',
      `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${API_KEY_ACCUWEATHER}&q=pato%20branco,%20pr&language=pt-br`,
      {
        fixture: 'locationResponse.json',
      }
    ).as('getLocation');

    cy.intercept(
      'GET',
      `https://dataservice.accuweather.com/forecasts/v1/daily/1day/*`,
      {
        fixture: 'weatherResponse.json',
      }
    ).as('getWeather');

    cy.get('input#cepInput').type('85507-660{enter}');

    cy.wait('@getCep');
    cy.wait('@getLocation');
    cy.wait('@getWeather');

    cy.url().should('include', '/result');

    cy.contains('cityNotFound').should('not.exist');

    cy.get('#city-name').should('contain', 'Pato Branco');
    cy.get('#street-name').should('contain', 'Rua dos Gerânios');
    cy.get('#neighborhood-name').should('contain', 'Novo Horizonte');
    cy.get('#state-name').should('contain', 'Paraná');
    cy.get('#country-name').should('contain', 'Brasil');
    cy.get('#zipcode-name').should('contain', '85507-660');
    cy.get('#weather-info').should('be.visible');
  });

  it('should trigger search on button click', () => {
    cy.intercept('GET', 'https://viacep.com.br/ws/85507660/json', {
      fixture: 'cepResponse.json',
    }).as('getCep');

    cy.intercept(
      'GET',
      `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${API_KEY_ACCUWEATHER}&q=pato%20branco,%20pr&language=pt-br`,
      {
        fixture: 'locationResponse.json',
      }
    ).as('getLocation');

    cy.intercept(
      'GET',
      `https://dataservice.accuweather.com/forecasts/v1/daily/1day/*`,
      {
        fixture: 'weatherResponse.json',
      }
    ).as('getWeather');

    cy.get('input#cepInput').type('85507-660');
    cy.get('button[aria-label="click to search button"]').click();

    cy.wait('@getCep');
    cy.wait('@getLocation');
    cy.wait('@getWeather');

    cy.url().should('include', '/result');
  });

  it('should show loading state during search', () => {
    cy.intercept('GET', '**/viacep.com.br/ws/**', {
      delay: 1000,
      fixture: 'cepResponse.json',
    }).as('getCep');
    cy.intercept('GET', '**/dataservice.accuweather.com/**', {
      delay: 1000,
      fixture: 'weatherResponse.json',
    }).as('getWeather');

    cy.get('input#cepInput').type('85507-660');
    cy.get('button[aria-label="click to search button"]').click();

    cy.get('.animate-spin').should('be.visible');
    cy.get('input#cepInput').should('be.disabled');

    cy.wait('@getCep');
    cy.wait('@getWeather');

    cy.get('.animate-spin').should('not.exist');
    cy.get('input#cepInput').should('not.be.disabled');
  });

  it('should navigate to history page', () => {
    cy.get('button[aria-label="History"]').click();
    cy.url().should('include', '/historic');
  });

  it('should show error toast for invalid CEP', () => {
    cy.get('input#cepInput').type('00000-000');
    cy.get('button[aria-label="click to search button"]').click();

    cy.get('.go685806154').should('be.visible');
  });

  it('should show error toast for not found CEP', () => {
    cy.intercept('GET', '**/viacep.com.br/ws/**', {
      statusCode: 400,
      body: { erro: true },
    }).as('getInvalidCep');

    cy.get('input#cepInput').type('00000-001');
    cy.get('button[aria-label="click to search button"]').click();

    cy.wait('@getInvalidCep');

    cy.get('.go685806154').should('be.visible');
  });

  it('should show error toast for weather API failure', () => {
    cy.intercept('GET', '**/viacep.com.br/ws/**', {
      fixture: 'cepResponse.json',
    }).as('getCep');
    cy.intercept('GET', '**/dataservice.accuweather.com/**', {
      statusCode: 500,
    }).as('getWeatherError');

    cy.get('input#cepInput').type('85507-660');
    cy.get('button[aria-label="click to search button"]').click();

    cy.wait('@getCep');
    cy.wait('@getWeatherError');

    cy.get('.go685806154').should('be.visible');
  });
});
