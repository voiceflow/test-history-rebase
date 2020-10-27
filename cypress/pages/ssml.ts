export default {
  el: {
    get editor() {
      return cy.get('.vf-ssml');
    },
  },

  meta: {
    route: '/ssml',
  },
};
