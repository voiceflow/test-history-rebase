import { Utils } from '@voiceflow/common';

import { API_URL, POSTGRES_DB, POSTGRES_HOST, POSTGRES_USER, REDIS_HOST, TEST_EMAIL, TEST_PASSWORD, TEST_USER } from '../../config';
import signupPage from '../../pages/signup';
import { CREATOR_ID_KEY, SESSION_CONTEXT, TAB_ID_KEY, TOKEN_KEY } from './session';

const PSQL = `PGPASSFILE=.pgpass psql -h ${POSTGRES_HOST} -d ${POSTGRES_DB} -U ${POSTGRES_USER}`;
const REDIS = `redis-cli -h ${REDIS_HOST} -p 6379`;

Cypress.Commands.add('signup', (queryString = '') => {
  cy.visit(`/signup${queryString}`);

  signupPage.setFirstName(TEST_USER.split(' ')[0]);
  signupPage.setLastName(TEST_USER.split(' ')[1]);
  signupPage.setEmail(TEST_EMAIL);
  signupPage.setPassword(TEST_PASSWORD);

  signupPage.submit();
});

Cypress.Commands.add('verifyEmail', (queryParam = '') => {
  cy.exec(`${PSQL} -t -c "SELECT creator_id FROM creators WHERE email='${TEST_EMAIL}' LIMIT 1"`).then((result) => {
    const creatorID = result.stdout;

    cy.exec(`${REDIS} get ve_${creatorID}`).then((result) => {
      const token = result.stdout;

      cy.visit(`/account/confirm/${token}${creatorID}${queryParam}`);
    });
  });
});

Cypress.Commands.add('setVerified', () => {
  cy.exec(`${PSQL} -c "UPDATE creators SET verified=TRUE WHERE email='${TEST_EMAIL}'"`);
});

Cypress.Commands.add('setAuth', () => {
  const token = SESSION_CONTEXT.get(TOKEN_KEY);

  cy.setCookie('auth_vf', token, { domain: '.test.e2e' });

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
  SESSION_CONTEXT.set(TAB_ID_KEY, Utils.id.cuid());

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
    const creatorID = res.body.user.creator_id;
    SESSION_CONTEXT.set(TOKEN_KEY, res.body.token);
    SESSION_CONTEXT.set(CREATOR_ID_KEY, creatorID);
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

Cypress.Commands.add('removeTestThreads', () => {
  const creatorID = SESSION_CONTEXT.get(CREATOR_ID_KEY);

  SESSION_CONTEXT.clear();
  cy.exec(`${PSQL} -c "DELETE FROM threads WHERE creator_id=${creatorID}"`);
});
