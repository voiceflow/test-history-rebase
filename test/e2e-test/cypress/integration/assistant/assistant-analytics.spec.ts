import type { Project, User } from '@voiceflow/cypress-common';

describe('Assistant Analytics', () => {
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
    cy.visit(`/project/${project.devVersion}/analytics`);

    cy.contains('Report is empty because no data matches filters.').should('be.visible');
  });
});
