/* eslint-disable promise/no-nesting */
import { CREATOR_ID_KEY, DIAGRAM_ID_KEY, PROJECT_ID_KEY, SESSION_CONTEXT, TEAM_ID_KEY, VERSION_ID_KEY } from './session';
import { API_URL, PLATFORM_SERVICE_URL } from '../../config';

Cypress.Commands.add('createProject', (platform: 'alexa' | 'google' = 'alexa') => {
  cy.request('POST', `${API_URL}/workspaces`, {
    name: 'my workspace',
  }).then((res) => {
    const { team_id: teamID } = res.body;

    SESSION_CONTEXT.set(TEAM_ID_KEY, teamID);

    cy.request(`${API_URL}/v2/templates/${platform}`).then((res) => {
      const moduleID = res.body;

      cy.log('moduleID', moduleID);

      cy.request('POST', `${PLATFORM_SERVICE_URL}/project/${moduleID}/copy`, {
        image: '',
        name: 'my other project',
        teamID,
      }).then((res) => {
        const { devVersion: versionID, _id: projectID } = res.body;

        SESSION_CONTEXT.set(PROJECT_ID_KEY, projectID);
        SESSION_CONTEXT.set(VERSION_ID_KEY, versionID);

        cy.request(`${API_URL}/v2/versions/${versionID}`).then((res) => {
          const { rootDiagramID: diagramID } = res.body;

          SESSION_CONTEXT.set(DIAGRAM_ID_KEY, diagramID);
        });
      });
    });
  });
});

Cypress.Commands.add('createThread', (text: string) => {
  const creatorID = SESSION_CONTEXT.get(CREATOR_ID_KEY);
  const projectID = SESSION_CONTEXT.get(PROJECT_ID_KEY);
  const diagramID = SESSION_CONTEXT.get(DIAGRAM_ID_KEY);

  cy.request('POST', `${API_URL}/commenting/project/${projectID}/threads`, {
    position: [-400, -100],
    resolved: false,
    project_id: projectID,
    diagram_id: diagramID,
    node_id: null,
    creator_id: creatorID,
    comments: [{ text, mentions: [], creator_id: creatorID }],
  });
});
