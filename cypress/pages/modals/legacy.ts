export default {
  el: {
    get confirm() {
      return cy.get('.vf-modal--confirm');
    },
    get default() {
      return cy.get('.vf-modal--default');
    },
    get error() {
      return cy.get('.vf-modal--error');
    },
    get loading() {
      return cy.get('.vf-modal--loading');
    },
    get success() {
      return cy.get('.vf-modal--success');
    },
  },
};
