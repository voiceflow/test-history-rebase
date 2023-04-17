import integrations from './integrations';
import profile from './profile';

export default {
  el: {
    get profileTab() {
      return cy.get('a').contains('Profile');
    },
    get integrationsTab() {
      return cy.get('a').contains('Integrations');
    },
  },

  tab: {
    profile,
    integrations,
  },
};
