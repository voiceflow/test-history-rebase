import type { User } from '@voiceflow/cypress-common';
import { signUp } from '@voiceflow/cypress-page-objects';

describe('Sign up', () => {
  let user: User;

  beforeEach(() => {
    cy.createUser().then((res) => {
      ({ user } = res);
    });
  });

  it('should have access when logged out', () => {
    cy.visitPage('/signup');

    signUp.getCreateAccountButton().should('be.visible');
  });

  it('should be redirected when logged in', () => {
    cy.authenticate(user);

    cy.visit('/signup');
    cy.awaitPage('/dashboard');
  });
});
