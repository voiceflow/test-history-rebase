import type { User, Workspace } from '@voiceflow/cypress-common';
import { teamMembers } from '@voiceflow/cypress-page-objects';

describe('Team and Billing', () => {
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

  it('has invite button', () => {
    cy.visitPage(`/workspace/${workspace.id}/members`);

    teamMembers.getInviteButton().should('be.visible');
  });
});
