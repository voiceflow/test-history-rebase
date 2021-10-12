import { ClassName } from '../../../src/styles/constants';

const formRoot = () => cy.get('ul.gs__steps-list > .gs__steps-list__list-item');

const form = {
  basicSkillInfo: {
    get root() {
      return formRoot().eq(0);
    },
  },
  skillDescription: {
    get root() {
      return formRoot().eq(1);
    },
  },
  skillInvocation: {
    get root() {
      return formRoot().eq(2);
    },
  },
  locales: {
    get root() {
      return formRoot().eq(3);
    },
  },
  privacyAndTerms: {
    get root() {
      return formRoot().eq(4);
    },
  },
  privacyAndCompliance: {
    get root() {
      return formRoot().eq(5);
    },
  },
};

export default {
  el: {
    get progressIndicators() {
      return cy.get('ul.gs__steps-list > li');
    },
    basicSkillInfo: {
      get displayName() {
        return form.basicSkillInfo.root.find('input[type="text"]').eq(0);
      },
      get largeIconUpload() {
        return form.basicSkillInfo.root.find('input[type="file"]').eq(0);
      },
      get smallIconUpload() {
        return form.basicSkillInfo.root.find('input[type="file"]').eq(1);
      },
    },
    skillDescription: {
      get summary() {
        return form.skillDescription.root.find("input[type='text']").eq(0);
      },
      get description() {
        return form.skillDescription.root.find('textarea').eq(0);
      },
      get categoryToggle() {
        return form.skillDescription.root.find('svg').eq(0);
      },
      get categoryDropdown() {
        return cy.get('.vf-menu .vf-menu__item');
      },
      get keywords() {
        return form.skillDescription.root.find("input[name='keywords']");
      },
    },
    skillInvocation: {
      get invocationName() {
        return form.skillInvocation.root.find("input[type='text']").eq(0);
      },
      get invocations() {
        return form.skillInvocation.root.find(`.${ClassName.INPUT_GROUP} input[type='text']`);
      },
      get deleteButtons() {
        return form.skillInvocation.root.find(`.${ClassName.INPUT_GROUP} button`);
      },
      get addInvocationButton() {
        return form.skillInvocation.root.find(`.${ClassName.FORMS_MULTIPLE_BUTTON}`).eq(0);
      },
    },
    locales: {
      get buttonGroup() {
        return form.locales.root.find('.locale-button-group > button');
      },
    },
    privacyAndTerms: {
      get privacyPolicy() {
        return form.privacyAndTerms.root.find('input[name="privacyPolicy"]').eq(0);
      },
      get termsAndCond() {
        return form.privacyAndTerms.root.find('input[name="termsAndConditions"]').eq(0);
      },
      get toggle() {
        return form.privacyAndTerms.root.find('.react-toggle-thumb').eq(0);
      },
      get toggleValue() {
        return form.privacyAndTerms.root.find('u').eq(0);
      },
    },
    privacyAndCompliance: {
      get purchaseRadioButtons() {
        return form.privacyAndCompliance.root.find('input[name="purchase"]');
      },
      get personalRadioButtons() {
        return form.privacyAndCompliance.root.find('input[name="personal"]');
      },
      get adsRadioButtons() {
        return form.privacyAndCompliance.root.find('input[name="ads"]');
      },
      get certifyCheckbox() {
        return form.privacyAndCompliance.root.find("input[type='checkbox']");
      },
      get testingInstructions() {
        return form.privacyAndCompliance.root.find('textarea');
      },
    },
    get nextButton() {
      return cy.get('.gs__is-active .gs__panel-footer button');
    },
    get submitButton() {
      return cy.get('.gs__panel-footer button');
    },
  },
  meta: {
    route: /project\/.*\/publish\/alexa/,
  },
};
