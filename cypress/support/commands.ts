/* eslint-disable */
declare global {
  namespace Cypress {
    interface Chainable {
      dataCy(value: string): Chainable<Element>;
      searchCep(cep: string): Chainable<Element>;
      checkWeatherResult(): Chainable<Element>;
    }
  }
}

Cypress.Commands.add('dataCy', (value: string): any => {
  return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add('searchCep', (cep) => {
  cy.get('input#cepInput').type(cep);
  cy.get('button[aria-label="click to search button"]').click();
});

Cypress.Commands.add('checkWeatherResult', () => {
  cy.get('[data-cy=weather-result]').should('be.visible');
  cy.get('[data-cy=temperature]').should('exist');
  cy.get('[data-cy=weather-description]').should('exist');
});

export {};
