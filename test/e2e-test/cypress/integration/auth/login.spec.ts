import type { User } from '@voiceflow/cypress-common';
import { login } from '@voiceflow/cypress-page-objects';

describe('Login', () => {
  let user: User;

  beforeEach(() => {
    cy.createUser().then((res) => {
      ({ user } = res);
    });
  });

  it('should have access when logged out', () => {
    cy.visitPage('/login');

    login.getLoginButton().should('be.visible');
  });

  it('should be redirected when logged in', () => {
    cy.authenticate(user);

    cy.visit('/login');
    cy.awaitPage('/dashboard');
  });
});
