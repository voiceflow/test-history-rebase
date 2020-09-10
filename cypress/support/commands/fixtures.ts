/* eslint-disable promise/no-nesting */
import { CREATOR_ID_KEY, DIAGRAM_ID_KEY, PROJECT_ID_KEY, SESSION_CONTEXT, SKILL_ID_KEY, TEAM_ID_KEY } from './session';

const API_URL = 'https://localhost:8080';

Cypress.Commands.add('createProject', () => {
  cy.request('POST', `${API_URL}/workspaces`, {
    name: 'my workspace',
  }).then((res) => {
    const { team_id: teamID } = res.body;

    SESSION_CONTEXT.set(TEAM_ID_KEY, teamID);

    cy.request(`${API_URL}/template/all`).then((res) => {
      const [{ module_id: moduleID }] = res.body;

      cy.request('POST', `${API_URL}/team/${teamID}/copy/module/${moduleID}`, {
        locales: ['en-US'],
        name: 'my other project',
        platform: 'alexa',
      }).then((res) => {
        const { skill_id: skillID, project_id: projectID, diagram: diagramID } = res.body;

        SESSION_CONTEXT.set(PROJECT_ID_KEY, projectID);
        SESSION_CONTEXT.set(SKILL_ID_KEY, skillID);
        SESSION_CONTEXT.set(DIAGRAM_ID_KEY, diagramID);
      });
    });
  });
});

Cypress.Commands.add('createThread', (text: string) => {
  const creatorID = SESSION_CONTEXT.get(CREATOR_ID_KEY);
  const projectID = SESSION_CONTEXT.get(PROJECT_ID_KEY);
  const diagramID = SESSION_CONTEXT.get(DIAGRAM_ID_KEY);

  cy.request('POST', `${API_URL}/commenting/project/${projectID}/threads`, {
    position: [-460, 600],
    resolved: false,
    project_id: projectID,
    diagram_id: diagramID,
    node_id: null,
    creator_id: creatorID,
    comments: [{ text, mentions: [], creator_id: creatorID }],
  });
});
