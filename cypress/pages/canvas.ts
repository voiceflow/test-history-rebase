import { ClassName, ExternalClassName, Identifier } from '../../src/styles/constants';

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
      return cy.get(`#${Identifier.PROJECT_TITLE}`);
    },
    get modal() {
      return cy.get(`.${ExternalClassName.MODAL_DIALOG}`);
    },
    get modalTitle() {
      return cy.get(`.${ExternalClassName.MODAL_CONTENT} h5`);
    },
    get node() {
      return cy.get(`.${ClassName.CANVAS_NODE}`);
    },
    get link() {
      return cy.get(`.${ClassName.CANVAS_LINK}`);
    },
    get linkSettings() {
      return cy.get(`.${ClassName.LINK_SETTINGS}`);
    },
    get homeBlock() {
      return cy.get(`.${ClassName.HOME_BLOCK}`);
    },
    get settingsPage() {
      return cy.get(`#${Identifier.SETTINGS_PAGE}`);
    },
    get canvas() {
      return cy.get(`#${Identifier.CANVAS}`);
    },
    get escapeModePrompt() {
      return cy.get(`#${Identifier.ESCAPE_MODE_PROMPT}`);
    },
    get commentingModeControl() {
      return cy.get(`.${ClassName.COMMENTING_MODE} button`);
    },
    get markupModeControl() {
      return cy.get(`.${ClassName.MARKUP_MODE} button`);
    },
    get designMenu() {
      return cy.get(`#${Identifier.DESIGN_MENU}`);
    },
    get stepMenu() {
      return cy.get(`#${Identifier.STEP_MENU}`);
    },
    tabs: {
      get designTab() {
        return cy.get(`#${Identifier.DESIGN_TAB}`);
      },
      get launchTab() {
        return cy.get(`#${Identifier.LAUNCH_TAB}`);
      },
    },
    get uploadButton() {
      return cy.get(`#${Identifier.UPLOAD}`);
    },
    get shareButton() {
      return cy.get(`#${Identifier.SHARE_BUTTON}`);
    },
    get testButton() {
      return cy.get(`#${Identifier.TEST}`);
    },
    get speakBlockTextInput() {
      return cy.get('.DraftEditor-root');
    },
    get choiceBlockTextInput() {
      return cy.get('input').eq(1).should('have.attr', 'placeholder', 'Name new intent or select existing intent');
    },
    get userInputToggle() {
      return cy.get('span').contains('User Input');
    },
    get testTypeSelector() {
      return cy.get(`#${Identifier.TEST_TYPE_SELECTOR}`);
    },
    get voiceAndTranscriptTestTypeOption() {
      return cy.get(`.${ClassName.TEST_TYPE_OPTION}`).contains('Voice and Transcript');
    },
    get voiceAndVisualsTestTypeOption() {
      return cy.get(`.${ClassName.TEST_TYPE_OPTION}`).contains('Voice and Visuals');
    },
    get startPrototypeButton() {
      return cy.get('#vf-prototype__start');
    },
  },

  mode: {
    commenting: {
      goToCanvas: () => cy.getSession().then(({ versionID, diagramID }) => cy.visit(`/project/${versionID}/canvas/${diagramID}/commenting`)),

      el: {
        get historyDrawer() {
          return cy.get(`#${Identifier.THREAD_HISTORY_DRAWER}`);
        },
        get thread() {
          return cy.get(`.${ClassName.THREAD}`);
        },
        get threadIndicator() {
          return cy.get(`.${ClassName.THREAD_INDICATOR}`);
        },
        get newThreadEditor() {
          return cy.get(`.${ClassName.THREAD_EDITOR_NEW}`);
        },
        get newTreadEditorInput() {
          return this.newThreadEditor.find(`.${ClassName.MENTION_INPUT} textarea`);
        },
        get threadEditor() {
          return cy.get(`.${ClassName.THREAD_EDITOR}:not(.vf-thread-editor--new)`);
        },
        get threadReply() {
          return cy.get(`.${ClassName.THREAD_EDITOR_REPLY}`);
        },
        get threadEditorInput() {
          return this.threadEditor.find(`.${ClassName.MENTION_INPUT} textarea`);
        },
        get threadComments() {
          return this.threadEditor.find(`.${ClassName.THREAD_EDITOR_COMMENT}`);
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
