import type { Project, User } from '@voiceflow/cypress-common';
import { knowledgeBase } from '@voiceflow/cypress-page-objects';

describe('Content - Knowledge Base', () => {
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

  it('should have no documents', () => {
    cy.visitPage(`/project/${project.devVersion}/cms/knowledge-base`);

    knowledgeBase.getBreadcrumbs().should('have.text', 'All data sources (0)');
  });
});
