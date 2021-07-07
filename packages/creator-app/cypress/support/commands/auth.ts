import cuid from 'cuid';

import { API_URL, POSTGRES_DB, POSTGRES_HOST, POSTGRES_USER, TEST_EMAIL, TEST_PASSWORD, TEST_USER } from '../../config';
import signupPage from '../../pages/signup';
import { CREATOR_ID_KEY, SESSION_CONTEXT, TAB_ID_KEY, TOKEN_KEY } from './session';

const PSQL = `PGPASSFILE=.pgpass psql -h ${POSTGRES_HOST} -d ${POSTGRES_DB} -U ${POSTGRES_USER}`;

Cypress.Commands.add('signup', (queryString = '') => {
  cy.visit(`/signup${queryString}`);

  signupPage.setName(TEST_USER);
  signupPage.setEmail(TEST_EMAIL);
  signupPage.setPassword(TEST_PASSWORD);

  signupPage.submit();
});

Cypress.Commands.add('setAuth', () => {
  const token = SESSION_CONTEXT.get(TOKEN_KEY);

  cy.setCookie(
    'persist%3Asession%3Atoken',
    `{%22value%22:%22%5C%22${token}%5C%22%22%2C%22_persist%22:%22{%5C%22version%5C%22:-1%2C%5C%22rehydrated%5C%22:true}%22}`
  );
  cy.setCookie('reduxPersistIndex', '[%22persist:session:token%22]');
  cy.setCookie('auth_vf', token);

  cy.window().then((window) =>
    window.sessionStorage.setItem(
      'persist:session:tab_id',
      JSON.stringify({ value: SESSION_CONTEXT.get(TAB_ID_KEY), _persist: { version: -1, rehydrated: true } })
    )
  );
});

Cypress.Commands.add('clearAuth', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

Cypress.Commands.add('createTestAccount', () => {
  SESSION_CONTEXT.set(TAB_ID_KEY, cuid());

  cy.request('PUT', `${API_URL}/user`, {
    device: {
      browser: 'Cypress',
      os: 'test',
      version: 'v0.0.0',
    },
    user: {
      email: TEST_EMAIL,
      name: TEST_USER,
      password: TEST_PASSWORD,
    },
  }).then((res) => {
    SESSION_CONTEXT.set(TOKEN_KEY, res.body.token);
    SESSION_CONTEXT.set(CREATOR_ID_KEY, res.body.user.creator_id);
    SESSION_CONTEXT.get(CREATOR_ID_KEY);
  });
});

Cypress.Commands.add('createWorkspace', (name = 'Test Workspace') => {
  cy.request('POST', `${API_URL}/workspaces`, {
    name,
  });
});

Cypress.Commands.add('upgradeTestAccount', (plan: 'pro') => {
  const creatorID = SESSION_CONTEXT.get(CREATOR_ID_KEY);
  cy.exec(`${PSQL} -c "UPDATE teams SET plan='${plan}' WHERE creator_id=${creatorID}"`);
});

Cypress.Commands.add('removeTestAccount', () => {
  SESSION_CONTEXT.clear();
  cy.exec(`${PSQL} -c "DELETE FROM creators WHERE email='${TEST_EMAIL}'"`);
});

Cypress.Commands.add('removeTestTranscripts', () => {
  const creatorID = SESSION_CONTEXT.get(CREATOR_ID_KEY);
  if (creatorID) {
    cy.exec(`${PSQL} -c "DELETE FROM transcripts WHERE creator_id=${creatorID}"`);
  }
});

Cypress.Commands.add('removeTestThreads', () => {
  const creatorID = SESSION_CONTEXT.get(CREATOR_ID_KEY);

  SESSION_CONTEXT.clear();
  cy.exec(`${PSQL} -c "DELETE FROM threads WHERE creator_id=${creatorID}"`);
});
