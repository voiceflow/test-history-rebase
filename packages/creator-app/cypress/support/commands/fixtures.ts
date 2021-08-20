/* eslint-disable promise/always-return, promise/no-nesting */
import { API_URL, PLATFORM_SERVICE_URLS } from '../../config';
import { CREATOR_ID_KEY, DIAGRAM_ID_KEY, PROJECT_ID_KEY, SESSION_CONTEXT, TEAM_ID_KEY, VERSION_ID_KEY } from './session';

Cypress.Commands.add('createProject', (platform: 'alexa' | 'google' | 'general' = 'alexa', tag?: string) => {
  cy.request('POST', `${API_URL}/workspaces`, {
    name: 'my workspace',
  }).then((res) => {
    const { team_id: teamID } = res.body;

    SESSION_CONTEXT.set(TEAM_ID_KEY, teamID);

    cy.request(`${API_URL}/v2/templates/${platform}${tag ? `?tag=${encodeURIComponent(tag)}` : ''}`).then((res) => {
      const moduleID = res.body;

      cy.log('moduleID', moduleID);

      cy.request('POST', `${PLATFORM_SERVICE_URLS[platform]}/project/${moduleID}/copy`, {
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

Cypress.Commands.add('renderTest', (platform: 'alexa' | 'google' | 'general') => {
  const projectID = SESSION_CONTEXT.get(PROJECT_ID_KEY);

  const getStatus = (): Cypress.Chainable<any> =>
    cy.request('GET', `${PLATFORM_SERVICE_URLS[platform]}/prototype/${projectID}/status`).then((res) => {
      const { status, stage } = res.body;

      if (status === 'FINISHED') {
        if (stage.type === 'ERROR') {
          throw new Error('prototype render failed');
        } else {
          return;
        }
      }

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);

      return getStatus();
    });

  cy.request({
    method: 'POST',
    url: `${PLATFORM_SERVICE_URLS[platform]}/prototype/${projectID}/render`,
    timeout: 5000,
  }).then(() => getStatus());
});

Cypress.Commands.add('configurePrototype', (settings: Partial<{ layout: 'voice-and-dialog' | 'text-and-dialog' | 'voice-and-visuals' }>) => {
  const versionID = SESSION_CONTEXT.get(VERSION_ID_KEY);

  cy.request('PATCH', `${API_URL}/v2/versions/${versionID}/prototype?path=settings`, settings);
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

Cypress.Commands.add(
  'createTranscript',
  ({ sessionID, creatorID, createdAt, reportTags }: { sessionID: string; creatorID: string | null; createdAt?: number; reportTags?: string[] }) => {
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
  }
);

Cypress.Commands.add('createReportTag', ({ label, tagID }: { label: string; tagID: string }) => {
  const projectID = SESSION_CONTEXT.get(PROJECT_ID_KEY);

  cy.request('PUT', `${API_URL}/v2/projects/${projectID}/tags`, {
    id: tagID,
    projectID,
    label,
  });
});
