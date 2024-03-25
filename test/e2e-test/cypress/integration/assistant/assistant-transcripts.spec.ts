import type { Project, User } from '@voiceflow/cypress-common';
import { transcripts } from '@voiceflow/cypress-page-objects';

describe('Assistant Transcripts', () => {
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

  it('should have no transcripts', () => {
    cy.visitPage(`/project/${project.devVersion}/transcripts`);

    transcripts.getAllTranscripts().should('not.exist');
  });
});
