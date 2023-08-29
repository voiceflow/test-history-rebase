import { BlockType } from '../../src/constants';
import { ClassName, Identifier } from '../../src/styles/constants';

export default {
  goToCanvas: () => cy.getSession().then(({ versionID, diagramID }) => cy.visit(`/project/${versionID}/canvas/${diagramID}`)),
  startPrototype: () => {
    cy.intercept('/interact/*').as('startPrototype');
    cy.wait('@startPrototype');
  },
  route: {
    postDiagram: () => cy.intercept('GET', '/v2/diagrams/**'),
  },

  el: {
    get projectTitle() {
      return cy.get(`#${Identifier.PROJECT_TITLE}`);
    },
    get node() {
      return cy.get(`.${ClassName.CANVAS_NODE}`);
    },
    get nodeHovered() {
      return cy.get(`.${ClassName.CANVAS_NODE}--hovered`);
    },
    get link() {
      return cy.get(`.${ClassName.CANVAS_LINK}`);
    },
    get newLink() {
      return cy.get(`#${Identifier.NEW_LINK}`);
    },
    get linkSettings() {
      return cy.get(`.${ClassName.LINK_SETTINGS}`);
    },
    get homeChip() {
      return cy.get(`.${ClassName.HOME_CHIP}`);
    },
    get settingsPage() {
      return cy.get(`#${Identifier.SETTINGS_PAGE}`);
    },
    get canvas() {
      return cy.get(`#${Identifier.CANVAS}`);
    },
    get canvasOffset() {
      return cy.get(`#${Identifier.CANVAS_OFFSET}`);
    },
    get commentingModeControl() {
      return cy.get(`.${ClassName.CANVAS_CONTROL}--commenting button`);
    },
    get markupTextControl() {
      return cy.get(`.${ClassName.CANVAS_CONTROL}--markup-text button`);
    },
    get markupImageControl() {
      return cy.get(`.${ClassName.CANVAS_CONTROL}--markup-image button`);
    },
    get designMenu() {
      return cy.get(`#${Identifier.DESIGN_MENU}`);
    },
    get stepMenu() {
      return cy.get(`#${Identifier.STEP_MENU}`);
    },
    tabs: {
      get designTab() {
        return cy.get(`.${ClassName.SIDEBAR_ICON_MENU_ITEM}--DESIGN`);
      },
      get launchTab() {
        return cy.get(`.${ClassName.SIDEBAR_ICON_MENU_ITEM}--INTEGRATION`);
      },
      get settingsTab() {
        return cy.get(`.${ClassName.SIDEBAR_ICON_MENU_ITEM}--SETTINGS`);
      },
    },
    shareTabs: {
      get inviteTab() {
        return cy.get(`.${ClassName.POPPER_NAV_ITEM}[href="INVITE"]`);
      },
      get prototypeTab() {
        return cy.get(`.${ClassName.POPPER_NAV_ITEM}[href="PROTOTYPE"]`);
      },
      get exportTab() {
        return cy.get(`.${ClassName.POPPER_NAV_ITEM}[href="EXPORT"]`);
      },
    },
    get uploadButton() {
      return cy.get(`#${Identifier.UPLOAD}`);
    },
    get shareButton() {
      return cy.get(`#${Identifier.SHARE_BUTTON}`);
    },
    get shareLinkCopyButton() {
      return cy.get(`#${Identifier.SHARE_COPY_LINK_BUTTON}`);
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
    get brandingDropdown() {
      return cy.get(`#${Identifier.APPEARANCE_AND_BRANDING_DD} > div:first-child`);
    },
    get brandingColorInput() {
      return cy.get(`.${ClassName.COLOR_INPUT} input`);
    },
    get markupText() {
      return cy.get(`.${ClassName.CANVAS_NODE}--${BlockType.MARKUP_TEXT}`);
    },
    get markupTextInput() {
      return this.markupText.find('.slate-editor');
    },
    get markupImage() {
      return cy.get(`.${ClassName.CANVAS_NODE}--${BlockType.MARKUP_IMAGE}`);
    },
    get markupVideo() {
      return cy.get(`.${ClassName.CANVAS_NODE}--${BlockType.MARKUP_VIDEO}`);
    },
    get markupImageUpload() {
      return cy.get('body input#vf-upload[type="file"]');
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
  },

  meta: {
    route: /project\/.*\/canvas\/.*/,
  },
};
