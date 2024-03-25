import type { User, Workspace } from '@voiceflow/cypress-common';
import { account } from '@voiceflow/cypress-page-objects';

describe('Account Profile', () => {
  let user: User;
  let workspace: Workspace;

  beforeEach(() => {
    cy.createUserAndWorkspace({
      workspace: { plan: 'pro' },
    }).then((res) => {
      ({ user, workspace } = res);
      cy.authenticate(user);
    });
  });

  it('has user name and email', () => {
    cy.visitPage(`/workspace/${workspace.id}/profile`);

    account.getName().should('have.value', user.name);
    account.getEmail().should('have.value', user.email);
  });
});
