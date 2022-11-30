import { ClassName, Identifier } from '../../src/styles/constants';

const TOAST_CLASS_NAME = 'Toastify__toast';

const collaboratorHelper = {
  setup: () => {
    cy.setup();
    cy.createWorkspace();
    cy.visit('/dashboard');
  },
  openCollabModal: () => {
    cy.get(`#${Identifier.ADD_COLLABORATORS}`).click();
  },
  sendEmailInvite: (email: string) => {
    collaboratorHelper.el.getEmailInput.type(email);
    cy.get(`#${Identifier.COLLAB_SEND_INVITE_BUTTON}`).click();
  },
  assertInvite: (email: string, roleString: string) => {
    cy.get(`.${ClassName.COLLABORATOR_LINE_ITEM}[data-email="${email}"]`, { timeout: 10000 }).should('be.visible');
    cy.get(`.${ClassName.COLLABORATOR_LINE_ITEM}[data-email="${email}"] .${ClassName.MEMBER_ROLE_BUTTON}`).contains(roleString);
  },
  assertSuccessToast: () => {
    cy.get(`.${TOAST_CLASS_NAME} .vf-svg-icon--checkmark`).should('be.visible');
  },
  clickSaveShareLink: () => {
    cy.get(`#${Identifier.COPY_INVITE_BUTTON}`).click();
  },
  setInviteEmailToViewer: () => {
    cy.get(`.${ClassName.INVITE_ROLE_BUTTON}`).click();
    cy.get(`.${ClassName.MENU}`).get('li').contains('can view').click();
  },
  el: {
    get getEmailInput() {
      return cy.get('input[placeholder="Enter email"]');
    },
  },
};

export default {
  ...collaboratorHelper,
  el: collaboratorHelper.el,
};
