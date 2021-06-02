export default {
  el: {
    get toastify() {
      return cy.get('.Toastify');
    },
    get contextMenu() {
      return cy.get('#vf-context-menu');
    },
  },
};
