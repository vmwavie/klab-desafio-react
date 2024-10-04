/* eslint-disable */
/// Declare the global Cypress namespace to extend it
declare global {
  namespace Cypress {
    interface Chainable {
      // Declare your custom commands here
      dataCy(value: string): Chainable<Element>;
      searchCep(cep: string): Chainable<Element>;
      checkWeatherResult(): Chainable<Element>;
    }
  }
}

// Custom command to select DOM elements by data-cy attribute
Cypress.Commands.add('dataCy', (value: string): any => {
  return cy.get(`[data-cy=${value}]`);
});
// Custom command to perform a CEP search
Cypress.Commands.add('searchCep', (cep) => {
  cy.get('input#cepInput').type(cep);
  cy.get('button[aria-label="click to search button"]').click();
});

// Custom command to check weather result
Cypress.Commands.add('checkWeatherResult', () => {
  cy.get('[data-cy=weather-result]').should('be.visible');
  cy.get('[data-cy=temperature]').should('exist');
  cy.get('[data-cy=weather-description]').should('exist');
});

// You can add more custom commands as needed

export {};
