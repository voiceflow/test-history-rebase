import type { User, Workspace } from '@voiceflow/cypress-common';
import { workspaceSettings } from '@voiceflow/cypress-page-objects';

describe('Workspace Settings', () => {
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

  it('has workspace name', () => {
    cy.visitPage(`/workspace/${workspace.id}/settings`);

    workspaceSettings.getNameInput().should('have.value', workspace.name);
  });
});
