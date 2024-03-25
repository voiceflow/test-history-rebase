import type { Project, User } from '@voiceflow/cypress-common';
import { functions } from '@voiceflow/cypress-page-objects';

describe('Content - Functions', () => {
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

  it('should have no functions', () => {
    cy.visitPage(`/project/${project.devVersion}/cms/function`);

    functions.getBreadcrumbs().should('have.text', 'All functions (0)');
  });
});
