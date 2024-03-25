import type { User } from '@voiceflow/cypress-common';
import { onboarding } from '@voiceflow/cypress-page-objects';

describe('Onboarding', () => {
  let user: User;

  beforeEach(() => {
    cy.createUser().then((res) => {
      ({ user } = res);
      cy.authenticate(user);
    });
  });

  it('should navigate to onboarding', () => {
    cy.visitPage('/onboarding');

    onboarding.getGetStartedButton().should('be.visible');
  });
});
