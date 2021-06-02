import { ClassName, Identifier } from '../../src/styles/constants';
import { uploadFile } from '../utils';
import canvasPage from './canvas';
import dashboardPage from './dashboard';

export const PROJECT_NAME = 'Project Name';

export const helper = {
  clickProjectCreateButton: () => {
    dashboardPage.el.newProjectButton.click();
  },
  clickButtonWithText: (text: string) => {
    cy.get(`.${ClassName.BUTTON}`).contains(text).click();
  },
  completeNameImage: () => {
    helper.el.newProjectNameInput.type(PROJECT_NAME);
    cy.intercept('POST', '/image').as('uploadImage');
    uploadFile(`#${Identifier.NEW_PROJECT_ICON_UPLOAD_CONTAINER}`);
    cy.wait('@uploadImage');
    helper.clickButtonWithText('Continue');
  },
  getHomeStep: () => cy.get(`.${ClassName.HOME_BLOCK}`).find(`.${ClassName.CANVAS_STEP}`).first(),
  goBackStep: () => {
    cy.get(`.${ClassName.CREATE_PROJECT_LEFT_ACTION}`).contains('back').click();
  },
  cancelFlow: () => {
    cy.get(`.${ClassName.CREATE_PROJECT_RIGHT_ACTION}`).contains('cancel').click();
  },
  completePlatformSelect: (platformKeyword: string) => {
    cy.get(`.${ClassName.PLATFORM_CARD}`).contains(platformKeyword).click();
  },
  completeInvocationLanguage: (language?: string, invocationName?: string) => {
    if (language) {
      cy.get(`.${ClassName.MULTISELECT_DROPDOWN}`).first().click();
      cy.get(`.${ClassName.MULTISELECT_ITEM}`).contains(language).first().click({ force: true });
    }
    if (invocationName) {
      cy.get(`#${Identifier.INVOCATION_NAME_INPUT}`).clear().type(invocationName);
    }
    helper.clickButtonWithText('Create Project');
  },
  el: {
    get newProjectNameInput() {
      return cy.get(`#${Identifier.NEW_PROJECT_NAME_INPUT}`);
    },
    get projectCreationStepTitle() {
      return cy.get(`#${Identifier.PROJECT_CREATION_STEP_TITLE}`);
    },
  },
};

export default {
  createProject: (platformKeyword: string, language?: string, invocationName?: string) => {
    cy.visit('/');
    helper.clickProjectCreateButton();
    helper.completeNameImage();
    helper.completePlatformSelect(platformKeyword);
    helper.completeInvocationLanguage(language, invocationName);
    canvasPage.el.projectTitle.should('be.visible');
    canvasPage.el.projectTitle.should('have.text', PROJECT_NAME);
  },
  el: helper.el,

  meta: {
    route: /\/workspace\/template\/.*/,
  },
};
