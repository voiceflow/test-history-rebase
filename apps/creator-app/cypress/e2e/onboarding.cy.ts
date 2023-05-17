import canvasPage from '../pages/canvas';
import dashboard from '../pages/dashboard';
import onboarding from '../pages/onboarding';

context('Onboarding', () => {
  const completeBasicOnboarding = () => {
    cy.shouldBeOn(onboarding);
    onboarding.el.getStartedButton.click();
    onboarding.completeProfile();
    onboarding.continueStep();
    onboarding.completeCreateWorkspace();
    onboarding.continueStep();
    onboarding.completeInvites();
  };

  describe.skip('regular new user flow', () => {
    it('add a new project from scratch', () => {
      cy.setup();

      cy.visit(onboarding.meta.route);
      completeBasicOnboarding();
      cy.shouldBeOn(canvasPage);
    });
  });

  describe.skip('Student promo plan', () => {
    beforeEach(() => cy.removeTestAccount());

    it('new user', () => {
      const queryParam = '?promo=student';
      cy.signup(queryParam);
      onboarding.assert.verifyEmailTitle();
      cy.verifyEmail(queryParam);

      completeBasicOnboarding();
      onboarding.enterCreditCard();
      cy.get('button.vf-button').click();
      cy.shouldBeOn(canvasPage);
    });

    it('existing user', () => {
      cy.setup();
      cy.createProject();
      cy.visit(`/onboarding?promo=student`);
      onboarding.completeInvites();
      onboarding.enterCreditCard();
      onboarding.selectWorkspace();
      cy.get('button.vf-button').click();

      cy.shouldBeOn(dashboard);
      onboarding.assert.planBubble('Student');
    });
  });

  describe('Creator promo plan', () => {
    beforeEach(() => cy.removeTestAccount());

    // it('new user creator signup flow', () => {
    //   const queryParam = '?ob_payment=true&ob_plan=creator&ob_period=MO';
    //   cy.signup(queryParam);
    //   onboarding.assert.verifyEmailTitle();
    //   cy.verifyEmail(queryParam);

    //   completeBasicOnboarding();
    //   onboarding.enterCreditCard();
    //   cy.get('button.vf-button').click();
    //   cy.shouldBeOn(canvasPage);
    //   cy.visit(`/dashboard`);
    //   onboarding.assert.planBubble('Creator');
    // });

    // TODO: sometimes on circle ci, (maybe on local too but havent ran into it) this test fails with a timeout, should look into a fix so we can get this test case back
    it.skip('existing user creator signup flow', () => {
      cy.signup();
      onboarding.assert.verifyEmailTitle();
      cy.verifyEmail();

      cy.visit('?ob_payment=true&ob_plan=creator&ob_period=MO');

      completeBasicOnboarding();
      onboarding.enterCreditCard();
      cy.get('button.vf-button').click();
      cy.shouldBeOn(canvasPage);
      cy.visit(`/dashboard`);
      onboarding.assert.planBubble('Creator');
    });
  });
});
