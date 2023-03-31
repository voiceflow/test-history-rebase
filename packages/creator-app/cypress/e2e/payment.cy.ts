import collaboratorHelper from '../pages/collaboration';
import paymentHelper from '../pages/payment';

context.skip('Payment and Collaborators', () => {
  beforeEach(() => cy.removeTestAccount());

  describe('dashboard upgrade payment', () => {
    it.skip('free to pro yearly', () => {
      paymentHelper.setup();
      paymentHelper.openPaymentModal();
      paymentHelper.fillCreditCard();
      paymentHelper.confirmUpgrade();
      paymentHelper.checkAndCloseSuccessModal();
    });

    it.skip('free to pro monthly', () => {
      paymentHelper.setup();
      paymentHelper.openPaymentModal();
      paymentHelper.changeAndCheckPeriodPrice();

      paymentHelper.fillCreditCard();
      paymentHelper.confirmUpgrade();
      paymentHelper.checkAndCloseSuccessModal();
    });

    it.skip('multiple seats (2) upgrade (Yearly)', () => {
      paymentHelper.setup();
      paymentHelper.openPaymentModal();
      paymentHelper.increaseEditors('2');
      paymentHelper.fillCreditCard();
      paymentHelper.confirmUpgrade();
      paymentHelper.checkAndCloseSuccessModal();
    });

    it('multiple seats (12) upgrade (Yearly)', () => {
      paymentHelper.setup();
      paymentHelper.openPaymentModal();
      paymentHelper.increaseEditors();
      paymentHelper.checkButtonText();
    });

    it.skip('multiple seats (2) upgrade (Monthly)', () => {
      paymentHelper.setup();
      paymentHelper.openPaymentModal();
      paymentHelper.changeToMonthlyPayments();
      paymentHelper.increaseEditors('2');
      paymentHelper.fillCreditCard();
      paymentHelper.confirmUpgrade();
      paymentHelper.checkAndCloseSuccessModal();
    });
  });

  describe.skip('collaborators', () => {
    const testInviteEmail = 'yeet@voiceflow.com';
    const testInviteEmail2 = 'yee2t@voiceflow.com';
    const memberRoleDropdownCanEditString = 'Editor';
    const memberRoleDropdownCanViewString = 'Viewer';

    it('free plan, invite by email, editor', () => {
      collaboratorHelper.setup();
      collaboratorHelper.openCollabModal();
      collaboratorHelper.sendEmailInvite(testInviteEmail);
      collaboratorHelper.assertInvite(testInviteEmail, memberRoleDropdownCanEditString);
    });

    it('free plan, invite by email, viewer', () => {
      collaboratorHelper.setup();
      collaboratorHelper.openCollabModal();
      collaboratorHelper.setInviteEmailToViewer();
      collaboratorHelper.sendEmailInvite(testInviteEmail);
      collaboratorHelper.assertInvite(testInviteEmail, memberRoleDropdownCanViewString);
    });

    it('free plan, invite by email, viewer and editor', () => {
      collaboratorHelper.setup();
      collaboratorHelper.openCollabModal();
      // Editor
      collaboratorHelper.sendEmailInvite(testInviteEmail);
      collaboratorHelper.assertInvite(testInviteEmail, memberRoleDropdownCanEditString);

      // Viewer
      collaboratorHelper.setInviteEmailToViewer();
      collaboratorHelper.sendEmailInvite(testInviteEmail2);
      collaboratorHelper.assertInvite(testInviteEmail2, memberRoleDropdownCanViewString);
    });

    it('copy share link', () => {
      collaboratorHelper.setup();
      collaboratorHelper.openCollabModal();
      collaboratorHelper.clickSaveShareLink();
      collaboratorHelper.assertSuccessToast();
    });

    it('upgrade to pro with 1 seat and invite editor', () => {
      paymentHelper.setup();
      paymentHelper.openPaymentModal();
      paymentHelper.fillCreditCard();
      paymentHelper.confirmUpgrade();
      paymentHelper.checkAndCloseSuccessModal();
      collaboratorHelper.openCollabModal();
      collaboratorHelper.sendEmailInvite(testInviteEmail);
      paymentHelper.assertPaymentModal();
    });

    it('upgrade to pro with multiple seats and invite editor', () => {
      paymentHelper.setup();
      paymentHelper.openPaymentModal();
      paymentHelper.increaseEditors('3');
      paymentHelper.fillCreditCard();
      paymentHelper.confirmUpgrade();
      paymentHelper.checkAndCloseSuccessModal();
      collaboratorHelper.openCollabModal();
      collaboratorHelper.sendEmailInvite(testInviteEmail);
      collaboratorHelper.assertInvite(testInviteEmail, memberRoleDropdownCanEditString);
    });
  });
});
