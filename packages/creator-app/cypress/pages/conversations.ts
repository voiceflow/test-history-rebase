import { ModalType } from '../../src/constants';
import { ClassName, Identifier } from '../../src/styles/constants';

const TOAST_CLASS_NAME = 'Toastify__toast';

export default {
  goToTranscriptsTab: () => cy.getSession().then(({ versionID }) => cy.visit(`/project/${versionID}/transcripts`)),

  awaitLoadingTranscripts() {
    // this.el.transcriptLoadingIndicator.should('not.be.visible');
    // this.el.dialogLoadingIndicator.should('not.be.viible');
  },

  createProjectAndTranscript: (sessionID: string, creatorID: string) => {
    cy.createProject('general', 'prototype:speak_and_choice');
    cy.createTranscript({ sessionID, creatorID });
  },

  assertReportTagExists: (label: string) => {
    cy.get(`.${ClassName.BASE_REPORT_TAG_INPUT}`).contains(label);
    cy.get(`.active`).find(`.${ClassName.TRANSCRIPT_ITEM_META}`).should('contain', label);
  },

  assertSuccessToast: () => {
    cy.get(`.${TOAST_CLASS_NAME} .vf-svg-icon--checkmark`).should('be.visible');
  },

  assertSuccessDeleteTranscriptToast: () => {
    cy.get(`.${TOAST_CLASS_NAME} .vf-svg-icon--checkmark`).should('be.visible');
  },

  addTranscriptNotes: () => {
    cy.fillElementsInput('notes', 'Test Notes');
  },

  transcriptListItemToggle: () => {
    cy.get(`.${ClassName.TRANSCRIPT_ITEM_DROPDOWN_BUTTON}`).first().click(); // might need to click in button first
  },

  el: {
    get prototypeSaveTranscriptButton() {
      return cy.get(`#${Identifier.SAVE_TRANSCRIPT_BUTTON}`);
    },

    get conversationsPage() {
      return cy.get(`#${Identifier.CONVERSATIONS_PAGE}`);
    },

    get markAsReviewedTranscriptButton() {
      return cy.get(`#${Identifier.MARK_AS_REVIEWED_TRANSCRIPT_BUTTON}`);
    },

    get saveForLaterTranscriptButton() {
      return cy.get(`#${Identifier.SAVE_FOR_LATER_TRANSCRIPT_BUTTON}`);
    },

    get deleteTranscriptButton() {
      return cy.get(`#${Identifier.DELETE_TRANSCRIPT_BUTTON}`);
    },

    get confirmDeleteTranscriptModal() {
      return cy.get(`#${ModalType.CONFIRM}`);
    },

    get transcriptListItem() {
      return cy.get(`.${ClassName.TRANSCRIPT_ITEM}`);
    },

    get transcriptListItemStatus() {
      return cy.get(`.${ClassName.TRANSCRIPT_ITEM_DROPDOWN_BUTTON}`); // TODO: need ID
    },

    get transcriptUserName() {
      return cy.get(`.${ClassName.TRANSCRIPT_USER_NAME}`);
    },

    get reportTagInput() {
      return cy.get(`.${ClassName.BASE_REPORT_TAG_INPUT}`);
    },

    get transcriptMeta() {
      return cy.get(`.${ClassName.TRANSCRIPT_CONTEXT_META}`);
    },

    get transcriptDate() {
      return cy.get(`${ClassName.TRANSCRIPT_DATE}`);
    },

    get emptyTranscriptsContainer() {
      return cy.get(`#${Identifier.EMPTY_TRANSCRIPTS_CONTAINER}`);
    },
  },

  meta: {
    route: '/transcripts/.*/',
  },
};
