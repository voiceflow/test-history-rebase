import './helpers';
import './session';
import './fixtures';
import './auth';
import './reactDnD';
import './canvas';

Cypress.Commands.add('shouldBeOn', (page) => {
  cy.location('pathname').should('be.onRoute', page, { timeout: 15000 });
});

Cypress.Commands.add('awaitLoaded', () => {
  cy.get('.vf-loader').should('not.exist');
});

Cypress.Commands.add('setup', () => {
  cy.removeTestAccount();
  cy.wait(1000); // eslint-disable-line cypress/no-unnecessary-waiting
  cy.createTestAccount();
  cy.setVerified();
  cy.setAuth();
});

Cypress.Commands.add('teardown', () => {
  cy.removeTestAccount();
});

Cypress.on(
  'uncaught:exception',
  () =>
    // This circumvents Cypress from throwing an error calling the click() function
    false
);
