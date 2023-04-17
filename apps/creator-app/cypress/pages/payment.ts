import { ClassName as UIClassName } from '@voiceflow/ui';

import { ClassName, DashboardClassName, Identifier } from '../../src/styles/constants';

const paymentHelper = {
  fillCreditCard: () => {
    cy.fillElementsInput('cardNumber', '4242424242424242');
    cy.fillElementsInput('cardExpiry', '1025');
    cy.fillElementsInput('cardCvc', '123');
    cy.fillElementsInput('postalCode', '90210');
  },
  waitForUpdatedPrice: () => {
    cy.get(`#${Identifier.PAYMENT_MODAL_UNIT_COST_CONTAINER}`).contains(/^\d+$/);
  },
  changeToMonthlyPayments: () => {
    cy.get(`#${Identifier.PAYMENT_MODAL_BILLING_CYCLE_DROPDOWN}`).click();
    cy.get(`.${ClassName.MENU}`).get('li').contains('Monthly').click();
  },
  openPaymentModal: () => {
    cy.get(`#${Identifier.UPGRADE_BUTTON}`).click();
  },
  confirmUpgrade: () => {
    cy.get(`#${Identifier.PAYMENT_UPGRADE_BUTTON}`).click();
  },
  changeAndCheckPeriodPrice: () => {
    let originalUnitPrice: number;
    let finalUnitPrice: number;
    paymentHelper.waitForUpdatedPrice();

    cy.get(`#${Identifier.PAYMENT_MODAL_UNIT_COST_CONTAINER}`)
      .then(($el) => {
        originalUnitPrice = parseInt($el.text(), 10);
      })
      .then(() => {
        cy.get(`#${Identifier.PAYMENT_MODAL_BILLING_CYCLE_DROPDOWN}`).click();
        cy.get(`.${ClassName.MENU}`).get('li').contains('Monthly').click();

        paymentHelper.waitForUpdatedPrice();
      })
      .then(($el) => {
        finalUnitPrice = parseInt($el.text(), 10);
        expect(finalUnitPrice).to.be.greaterThan(originalUnitPrice);
      });
  },
  setup: () => {
    cy.setup();
    cy.createWorkspace();
    cy.visit('/dashboard');
    cy.get(`.${DashboardClassName.PLAN_BUBBLE}`).contains('Free');
  },
  checkAndCloseSuccessModal: () => {
    cy.get(`.${UIClassName.MODAL_TITLE_CONTAINER}`).contains('Payment Successful');
    cy.get(`.${UIClassName.MODAL_CLOSE_BUTTON_REGULAR}`).click();
    cy.get(`.${DashboardClassName.PLAN_BUBBLE}`).contains('Pro');
  },
  increaseEditors: (numEditors = '12') => {
    cy.get(`#${Identifier.PAYMENT_SEATS_INPUT}`).clear().type(numEditors);
  },
  assertPaymentModal: () => {
    cy.get(`#${Identifier.UPGRADE_PLAN_SECTION}`).should('be.visible');
  },
  waitForCustomPrice: () => {
    cy.get(`#${Identifier.PAYMENT_MODAL_UNIT_COST_CONTAINER}`).contains('Custom');
  },
  checkButtonText: () => {
    cy.get(`#${Identifier.PAYMENT_UPGRADE_BUTTON}`).contains('Upgrade to Enterprise');
  },
};

export default {
  ...paymentHelper,
  el: {},
};
