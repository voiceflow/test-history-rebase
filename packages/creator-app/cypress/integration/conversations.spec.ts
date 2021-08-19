import { ClassName } from '../../src/styles/constants';
import canvasPage from '../pages/canvas';
import conversations from '../pages/conversations';
import { legacyModal } from '../pages/modals';
import prototypePage from '../pages/prototype';

const SYSTEM_PROMPT = 'This is a speak step';
const SESSION_ID = '123';
const DEFAULT_TRANSCRIPT_CONTEXT = 'Conversation between your assistant and Test Account';
const TRANSCRIPTS_TAGS_MODAL_PLACEHOLDER = 'Add new tags separated by commas';
const MOCK_TAG_NAME = 'tag1';
const CREATOR_ID = '1';

context('Conversations', () => {
  beforeEach(() => cy.setup());

  afterEach(() => {
    cy.teardown();
  });

  describe('empty transcripts page', () => {
    it('displays empty transcripts page with no test runs', () => {
      cy.createProject('general', 'prototype:speak_and_choice');
      canvasPage.goToCanvas();
      conversations.goToTranscriptsTab();
      conversations.el.emptyTranscriptsContainer.should('be.visible');
    });
  });

  describe('click to change active transcript', () => {
    it('displays empty transcripts page with no test runs', () => {
      cy.createProject('general', 'prototype:speak_and_choice');
      cy.createTranscript({ sessionID: SESSION_ID, creatorID: null });
      cy.createTranscript({ sessionID: SESSION_ID, creatorID: null });
      canvasPage.goToCanvas();
      conversations.goToTranscriptsTab();

      conversations.el.conversationsPage.should('be.visible');

      conversations.el.transcriptListItem.eq(0).should('have.class', 'active');
      conversations.el.transcriptListItem //
        .eq(1)
        .should('not.have.class', 'active')
        .click();

      conversations.el.transcriptListItem.eq(0).should('not.have.class', 'active');
      conversations.el.transcriptListItem //
        .eq(1)
        .should('have.class', 'active');
    });
  });

  describe('toggling and managing transcript tags', () => {
    it.skip('toggles built-in tags through transcript actions', () => {
      conversations.createProjectAndTranscript(SESSION_ID, CREATOR_ID);
      canvasPage.goToCanvas();
      conversations.goToTranscriptsTab();

      conversations.el.conversationsPage.should('be.visible');

      conversations.el.markAsReviewedTranscriptButton.click();
      conversations.el.saveForLaterTranscriptButton.click();

      conversations.el.transcriptListItem.scrollIntoView();
      conversations.el.transcriptListItem
        .eq(0)
        .find(`.${ClassName.TRANSCRIPT_ITEM_STATUSES}`)
        .find(`.${ClassName.MARK_AS_REVIEWED_CONTAINER}`)
        .should('be.visible');
      conversations.el.transcriptListItem
        .eq(0)
        .find(`.${ClassName.TRANSCRIPT_ITEM_STATUSES}`)
        .find(`.${ClassName.SAVED_FOR_LATER_CONTAINER}`)
        .should('be.visible');

      conversations.el.markAsReviewedTranscriptButton.click();
      conversations.el.saveForLaterTranscriptButton.click();

      conversations.el.transcriptListItem.scrollIntoView();
      conversations.el.transcriptListItem.eq(0).contains(`.${ClassName.TRANSCRIPT_ITEM_STATUSES}`).should('not.exist');
    });

    it('add and delete custom tags in report tags dropdown', () => {
      conversations.createProjectAndTranscript(SESSION_ID, CREATOR_ID);
      canvasPage.goToCanvas();
      conversations.goToTranscriptsTab();

      conversations.el.reportTagInput.invoke('val').should('contain', '');
      conversations.el.reportTagInput.type(`${MOCK_TAG_NAME}{enter}`);

      conversations.assertReportTagExists(MOCK_TAG_NAME);

      conversations.el.reportTagInput.type('{del}');
      conversations.el.reportTagInput.invoke('val').should('contain', '');
      conversations.el.transcriptListItem.eq(0).contains(`.${ClassName.TRANSCRIPT_ITEM_STATUSES}`).should('not.exist');
    });

    it('create and add custom tags in report tag manager', () => {
      conversations.createProjectAndTranscript(SESSION_ID, CREATOR_ID);
      canvasPage.goToCanvas();
      conversations.goToTranscriptsTab();

      conversations.el.reportTagInput.type(' ');
      cy.get('div').contains('Manage Tags').click();
      cy.get(`input[placeholder="${TRANSCRIPTS_TAGS_MODAL_PLACEHOLDER}"]`).focus().type(`${MOCK_TAG_NAME}{enter}`);
      cy.get('button').contains('Close').click();

      conversations.el.reportTagInput.click().type('{enter}');
      conversations.assertReportTagExists(MOCK_TAG_NAME);
    });

    it('deletes report tags in report tag manager', () => {
      conversations.createProjectAndTranscript(SESSION_ID, CREATOR_ID);
      cy.createReportTag({ label: MOCK_TAG_NAME, tagID: CREATOR_ID });

      canvasPage.goToCanvas();
      conversations.goToTranscriptsTab();

      conversations.el.reportTagInput.click().type(' ');
      cy.get('div').contains('Manage Tags').click();

      cy.get('input').get(`.${ClassName.TAG_MODAL_INPUT_FIELD}-${MOCK_TAG_NAME}`).should('be.visible');
      cy.get('button').get(`.${ClassName.DELETE_TAG_BUTTON}-${MOCK_TAG_NAME}`).click();
      conversations.assertSuccessToast();
    });
  });

  describe('prototype mode save transcripts', () => {
    it('saves transcript', () => {
      cy.createProject('general', 'prototype:speak_and_choice');
      canvasPage.goToCanvas();
      canvasPage.el.testButton.click();
      canvasPage.el.startPrototypeButton.click();
      cy.get(`.${ClassName.PROTOTYPE_BUTTON}`).contains('yes').click();
      cy.get(`.${ClassName.CHAT_DIALOG_LOADING_MESSAGE}`).should('not.be.visible');
      conversations.el.prototypeSaveTranscriptButton.click();
      conversations.assertSuccessToast();

      conversations.goToTranscriptsTab();
      conversations.el.transcriptUserName.should('have.text', DEFAULT_TRANSCRIPT_CONTEXT);
      conversations.el.transcriptMeta.should('be.visible');
      cy.get(`.active`).should('be.visible').find(`.${ClassName.TRANSCRIPT_DATE}`).should('be.visible');
    });
  });

  describe('public prototype mode save transcripts', () => {
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
      prototypePage.el.systemResponse.should('have.text', SYSTEM_PROMPT);
      prototypePage.el.messageInput.type('yes');
      prototypePage.el.submitMessageInputButton.click();
      prototypePage.assertFinished();

      conversations.goToTranscriptsTab();
      conversations.el.transcriptUserName.should('have.text', DEFAULT_TRANSCRIPT_CONTEXT);
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
