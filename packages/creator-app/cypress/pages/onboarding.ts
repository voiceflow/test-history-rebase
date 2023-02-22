import { ClassName, DashboardClassName, Identifier } from '../../src/styles/constants';

// TODO: we should try to replace these with classes from ClassName, ids from Identifier
// or deterministic data-ids such as for a list of languages where the
// associated code could be embedded in the ID
const TARGET_ELEMENT_TEXT = {
  RoleDropdown: 'Select your main role',
  TeamSizeDropdown: 'How many collaborators will you have?',
  ContinueButton: 'Continue',
  GetStartedButton: 'Get Started',
  GiveWorkspaceName: 'Give your workspace a name',
  InviteEmailExample: 'name@example.com',
  SendInviteButton: 'Send Invites',
  SkipInvites: 'Skip for now',
};

const exampleEmail = 'yeet@voiceflow.com';

export default {
  uploadImage: () => {
    cy.get('input[type="file"]').selectFile({ contents: 'cypress/fixtures/image.png' }, { force: true });
  },
  completeProfile() {
    this.el.inputByPlaceholder(TARGET_ELEMENT_TEXT.RoleDropdown).parent().click();
    this.el.activeMenuItems.first().click();
    this.page.profile.el.voiceModalityRadio.click();
    this.el.inputByPlaceholder(TARGET_ELEMENT_TEXT.TeamSizeDropdown).parent().click();
    this.el.activeMenuItems.first().click();
  },
  completeCreateWorkspace() {
    this.el.inputByPlaceholder(TARGET_ELEMENT_TEXT.GiveWorkspaceName).focus().type('Yeet');
    // For some reason the backend validators doesn't like the format of the localhost image url
    // it doesn't get past the isURL() check which then causes the workspace creation to fail

    // this.uploadImage();
    // cy.get('div[size=120] > span').should('not.exist');
  },
  completeInvites(skip = false) {
    this.el.inputByPlaceholder(TARGET_ELEMENT_TEXT.InviteEmailExample).first().type(exampleEmail);

    if (skip) {
      cy.get('span').contains(TARGET_ELEMENT_TEXT.SkipInvites).click();
    } else {
      cy.get('div').contains(TARGET_ELEMENT_TEXT.SendInviteButton).click();
    }
  },
  enterCreditCard: () => {
    cy.fillElementsInput('cardNumber', '4242424242424242');
    cy.fillElementsInput('cardExpiry', '1025');
    cy.fillElementsInput('cardCvc', '123');
    cy.fillElementsInput('postalCode', '90210');
  },
  continueStep: () => {
    cy.get('div').contains(TARGET_ELEMENT_TEXT.ContinueButton).click();
  },
  selectWorkspace() {
    cy.get('div').contains('Select a Workspace').click();
    this.el.activeMenuItems.first().click();
  },

  assert: {
    planBubble: (planString = 'Free') => {
      cy.get(`.${DashboardClassName.PLAN_BUBBLE}`).contains(planString);
    },
    verifyEmailTitle: () => {
      cy.get(`#${Identifier.VERIFY_EMAIL_TITLE}`).contains('Verify your email');
    },
  },

  el: {
    inputByPlaceholder: (placeholder: string) => cy.get(`input[placeholder="${placeholder}"]`),

    get getStartedButton() {
      return cy.get('button').contains(TARGET_ELEMENT_TEXT.GetStartedButton);
    },

    get activeMenuItems() {
      return cy.get('.vf-menu li');
    },
  },

  page: {
    profile: {
      el: {
        modalityRadio: (index: number) => cy.get(`.${ClassName.RADIO_GROUP_ITEM}`).eq(index),

        get chatModalityRadio() {
          return this.modalityRadio(0);
        },
        get voiceModalityRadio() {
          return this.modalityRadio(1);
        },
        get bothModalitiesRadio() {
          return this.modalityRadio(2);
        },
      },
    },
  },

  meta: {
    route: '/onboarding',
  },
};
