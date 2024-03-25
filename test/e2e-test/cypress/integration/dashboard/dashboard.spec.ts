import type { User, Workspace } from '@voiceflow/cypress-common';
import { dashboard } from '@voiceflow/cypress-page-objects';

describe('Dashboard', () => {
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

  it('has no assistants', () => {
    cy.visitPage(`/workspace/${workspace.id}`);

    dashboard.getNewProjectButton().should('be.visible');
  });
});
