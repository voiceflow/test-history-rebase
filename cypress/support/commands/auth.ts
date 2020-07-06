/* eslint-disable promise/catch-or-return */
import cuid from 'cuid';

import { POSTGRES_DB, POSTGRES_HOST, POSTGRES_USER, TEST_EMAIL, TEST_PASSWORD, TEST_USER } from '../../config';
import signupPage from '../../pages/signup';
import { SESSION_CONTEXT, TAB_ID_KEY, TOKEN_KEY } from './session';

const API_URL = 'https://localhost:8080';

const PSQL = `PGPASSFILE=.pgpass psql -h ${POSTGRES_HOST} -d ${POSTGRES_DB} -U ${POSTGRES_USER}`;

Cypress.Commands.add('signup', () => {
  cy.visit('/signup');

  signupPage.setName(TEST_USER);
  signupPage.setEmail(TEST_EMAIL);
  signupPage.setPassword(TEST_PASSWORD);

  signupPage.submit();
});

Cypress.Commands.add('setAuthToken', () => {
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
  });
});

Cypress.Commands.add('removeTestAccount', () => {
  SESSION_CONTEXT.clear();
  cy.exec(`${PSQL} -c "DELETE FROM creators WHERE email='${TEST_EMAIL}'"`);
});
