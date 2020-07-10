export default {
  openSettings: () => cy.get('[data-original-title="Settings"]').click(),

  goToCanvas: () => cy.getSession().then(({ skillID, diagramID }) => cy.visit(`/project/${skillID}/canvas/${diagramID}`)),

  el: {
    get projectTitle() {
      return cy.get('#vf-project-title');
    },
    get modal() {
      return cy.get('.modal-dialog');
    },
    get modalTitle() {
      return cy.get('.modal-content h5');
    },
    get node() {
      return cy.get('.vf-canvas__node');
    },
    get homeBlock() {
      return cy.get('.vf-canvas__block--home');
    },
    get canvas() {
      return cy.get('#vf-canvas');
    },
  },

  meta: {
    route: /project\/.*\/canvas\/.*/,
  },
};
