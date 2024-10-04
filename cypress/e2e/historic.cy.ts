/// <reference types="cypress" />

function loadCookies() {
  cy.setCookie(
    'searchHistory1',
    JSON.stringify([
      {
        cepData: {
          logradouro: 'Rua dos Gerânios',
          bairro: 'Novo Horizonte',
          localidade: 'Pato Branco',
          estado: 'PR',
          cep: '85507-660',
        },
        weatherData: {
          maxTemperature: 25,
          minTemperature: 15,
          searchDate: '2023-07-01T12:00:00Z',
        },
      },
    ])
  );

  cy.setCookie(
    'searchHistory2',
    JSON.stringify([
      {
        cepData: {
          logradouro: 'Avenida Paulista',
          bairro: 'Bela Vista',
          localidade: 'São Paulo',
          estado: 'SP',
          cep: '01310-100',
        },
        weatherData: {
          maxTemperature: 28,
          minTemperature: 18,
          searchDate: '2023-07-02T12:00:00Z',
        },
      },
    ])
  );
}

describe('Historic Page', () => {
  beforeEach(() => {
    loadCookies();
    cy.visit('/historic');
  });

  it('should display empty cookies message when no data is available', () => {
    cy.clearCookies();
    cy.wait(1000).then(() => {
      cy.get('.text-textPrimary').should(
        'contain',
        'Nenhum dado do histórico foi encontrado.'
      );
    });
  });

  it('should load and display the historic data', () => {
    cy.get('table').should('be.visible');
    cy.contains('Rua dos Gerânios').should('be.visible');
    cy.contains('Avenida Paulista').should('be.visible');
  });

  it('should sort data when clicking on table headers', () => {
    cy.get('#date-sort').click();
    cy.get('tbody tr td').first().should('contain', '01/07/2023, 09:00');

    cy.get('#address-sort').click();
    cy.get('tbody tr')
      .first()
      .should('contain', 'Avenida Paulista, Bairro Bela Vista');

    cy.get('#weather-sort').click();
    cy.get('tbody tr').first().should('contain', '25°c / 15°c');
  });

  it('should open modal when clicking view button', () => {
    cy.get('button[aria-label="View"]').first().click();
    cy.get('.text-xl').should('contain', 'Informações Da Busca');
    cy.get('.mt-4 > :nth-child(1)').should('contain', 'Avenida Paulista');
  });

  it('should close modal when clicking close button', () => {
    cy.get('button[aria-label="View"]').first().click();
    cy.get('.text-xl').should('contain', 'Informações Da Busca');
    cy.get('#close-modal-button').click();
    cy.get('.text-xl:contains("Informações Da Busca")').should('not.exist');
  });

  it('should navigate back to home when clicking back button', () => {
    cy.get('button[aria-label="Back"]').click();
    cy.url().should('not.include', '/historic');
  });

  it('should display loading skeleton when data is loading', () => {
    cy.clearCookies();
    cy.get('.animate-pulse').should('be.visible');
    cy.wait(1000).then(() => {
      loadCookies();
    });
    cy.get('.animate-pulse').should('not.exist');
  });
});
