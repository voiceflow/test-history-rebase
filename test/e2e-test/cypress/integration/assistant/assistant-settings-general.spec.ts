import type { Project, User } from '@voiceflow/cypress-common';
import { projectSettings } from '@voiceflow/cypress-page-objects';

describe('Assistant Settings - General', () => {
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

  it('should have settings sections', () => {
    cy.visitPage(`/project/${project.devVersion}/settings/general`);

    projectSettings.getNameAndLanguageSection().should('be.visible');
    projectSettings.getGlobalLogicSection().should('be.visible');
    projectSettings.getCanvasInteractionsSection().should('exist');
    projectSettings.getMetadataSection().should('exist');
    projectSettings.getDangerZoneSection().should('exist');
  });
});
