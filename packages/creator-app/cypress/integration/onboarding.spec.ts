import canvasPage from '../pages/canvas';
import dashboard from '../pages/dashboard';
import onboarding from '../pages/onboarding';

context('Onboarding', () => {
  const regularFlow = (projectType?: string) => {
    cy.signup();
    onboarding.assert.verifyEmailTitle();
    cy.verifyEmail();

    cy.shouldBeOn(onboarding);
    onboarding.el.getStartedButton.click();
    onboarding.completeProfile();
    onboarding.continueStep();
    onboarding.completeCreateWorkspace();
    onboarding.continueStep();
    onboarding.completeInvites();
    onboarding.completeSelectChannel(projectType);
    cy.shouldBeOn(canvasPage);
  };

  describe('regular new user flow', () => {
    beforeEach(() => cy.removeTestAccount());

    it('alexa project', () => {
      regularFlow();
    });

    it('google project', () => {
      regularFlow('Google Assistant');
    });

    it('general project', () => {
      regularFlow('Custom Assistant');
    });

    it('chatbot project', () => {
      regularFlow('Chatbot');
    });

    it('Mobile App project', () => {
      regularFlow('Mobile App');
    });

    it('IVR project', () => {
      regularFlow('IVR');
    });
  });

  describe('Student promo plan', () => {
    beforeEach(() => cy.removeTestAccount());

    it('new user', () => {
      cy.signup('?promo=student');
      onboarding.assert.verifyEmailTitle();
      cy.verifyEmail();

      cy.shouldBeOn(onboarding);
      onboarding.el.getStartedButton.click();
      onboarding.completeProfile();
      onboarding.continueStep();
      onboarding.completeCreateWorkspace();
      onboarding.continueStep();
      onboarding.completeInvites();
      onboarding.completeSelectChannel();
      onboarding.enterCreditCard();
      cy.get('button.vf-button').click();
      cy.shouldBeOn(canvasPage);
    });

    it('existing user', () => {
      regularFlow();
      cy.visit(`/onboarding?promo=student`);
      onboarding.completeInvites();
      onboarding.completeSelectChannel();
      onboarding.enterCreditCard();
      onboarding.selectWorkspace();
      cy.get('button.vf-button').click();

      cy.shouldBeOn(dashboard);
      onboarding.assert.planBubble('Student');
    });
  });

  describe('Creator promo plan', () => {
    beforeEach(() => cy.removeTestAccount());

    it('new user creator signup flow', () => {
      cy.signup('?ob_payment=true&ob_plan=creator&ob_period=MO');
      onboarding.assert.verifyEmailTitle();
      cy.verifyEmail();

      cy.shouldBeOn(onboarding);
      onboarding.el.getStartedButton.click();
      onboarding.completeProfile();
      onboarding.continueStep();
      onboarding.completeCreateWorkspace();
      onboarding.continueStep();
      onboarding.completeInvites();
      onboarding.completeSelectChannel();
      onboarding.enterCreditCard();
      cy.get('button.vf-button').click();
      cy.shouldBeOn(canvasPage);
      cy.visit(`/dashboard`);
      onboarding.assert.planBubble('Creator');
    });

    // TODO: sometimes on circle ci, (maybe on local too but havent ran into it) this test fails with a timeout, should look into a fix so we can get this test case back
    it.skip('existing user creator signup flow', () => {
      cy.signup();
      onboarding.assert.verifyEmailTitle();
      cy.verifyEmail();

      cy.visit('?ob_payment=true&ob_plan=creator&ob_period=MO');

      cy.shouldBeOn(onboarding);
      onboarding.el.getStartedButton.click();
      onboarding.completeProfile();
      onboarding.continueStep();
      onboarding.completeCreateWorkspace();
      onboarding.continueStep();
      onboarding.completeInvites();
      onboarding.completeSelectChannel();
      onboarding.enterCreditCard();
      cy.get('button.vf-button').click();
      cy.shouldBeOn(canvasPage);
      cy.visit(`/dashboard`);
      onboarding.assert.planBubble('Creator');
    });
  });
});
