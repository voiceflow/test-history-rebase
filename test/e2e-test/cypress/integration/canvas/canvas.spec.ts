import type { Project, User } from '@voiceflow/cypress-common';
import { canvas } from '@voiceflow/cypress-page-objects';

describe('Canvas', () => {
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

  it('should navigate to canvas', () => {
    cy.visitPage(`/project/${project.devVersion}/canvas`);

    canvas.getDesignContainer().should('be.visible');
  });
});
