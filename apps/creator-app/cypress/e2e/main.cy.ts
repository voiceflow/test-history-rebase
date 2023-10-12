import { TEST_EMAIL, TEST_PASSWORD } from '../config';
import loginPage from '../pages/login';
import newWorkspacePage from '../pages/newWorkspace';
import onboardingPage from '../pages/onboarding';
import signupPage from '../pages/signup';

context('Main', () => {
  it('go to signup page when logged out', () => {
    cy.visit('/');

    cy.shouldBeOn(signupPage);
  });

  describe('signup page', () => {
    beforeEach(() => cy.visit('/signup'));

    it('show option to login', () => {
      signupPage.el.loginPrompt.click();

      cy.shouldBeOn(loginPage);
    });

    it('show social signup options', () => {
      signupPage.el.socialLogin.first().scrollIntoView();
      signupPage.el.googleLogin.should('be.visible');
      signupPage.el.facebookLogin.should('be.visible');
    });
  });

  describe('login page', () => {
    beforeEach(() => cy.visit('/login'));

    it('show option to signup', () => {
      loginPage.el.signupPrompt.click();

      cy.shouldBeOn(signupPage);
    });

    it('show social signup options', () => {
      loginPage.el.googleLogin.should('be.visible');
      loginPage.el.facebookLogin.should('be.visible');
    });
  });

  describe.skip('authentication', () => {
    beforeEach(() => cy.removeTestAccount());
    afterEach(() => cy.removeTestAccount());

    // skipping because identity has been enabled for public clouds, email link verification should be good
    it.skip('signup', () => {
      cy.signup();

      onboardingPage.assert.verifyEmailTitle();
      cy.shouldBeOn(onboardingPage);

      cy.verifyEmail();

      cy.shouldBeOn(onboardingPage);
      onboardingPage.el.getStartedButton.click();
    });

    it('login', () => {
      cy.createTestAccount();
      cy.setVerified();

      cy.visit('/login');

      loginPage.setEmail(TEST_EMAIL);
      loginPage.setPassword(TEST_PASSWORD);

      loginPage.submit();

      cy.shouldBeOn(newWorkspacePage);
    });
  });
});
