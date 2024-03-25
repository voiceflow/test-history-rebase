import type { Project, User } from '@voiceflow/cypress-common';
import { projectSettings } from '@voiceflow/cypress-page-objects';

describe('Assistant Settings - Environments', () => {
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

  it('should open the environments tab', () => {
    cy.visitPage(`/project/${project.devVersion}/settings/environment`);

    projectSettings.getEnvironmentsSection().should('be.visible');
  });
});
