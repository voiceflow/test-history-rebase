export default {
  goToCanvas: () => cy.getSession().then(({ skillID, diagramID }) => cy.visit(`/project/${skillID}/canvas/${diagramID}`)),

  route: {
    postDiagram: () => cy.route('POST', '/diagram'),
  },

  el: {
    get projectSettings() {
      return cy.get('[data-original-title="Settings"]');
    },
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
    get escapeModePrompt() {
      return cy.get('#vf-escape-mode-prompt');
    },
    get commentingModeControl() {
      return cy.get('.vf-canvas__control--commenting button');
    },
    get markupModeControl() {
      return cy.get('.vf-canvas__control--markup button');
    },
  },

  mode: {
    commenting: {
      goToCanvas: () => cy.getSession().then(({ skillID, diagramID }) => cy.visit(`/project/${skillID}/canvas/${diagramID}/commenting`)),

      el: {
        get historyDrawer() {
          return cy.get('#vf-thread-history-drawer');
        },
      },

      meta: {
        route: /project\/.*\/canvas\/.*?\/commenting/,
      },
    },

    markup: {
      goToCanvas: () => cy.getSession().then(({ skillID, diagramID }) => cy.visit(`/project/${skillID}/canvas/${diagramID}/markup`)),

      meta: {
        route: /project\/.*\/canvas\/.*?\/markup/,
      },
    },
  },

  meta: {
    route: /project\/.*\/canvas\/.*/,
  },
};
