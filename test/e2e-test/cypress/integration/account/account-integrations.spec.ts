import type { User, Workspace } from '@voiceflow/cypress-common';
import { account } from '@voiceflow/cypress-page-objects';

describe('Account Integrations', () => {
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

  it('alexa integration disconnected by default', () => {
    cy.visitPage(`/workspace/${workspace.id}/integrations`);

    account.getConnectAlexaButton().should('be.visible');
  });
});
