import { ClassName, Identifier } from '../../src/styles/constants';

const CONVERSATION_OVER_MSG = 'This conversation has ended';

export default {
  goToPrototype: () => cy.getSession().then(({ versionID }) => cy.visit(`/prototype/${versionID}`)),

  startPrototype() {
    this.el.startPrototypeButton.click();
  },

  uploadImage: (id: string) => {
    cy.get(`#${id} input[type="file"]`).selectFile({ contents: 'cypress/fixtures/image.png' }, { force: true });
  },

  awaitMessage() {
    this.el.loadingIndicator.should('not.be.visible');
  },

  assertFinished() {
    this.el.messageInput.should('have.attr', 'placeholder', CONVERSATION_OVER_MSG);
  },

  el: {
    get startPrototypeButton() {
      return cy.get('#vf-prototype__start');
    },
    get publicPrototypeImage() {
      return cy.get(`#${Identifier.PUBLIC_SHARE_PROTOTYPE_IMAGE}`);
    },
    get publicPrototypeMessageIcon() {
      return cy.get(`.${ClassName.PROTOTYPE_MESSAGE_ICON}:first`);
    },
    get messageInput() {
      return cy.get('input#vf-prototype-user-input');
    },
    get voiceInput() {
      return cy.get('#vf-speech-bar');
    },
    get dialog() {
      return cy.get('.chat-dialog-content');
    },
    get loadingIndicator() {
      return this.dialog.find('.vf-chat-dialog__message--loading');
    },
    get systemResponse() {
      return this.dialog.find('.vf-chat-dialog__message--speak');
    },
    get visualImage() {
      return cy.get('.vf-visual--image');
    },
    get buttons() {
      return cy.get(`.${ClassName.PROTOTYPE_BUTTON}`);
    },
    get submitMessageInputButton() {
      return cy.get('.vf-svg-icon--send').find('svg');
    },
    get resetPrototypeButton() {
      return cy.get('.vf-svg-icon--randomLoop').find('svg');
    },
    get prototypeMenuCanvasButton() {
      return cy.get(`#${Identifier.PROTO_MENU_CANVAS_BUTTON}`);
    },
    get prototypeMenuDisplayButton() {
      return cy.get(`#${Identifier.PROTO_MENU_DISPLAY_BUTTON}`);
    },
    get prototypeDeveloperDisplayButton() {
      return cy.get(`#${Identifier.PROTO_MENU_DEVELOPER_BUTTON}`);
    },
    get prototypeMenuSettingsButton() {
      return cy.get(`#${Identifier.PROTO_MENU_SETTINGS_BUTTON}`);
    },
    get displayCanvasContainer() {
      return cy.get(`#${Identifier.DISPLAY_CANVAS_CONTAINER}`);
    },
    get aplContainer() {
      return cy.get(`.${ClassName.VISUAL_APL}`);
    },
    get protoVariablesMenuContainer() {
      return cy.get(`#${Identifier.PROTO_VARIABLES_MENU_CONTAINER}`);
    },
    get protoSettingsMenuContainer() {
      return cy.get(`#${Identifier.PROTO_SETTINGS_MENU_CONTAINER}`);
    },
  },

  meta: {
    route: /prototype\/.*/,
  },
};
