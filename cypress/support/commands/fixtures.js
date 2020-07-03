/* eslint-disable promise/no-nesting */
/* eslint-disable promise/catch-or-return */

import { DIAGRAM_ID_KEY, PROJECT_ID_KEY, SESSION_CONTEXT, SKILL_ID_KEY, TEAM_ID_KEY } from './session';

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
