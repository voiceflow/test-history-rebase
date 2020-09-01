/* eslint-disable promise/catch-or-return */

export const TOKEN_KEY = 'token';
export const CREATOR_ID_KEY = 'creatorID';
export const TAB_ID_KEY = 'tabID';
export const TEAM_ID_KEY = 'teamID';
export const PROJECT_ID_KEY = 'projectID';
export const SKILL_ID_KEY = 'skillID';
export const DIAGRAM_ID_KEY = 'diagramID';

// eslint-disable-next-line compat/compat
export const SESSION_CONTEXT = new Map();

Cypress.Commands.add('getSession', () =>
  Array.from(SESSION_CONTEXT.entries()).reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {})
);
