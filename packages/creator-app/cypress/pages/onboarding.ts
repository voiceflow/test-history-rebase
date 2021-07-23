import { DashboardClassName, Identifier } from '../../src/styles/constants';

const TARGET_ELEMENT_TEXT = {
  RoleDropdown: 'Select your role',
  ChannelDropdown: 'Choose all that apply',
  OnlyMeButton: 'Only Me',
  ContinueButton: 'Continue',
  GetStartedButton: 'Get Started',
  GiveWorkspaceName: 'Give your workspace a name',
  InviteEmailExample: 'name@example.com',
  SendInviteButton: 'Send Invites',
  SkipInvites: 'Skip for now',
};

const exampleEmail = 'yeet@voiceflow.com';

const helper = {
  getInputByPlaceholder: (placeholder: string) => cy.get(`input[placeholder="${placeholder}"]`),
  getDivByText: (text: string) => cy.get('div')?.contains(text),
  getSpanByText: (text: string) => cy.get('span')?.contains(text),
  getButtonByText: (text: string) => cy.get('div')?.contains(text),

  uploadImage: () => {
    cy.get('input[type="file"]').attachFile({
      filePath: 'image.png',
    });
  },

  el: {
    get getStartedButton() {
      return cy.get('button').contains(TARGET_ELEMENT_TEXT.GetStartedButton);
    },

    get activeDropdown() {
      return cy.get('.vf-menu');
    },
  },
};

export default {
  completeProfile: () => {
    helper.getInputByPlaceholder(TARGET_ELEMENT_TEXT.RoleDropdown).parent().click();
    helper.el.activeDropdown.get('li').first().click();
    helper.getDivByText(TARGET_ELEMENT_TEXT.ChannelDropdown).parent().click();
    helper.el.activeDropdown.get('li').first().click();
    helper.getDivByText('Amazon Alexa').click();
    helper.getDivByText(TARGET_ELEMENT_TEXT.OnlyMeButton).click();
  },
  completeCreateWorkspace: () => {
    helper.getInputByPlaceholder(TARGET_ELEMENT_TEXT.GiveWorkspaceName).focus().type('Yeet');
    // For some reason the backend validators doesn't like the format of the localhost image url
    // it doesn't get past the isURL() check which then causes the workspace creation to fail

    // helper.uploadImage();
    // cy.get('div[size=120] > span').should('not.exist');
  },
  completeInvites: (skip = false) => {
    helper.getInputByPlaceholder(TARGET_ELEMENT_TEXT.InviteEmailExample).first().type(exampleEmail);
    skip ? helper.getSpanByText(TARGET_ELEMENT_TEXT.SkipInvites).click() : helper.getButtonByText(TARGET_ELEMENT_TEXT.SendInviteButton).click();
  },
  completeSelectChannel: (channel = 'Amazon Alexa') => {
    helper.getDivByText(channel).click();
  },
  enterCreditCard: () => {
    cy.fillElementsInput('cardNumber', '4242424242424242');
    cy.fillElementsInput('cardExpiry', '1025');
    cy.fillElementsInput('cardCvc', '123');
    cy.fillElementsInput('postalCode', '90210');
  },
  continueStep: () => {
    helper.getButtonByText(TARGET_ELEMENT_TEXT.ContinueButton).click();
  },
  selectWorkspace: () => {
    helper.getDivByText('Select a Workspace').click();
    helper.el.activeDropdown.get('li').first().click();
  },
  assert: {
    planBubble: (planString = 'Free') => {
      cy.get(`.${DashboardClassName.PLAN_BUBBLE}`).contains(planString);
    },
    verifyEmailTitle: () => {
      cy.get(`#${Identifier.VERIFY_EMAIL_TITLE}`).contains('Verify your email');
    },
  },
  el: helper.el,

  meta: {
    route: '/onboarding',
  },
};
