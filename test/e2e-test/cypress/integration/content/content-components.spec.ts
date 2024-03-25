import type { Project, User } from '@voiceflow/cypress-common';
import { components } from '@voiceflow/cypress-page-objects';

describe('Content - Components', () => {
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

  it('should have no components', () => {
    cy.visitPage(`/project/${project.devVersion}/cms/flow`);

    components.getBreadcrumbs().should('have.text', 'All components (0)');
  });
});
