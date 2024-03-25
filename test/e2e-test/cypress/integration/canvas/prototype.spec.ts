import type { Project, User } from '@voiceflow/cypress-common';
import { canvas } from '@voiceflow/cypress-page-objects';

describe('Prototype', () => {
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

  it('should navigate to prototype', () => {
    cy.visitPage(`/project/${project.devVersion}/prototype`);

    canvas.getDesignContainer().should('be.visible');
  });
});
