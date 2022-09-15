import { Identifier } from '../../../src/styles/constants';

export default {
  el: {
    get nameInput() {
      return cy.get(`#${Identifier.USER_NAME_INPUT}`);
    },
    get emailInput() {
      return cy.get(`#${Identifier.USER_EMAIL_INPUT}`);
    },
  },

  meta: {
    route: '/account/profile',
  },
};
