export default {
  goToCanvas: () => cy.getSession().then(({ versionID, diagramID }) => cy.visit(`/project/${versionID}/canvas/${diagramID}`)),

  route: {
    postDiagram: () => cy.route('GET', '/v2/diagrams/**'),
  },

  el: {
    get projectSettings() {
      return cy.get('[data-original-title="Settings"]').find('button');
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
    get settingsPage() {
      return cy.get('#vf-settings-page');
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
      goToCanvas: () => cy.getSession().then(({ versionID, diagramID }) => cy.visit(`/project/${versionID}/canvas/${diagramID}/commenting`)),

      el: {
        get historyDrawer() {
          return cy.get('#vf-thread-history-drawer');
        },
        get thread() {
          return cy.get('.vf-canvas__thread');
        },
        get threadIndicator() {
          return cy.get('.vf-canvas__thread__indicator');
        },
        get newThreadEditor() {
          return cy.get('.vf-thread-editor--new');
        },
        get newTreadEditorInput() {
          return this.newThreadEditor.find('.mentionInput textarea');
        },
        get threadEditor() {
          return cy.get('.vf-thread-editor:not(.vf-thread-editor--new)');
        },
        get threadReply() {
          return cy.get('.vf-thread-editor__reply');
        },
        get threadEditorInput() {
          return this.threadEditor.find('.mentionInput textarea');
        },
        get threadComments() {
          return this.threadEditor.find('.vf-thread-editor__comment-editor');
        },
      },

      meta: {
        route: /project\/.*\/canvas\/.*?\/commenting/,
      },
    },

    markup: {
      goToCanvas: () => cy.getSession().then(({ versionID, diagramID }) => cy.visit(`/project/${versionID}/canvas/${diagramID}/markup`)),

      el: {
        get menu() {
          return cy.get('#vf-markup-menu');
        },
        get menuButton() {
          return this.menu.find('button');
        },
        get textMenuButton() {
          return this.menuButton.eq(0);
        },
        get imageMenuButton() {
          return this.menuButton.eq(1);
        },
        get markupText() {
          return cy.get('.vf-canvas__node--markup_text');
        },
        get markupTextInput() {
          return this.markupText.find('.slate-editor');
        },
        get markupImage() {
          return cy.get('.vf-canvas__node--markup_image');
        },
        get imageUpload() {
          return cy.get('input[type="file"]');
        },
      },

      meta: {
        route: /project\/.*\/canvas\/.*?\/markup/,
      },
    },
  },

  meta: {
    route: /project\/.*\/canvas\/.*/,
  },
};
