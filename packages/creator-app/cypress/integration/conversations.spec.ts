import { Sentiment } from '../../src/models/Transcript';
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

context.skip('Conversations', () => {
  beforeEach(() => cy.setup());

  afterEach(() => {
    cy.teardown();
  });

  describe('when navigating to the conversations page using a URL with query parameters', () => {
    it('changes add filters menu text with filters counter', () => {
      conversations.createProjectAndTranscript(SESSION_ID, CREATOR_ID);
      canvasPage.goToCanvas();

      conversations.goToTranscriptsTab(`?range=Yesterday&tag=${Sentiment.EMOTION_NEGATIVE}&tag=${Sentiment.EMOTION_POSITIVE}`);

      conversations.el.transcriptsMenuText.should('include.text', 'Add filters (2)');
    });

    it('checks menu checkboxes and fills initial state values', () => {
      conversations.createProjectAndTranscript(SESSION_ID, CREATOR_ID);
      canvasPage.goToCanvas();

      conversations.goToTranscriptsTab(`?range=Yesterday&tag=${Sentiment.EMOTION_NEGATIVE}&tag=${Sentiment.EMOTION_POSITIVE}`);

      conversations.el.transcriptsMenuText.click();
      conversations.el.transcriptsTimeRangeCheckbox.should('be.checked');
      conversations.el.transcriptsMenuTagsCheckbox.should('be.checked');
      conversations.el.transcriptTimeRangeSelectedItem.should('have.text', 'Yesterday');
      conversations.el.transcriptsSelectedFilterTagsIcons.first().should('have.attr', 'alt', 'Negative');
      conversations.el.transcriptsSelectedFilterTagsIcons.last().should('have.attr', 'alt', 'Positive');
    });

    describe('and there are transcripts for given search', () => {
      it('shows correct number of filtered transcripts', () => {
        conversations.createProjectAndTranscript(SESSION_ID, CREATOR_ID);
        cy.createTranscript({ sessionID: SESSION_ID, creatorID: CREATOR_ID, reportTags: [Sentiment.EMOTION_NEGATIVE] });
        cy.createTranscript({ sessionID: SESSION_ID, creatorID: CREATOR_ID, reportTags: [Sentiment.EMOTION_NEGATIVE] });
        canvasPage.goToCanvas();

        conversations.goToTranscriptsTab(`?range=Yesterday&tag=${Sentiment.EMOTION_NEGATIVE}`);

        conversations.el.transcriptListItem.should('have.length', 2);
      });
    });

    describe('and there are no transcripts for given search', () => {
      it('shows no result page content', () => {
        cy.createProject('general', 'prototype:speak_and_choice');
        cy.createTranscript({ sessionID: SESSION_ID, creatorID: CREATOR_ID, reportTags: [Sentiment.EMOTION_NEGATIVE] });
        canvasPage.goToCanvas();

        conversations.goToTranscriptsTab(`?range=Yesterday&tag=${Sentiment.EMOTION_POSITIVE}`);

        conversations.el.emptyReportsContainer.should('be.visible');
      });
    });
  });

  describe('when changing filter', () => {
    it('updates url query parameters', () => {
      conversations.createProjectAndTranscript(SESSION_ID, CREATOR_ID);
      canvasPage.goToCanvas();
      conversations.goToTranscriptsTab();

      conversations.el.transcriptsMenuText.click();
      conversations.el.transcriptsMenuTagsCheckbox.click();
      conversations.el.transcriptsMenuTagsInput.click();
      conversations.selectTranscriptsMenuTagsOption(Sentiment.EMOTION_POSITIVE);

      conversations.el.transcriptsMenuApplyButton.click({ force: true });

      cy.url().should('contain', `tag=${Sentiment.EMOTION_POSITIVE}`);
    });

    describe('and clearning filters', () => {
      it('clears url query parameters as well', () => {
        conversations.createProjectAndTranscript(SESSION_ID, CREATOR_ID);
        cy.createTranscript({ sessionID: SESSION_ID, creatorID: CREATOR_ID });
        canvasPage.goToCanvas();
        conversations.goToTranscriptsTab(`?range=Yesterday&tag=${Sentiment.EMOTION_NEGATIVE}`);

        conversations.el.transcriptsMenuText.click();
        conversations.el.transcriptsMenuTagsCheckbox.click();
        conversations.el.transcriptsMenuTagsInput.click();
        conversations.selectTranscriptsMenuTagsOption(Sentiment.EMOTION_POSITIVE);

        conversations.el.transcriptsMenuApplyButton.click({ force: true });
        conversations.el.emptyReportsContainer.should('be.visible');
        conversations.el.transcriptListItem.should('have.length', 0);

        conversations.el.transcriptsMenuText.click();
        conversations.el.transcriptsMenuTagsCheckbox.click();
        conversations.el.transcriptsMenuApplyButton.click({ force: true });

        cy.url().should('not.contain', 'tag=');
        conversations.el.transcriptListItem.should('have.length', 2);
      });
    });
  });

  describe('when transcripts page is empty', () => {
    it('displays empty transcripts page with no test runs', () => {
      cy.createProject('general', 'prototype:speak_and_choice');
      canvasPage.goToCanvas();
      conversations.goToTranscriptsTab();

      cy.awaitLoaded();
      conversations.el.emptyTranscriptsContainer.should('be.visible');
    });
  });

  describe('when clicking to change active transcript', () => {
    it('toggles between two transcripts', () => {
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

  describe('when toggling and managing transcript tags', () => {
    it('toggles built-in tags through transcript actions', () => {
      conversations.createProjectAndTranscript(SESSION_ID, CREATOR_ID);
      canvasPage.goToCanvas();
      conversations.goToTranscriptsTab();

      conversations.el.conversationsPage.should('be.visible');

      conversations.el.markAsReviewedTranscriptButton.click();
      conversations.el.saveForLaterTranscriptButton.click();

      conversations.el.transcriptListItem.scrollIntoView();
      conversations.el.transcriptListItem.eq(0).find(`.${ClassName.MARK_AS_REVIEWED_CONTAINER}`).should('be.visible');
      conversations.el.transcriptListItem.eq(0).find(`.${ClassName.SAVED_FOR_LATER_CONTAINER}`).should('be.visible');

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

  describe('when on prototype mode save transcripts', () => {
    it('saves transcript', () => {
      cy.createProject('general', 'prototype:speak_and_choice');
      canvasPage.goToCanvas();
      canvasPage.el.testButton.click();

      cy.awaitLoaded();
      canvasPage.el.startPrototypeButton.scrollIntoView();

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

  describe('when on public prototype mode save transcripts', () => {
    it('saves transcript', () => {
      cy.createProject('general', 'prototype:speak_and_choice');
      cy.renderTest('general');

      canvasPage.goToCanvas();
      canvasPage.el.shareButton.click();
      canvasPage.el.shareTabs.prototypeTab.click();
      canvasPage.el.shareLinkCopyButton.click();
      cy.clipboard().then((clipboardData) => cy.visit(clipboardData!));

      // Run public prototype
      prototypePage.el.startPrototypeButton.should('be.visible');
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

    it('deletes transcript', () => {
      conversations.createProjectAndTranscript(SESSION_ID, CREATOR_ID);
      canvasPage.goToCanvas();
      conversations.goToTranscriptsTab();
      cy.awaitLoaded();

      conversations.el.deleteTranscriptButton.click();
      legacyModal.el.confirm.should('be.visible').find('button').eq(1).click();

      cy.awaitLoaded();
      conversations.el.emptyTranscriptsContainer.should('be.visible');
    });
  });
});
