export default {
  el: {
    get loginWithAmazon() {
      return cy.get('.LoginWithAmazon');
    },
    get closeModal() {
      return cy.get('.modal-header .vf-svg-icon--close');
    },
  },
};
