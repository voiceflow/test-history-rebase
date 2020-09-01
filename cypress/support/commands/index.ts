import './session';
import './fixtures';
import './auth';
import './canvas';

Cypress.Commands.add('shouldBeOn', (page) => {
  cy.location('pathname').should('be.onRoute', page);
});

Cypress.Commands.add('awaitLoaded', () => {
  cy.get('.vf-loader').should('not.be.visible');
});

Cypress.Commands.add('setup', () => {
  cy.removeTestAccount();
  cy.createTestAccount();
  cy.setAuthToken();
});

Cypress.Commands.add('teardown', () => {
  cy.removeTestAccount();
});
