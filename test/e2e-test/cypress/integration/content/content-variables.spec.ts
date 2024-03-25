import type { Project, User } from '@voiceflow/cypress-common';
import { variables } from '@voiceflow/cypress-page-objects';

describe('Content - Variables', () => {
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

  it('should have built-in variables', () => {
    cy.visitPage(`/project/${project.devVersion}/cms/variable`);

    variables.getBreadcrumbs().should('have.text', 'All variables (10)');
  });
});
