export const TOKEN_KEY = 'token';
export const CREATOR_ID_KEY = 'creatorID';
export const TAB_ID_KEY = 'tabID';
export const TEAM_ID_KEY = 'teamID';
export const PROJECT_ID_KEY = 'projectID';
export const VERSION_ID_KEY = 'versionID';
export const DIAGRAM_ID_KEY = 'diagramID';

export const SESSION_CONTEXT = new Map();

Cypress.Commands.add(
  'getSession',
  () => Array.from(SESSION_CONTEXT.entries()).reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {}) as any
);
