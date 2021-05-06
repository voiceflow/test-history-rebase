const CONVERSATION_OVER_MSG = 'This conversation has ended';

export default {
  goToPrototype: () => cy.getSession().then(({ versionID }) => cy.visit(`/prototype/${versionID}`)),

  startPrototype() {
    this.el.startPrototypeButton.click();
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
    get messageInput() {
      return cy.get('input');
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
    get chips() {
      return cy.get('.simplebar-content').find('div');
    },
    get submitMessageInputButton() {
      return cy.get('.vf-svg-icon--send').find('svg');
    },
    get resetPrototypeButton() {
      return cy.get('.vf-svg-icon--restart').find('svg');
    },
  },

  meta: {
    route: /prototype\/.*/,
  },
};
