import type { Project, User } from '@voiceflow/cypress-common';
import { entities } from '@voiceflow/cypress-page-objects';

describe('Content - Entities', () => {
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

  it('should have no entities', () => {
    cy.visitPage(`/project/${project.devVersion}/cms/entity`);

    entities.getBreadcrumbs().should('have.text', 'All entities (0)');
  });
});
