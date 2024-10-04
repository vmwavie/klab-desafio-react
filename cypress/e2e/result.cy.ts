/// <reference types="cypress" />

describe('Result Page', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.intercept('GET', 'https://viacep.com.br/ws/85507660/json', {
      fixture: 'cepResponse.json',
    }).as('getCep');

    cy.intercept(
      'GET',
      'https://dataservice.accuweather.com/locations/v1/cities/search*',
      {
        fixture: 'locationResponse.json',
      }
    ).as('getLocation');

    cy.intercept(
      'GET',
      'https://dataservice.accuweather.com/forecasts/v1/daily/1day/*',
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

  it('should display location information correctly', () => {
    cy.get('#street-name').should('contain', 'Rua: Rua dos Gerânios');
    cy.get('#neighborhood-name').should('contain', 'Bairro: Novo Horizonte');
    cy.get('#city-name').should('contain', 'Cidade: Pato Branco');
    cy.get('#state-name').should('contain', 'Estado: Paraná');
    cy.get('#country-name').should('contain', 'País: Brasil');
    cy.get('#zipcode-name').should('contain', 'Cep: 85507-660');
  });

  it('should display weather information correctly', () => {
    cy.get('#maxTemperature').should('contain', '27.1°');
    cy.get('#minTemperature').should('contain', '10.9°');
  });

  it('should navigate back to home page when back button is clicked', () => {
    cy.get('button[aria-label="Back"]').click();
    cy.url().should('not.include', '/result');
  });

  it('should navigate to historic page when history button is clicked', () => {
    cy.get('button[aria-label="History"]').click();
    cy.url().should('include', '/historic');
  });

  it('should display the map component', () => {
    cy.get('#mapContainer').should('be.visible');
  });

  it('should format the date correctly', () => {
    const today = new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    cy.get('#weather-info p').first().should('contain', today);
  });
});
