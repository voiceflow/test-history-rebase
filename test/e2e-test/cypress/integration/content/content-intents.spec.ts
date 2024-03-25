import type { Project, User } from '@voiceflow/cypress-common';
import { intents } from '@voiceflow/cypress-page-objects';

describe('Content - Intents', () => {
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

  it('should have no intents', () => {
    cy.visitPage(`/project/${project.devVersion}/cms/intent`);

    intents.getBreadcrumbs().should('have.text', 'All intents (0)');
  });
});
