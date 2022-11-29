import { ClassName, Identifier } from '../../src/styles/constants';
import { createSelectControl } from './utils';

export type ProjectChannel = 'Chat Assistant' | 'Voice Assistant' | 'Amazon Alexa' | 'Google Assistant';
export type NLU = 'Voiceflow';

export default {
  createProject(
    channel: ProjectChannel,
    { nlu, language, locale, invocationName }: { nlu?: NLU; language?: string; locale?: string; invocationName?: string } = {}
  ) {
    cy.visit('/');
    this.el.newProject.click();
    this.el.channelSelect.open();
    this.el.channelSelect.select(channel);

    if (nlu) {
      this.el.nluSelect.open();
      this.el.nluSelect.select(nlu);
    }

    if (invocationName) {
      this.el.invocationNameInput.clear().type(invocationName);
    }

    if (language) {
      this.el.localeSelect.open();
      this.el.localeSelect.select(language);
    }

    if (locale) {
      this.el.multipleLocalesSelect.open();
      this.el.multipleLocalesSelect.select(locale);
    }

    this.el.createProject.click();
  },
  el: {
    get invocationNameInput() {
      return cy.get(`#${Identifier.INVOCATION_NAME_INPUT}`);
    },
    get projectCreationStepTitle() {
      return cy.get(`#${Identifier.PROJECT_CREATION_STEP_TITLE}`);
    },
    get cancelButton() {
      return cy.get(`.${ClassName.CREATE_PROJECT_RIGHT_ACTION}`).contains('cancel');
    },
    get backButton() {
      return cy.get(`.${ClassName.CREATE_PROJECT_LEFT_ACTION}`).contains('back').click();
    },
    get newProject() {
      return cy.get(`#${Identifier.NEW_PROJECT_BUTTON}`);
    },
    get createProject() {
      return cy.get(`.${ClassName.BUTTON}`).contains('Create');
    },
    get channelSelect() {
      return createSelectControl(Identifier.PROJECT_CREATE_SELECT_CHANNEL);
    },
    get nluSelect() {
      return createSelectControl(Identifier.PROJECT_CREATE_SELECT_NLU);
    },
    get localeSelect() {
      return createSelectControl(Identifier.PROJECT_CREATE_SELECT_LOCALE);
    },
    get multipleLocalesSelect() {
      return createSelectControl(Identifier.PROJECT_CREATE_SELECT_MULTIPLE_LOCALES);
    },
  },

  meta: {
    route: /\/workspace\/template\/.*/,
  },
};
