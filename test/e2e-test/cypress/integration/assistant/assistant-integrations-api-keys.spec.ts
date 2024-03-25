import type { Project, User } from '@voiceflow/cypress-common';
import { integrations } from '@voiceflow/cypress-page-objects';

describe('Assistant Integrations - API Keys', () => {
  let user: User;
  let project: Project;

  beforeEach(() => {
    cy.createUserWorkspaceAndProject({
      workspace: { plan: 'pro' },
      project: { file: 'empty.vf' },
    }).then((res) => {
      ({ user, project } = res);
      cy.authenticate(user);
    });
  });

  it('should have no analytics data', () => {
    cy.visitPage(`/project/${project.devVersion}/publish/api`);

    integrations.getCopyApiButton().realClick();
    cy.readClipboard()
      .should('be.a', 'string')
      .should('match', /^VF\.DM\./);
  });
});
