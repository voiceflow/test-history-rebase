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

    it('Alexa project', () => {
      regularFlow();
    });

    it('Google project', () => {
      regularFlow('Google Assistant');
    });

    it('Voice Assistant project', () => {
      regularFlow('Voice Assistant');
    });

    it('Chat Assistant project', () => {
      regularFlow('Chat Assistant');
    });

    // do not have IVR and mobile projects
    it.skip('Mobile App project', () => {
      regularFlow('Mobile App');
    });

    it.skip('IVR project', () => {
      regularFlow('IVR');
    });
  });

  describe('Student promo plan', () => {
    beforeEach(() => cy.removeTestAccount());

    it('new user', () => {
      const queryParam = '?promo=student';
      cy.signup(queryParam);
      onboarding.assert.verifyEmailTitle();
      cy.verifyEmail(queryParam);

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
      const queryParam = '?ob_payment=true&ob_plan=creator&ob_period=MO';
      cy.signup(queryParam);
      onboarding.assert.verifyEmailTitle();
      cy.verifyEmail(queryParam);

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
