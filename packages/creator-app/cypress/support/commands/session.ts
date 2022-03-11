export const TOKEN_KEY = 'token';
export const CREATOR_ID_KEY = 'creatorID';
export const TAB_ID_KEY = 'tabID';
export const WORKSPACE_ID_KEY = 'workspaceID';
export const PROJECT_ID_KEY = 'projectID';
export const PROJECT_LIST_ID_KEY = 'projectListID';
export const VERSION_ID_KEY = 'versionID';
export const DIAGRAM_ID_KEY = 'diagramID';

export const SESSION_CONTEXT = new Map();

Cypress.Commands.add(
  'getSession',
  // eslint-disable-next-line sonarjs/no-empty-collection
  () => Array.from(SESSION_CONTEXT.entries()).reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {}) as any
);
