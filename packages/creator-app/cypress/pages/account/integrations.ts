import { Identifier } from '../../../src/styles/constants';

export default {
  el: {
    get alexaConnectButton() {
      return cy.get(`#${Identifier.ACCOUNT_PAGE}`).contains('Amazon Alexa').parent().find('button');
    },
    get googleConnectButton() {
      return cy.get(`#${Identifier.ACCOUNT_PAGE}`).contains('Google').parent().find('button');
    },
  },

  meta: {
    route: '/account/integrations',
  },
};
