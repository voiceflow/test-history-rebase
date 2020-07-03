import canvasPage from '../pages/canvas';
import onboardingPage from '../pages/onboarding';

// TODO: redo with new onboarding
context('Onboarding', () => {
  beforeEach(() => cy.removeTestAccount());
  afterEach(() => cy.removeTestAccount());

  it.skip('hobbyist', () => {
    cy.signup();

    cy.shouldBeOn(onboardingPage);

    onboardingPage.el.greeting.should('have.text', 'Hi, Test Account');

    onboardingPage.continue();

    onboardingPage.el.soloProjectButton.click();

    onboardingPage.continue();

    onboardingPage.el.buildAndPublishButton.click();

    onboardingPage.continue();

    onboardingPage.el.highExperienceButton.click();

    onboardingPage.continue();

    cy.shouldBeOn(canvasPage);

    canvasPage.el.projectTitle.should('have.value', 'My First Project');
  });

  it.skip('professional', () => {
    cy.signup();

    cy.shouldBeOn(onboardingPage);

    onboardingPage.el.greeting.should('have.text', 'Hi, Test Account');

    onboardingPage.continue();

    onboardingPage.el.teamProjectButton.click();

    onboardingPage.continue();

    onboardingPage.setCompanyName('storyflow');

    onboardingPage.selectRole('Developer');

    onboardingPage.setCompanySize(3);

    onboardingPage.continue();

    cy.shouldBeOn(canvasPage);

    canvasPage.el.projectTitle.should('have.value', 'My First Project');
  });
});
