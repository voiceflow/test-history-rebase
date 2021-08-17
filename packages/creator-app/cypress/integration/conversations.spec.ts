// import moment from 'moment';

import { ClassName } from '../../src/styles/constants';
import canvasPage from '../pages/canvas';
import conversations from '../pages/conversations';
import { legacyModal } from '../pages/modals';
import prototypePage from '../pages/prototype';

const systemPrompt = 'This is a speak step';
const defaultTranscriptContext = 'Conversation between your assistant and Test Account';
// const currentDate = `${moment(Date.now()).format('LT').toLocaleLowerCase()}, ${moment(Date.now()).format('MMMM Do')}`;

context('Conversations', () => {
  describe('empty transcripts page', () => {
    beforeEach(() => cy.setup());

    afterEach(() => {
      cy.teardown();
    });

    it('displays empty transcripts page with no test runs', () => {
      cy.createProject('general', 'prototype:speak_and_choice');
      canvasPage.goToCanvas();
      conversations.goToTranscriptsTab();
      conversations.el.emptyTranscriptsContainer.should('be.visible');
    });
  });

  describe('prototype mode save transcripts', () => {
    beforeEach(() => cy.setup());

    afterEach(() => {
      cy.teardown();
    });

    it('saves transcript', () => {
      cy.createProject('general', 'prototype:speak_and_choice');
      canvasPage.goToCanvas();
      canvasPage.el.testButton.click();
      canvasPage.el.startPrototypeButton.click();
      cy.get(`.${ClassName.PROTOTYPE_BUTTON}`).contains('yes').click();
      cy.get(`.${ClassName.CHAT_DIALOG_LOADING_MESSAGE}`).should('not.be.visible');
      conversations.el.prototypeSaveTranscriptButton.click();
      conversations.assertSuccessSaveTranscriptToast();

      conversations.goToTranscriptsTab();
      conversations.el.transcriptUserName.should('have.text', defaultTranscriptContext);
      conversations.el.transcriptMeta.should('be.visible');
      cy.get(`.active`).should('be.visible').find(`.${ClassName.TRANSCRIPT_DATE}`).should('be.visible');
    });
  });

  describe('public prototype mode save transcripts', () => {
    beforeEach(() => cy.setup());

    afterEach(() => {
      cy.teardown();
    });

    it('saves transcript', () => {
      cy.createProject('general', 'prototype:speak_and_choice');
      cy.renderTest('general');

      canvasPage.goToCanvas();
      canvasPage.el.shareButton.click();
      canvasPage.el.shareTabs.shareTab.click();
      canvasPage.el.shareLinkCopyButton.click();
      cy.clipboard().then((clipboardData) => cy.visit(clipboardData!));

      // Run public prototype
      prototypePage.el.startPrototypeButton.click();
      prototypePage.awaitMessage();
      prototypePage.el.systemResponse.should('have.text', systemPrompt);
      prototypePage.el.messageInput.type('yes');
      prototypePage.el.submitMessageInputButton.click();
      prototypePage.assertFinished();

      conversations.goToTranscriptsTab();
      conversations.el.transcriptUserName.should('have.text', defaultTranscriptContext);
      conversations.el.transcriptMeta.should('be.visible');
      cy.get(`.active`).should('be.visible').find(`.${ClassName.TRANSCRIPT_DATE}`).should('be.visible');
    });

    it.skip('deletes transcript', () => {
      conversations.el.deleteTranscriptButton.click();
      legacyModal.el.confirm.should('be.visible').find('button').eq(1).click();
      conversations.el.emptyTranscriptsContainer.should('be.visible');
    });
  });
});
