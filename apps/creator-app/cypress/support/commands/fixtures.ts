/* eslint-disable promise/always-return, promise/no-nesting */
import { Utils } from '@voiceflow/common';

import { API_URL, PLATFORM_SERVICE_URLS } from '../../config';
import { CREATOR_ID_KEY, DIAGRAM_ID_KEY, PROJECT_ID_KEY, PROJECT_LIST_ID_KEY, SESSION_CONTEXT, VERSION_ID_KEY, WORKSPACE_ID_KEY } from './session';

Cypress.Commands.add('createProject', (platform = 'alexa', tag) => {
  cy.request('POST', `${API_URL}/workspaces`, {
    name: 'my workspace',
  }).then((res) => {
    const { team_id: workspaceID } = res.body;

    SESSION_CONTEXT.set(WORKSPACE_ID_KEY, workspaceID);

    cy.request(`${API_URL}/v2/templates/${platform}${tag ? `?tag=${encodeURIComponent(tag)}` : ''}`).then((res) => {
      const moduleID = res.body;

      cy.log('moduleID', moduleID);

      cy.request('POST', `${PLATFORM_SERVICE_URLS[platform]}/project/${moduleID}/copy`, {
        image: '',
        name: 'my other project',
        teamID: workspaceID,
      }).then((res) => {
        const { devVersion: versionID, _id: projectID } = res.body;

        const projectListID = Utils.id.cuid();
        const projectList = {
          name: 'my project list',
          board_id: projectListID,
          projects: [projectID],
        };

        SESSION_CONTEXT.set(PROJECT_ID_KEY, projectID);
        SESSION_CONTEXT.set(PROJECT_LIST_ID_KEY, projectListID);
        SESSION_CONTEXT.set(VERSION_ID_KEY, versionID);

        cy.request('PATCH', `${API_URL}/team/${workspaceID}/projectLists`, { projectLists: [projectList] }).then(() => {
          // eslint-disable-next-line max-nested-callbacks
          cy.request(`${API_URL}/v2/versions/${versionID}`).then((res) => {
            const { rootDiagramID: diagramID } = res.body;

            SESSION_CONTEXT.set(DIAGRAM_ID_KEY, diagramID);
          });
        });
      });
    });
  });
});

Cypress.Commands.add('renderTest', (platform) => {
  const versionID = SESSION_CONTEXT.get(VERSION_ID_KEY);
  cy.request({
    method: 'POST',
    url: `${PLATFORM_SERVICE_URLS[platform]}/prototype/${versionID}/renderSync`,
    timeout: 5000,
  });
});

Cypress.Commands.add('configurePrototype', (settings) => {
  const versionID = SESSION_CONTEXT.get(VERSION_ID_KEY);

  cy.request('PATCH', `${API_URL}/v2/versions/${versionID}/prototype?path=settings`, settings);
});

Cypress.Commands.add('createThread', (text) => {
  const creatorID = SESSION_CONTEXT.get(CREATOR_ID_KEY);
  const projectID = SESSION_CONTEXT.get(PROJECT_ID_KEY);
  const diagramID = SESSION_CONTEXT.get(DIAGRAM_ID_KEY);

  cy.request('POST', `${API_URL}/commenting/project/${projectID}/threads`, {
    position: [330, 160],
    resolved: false,
    project_id: projectID,
    diagram_id: diagramID,
    node_id: null,
    creator_id: creatorID,
    comments: [{ text, mentions: [], creator_id: creatorID }],
  });
});

Cypress.Commands.add('createTranscript', ({ sessionID, creatorID, createdAt, reportTags }) => {
  const projectID = SESSION_CONTEXT.get(PROJECT_ID_KEY);

  cy.request('PUT', `${API_URL}/v2/transcripts`, {
    projectID,
    sessionID,
    creatorID,
    device: 'desktop',
    os: 'linux',
    browser: 'chrome',
    createdAt,
    reportTags,
  });
});

Cypress.Commands.add('createReportTag', ({ label, tagID }) => {
  const projectID = SESSION_CONTEXT.get(PROJECT_ID_KEY);

  cy.request('PUT', `${API_URL}/v2/projects/${projectID}/tags`, {
    id: tagID,
    projectID,
    label,
  });
});
