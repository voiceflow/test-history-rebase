import accountPage from '../pages/account';

const profileTab = accountPage.tab.profile;
const integrationsTab = accountPage.tab.integrations;

context.skip('Account', () => {
  beforeEach(() => {
    cy.setup();
  });
  afterEach(() => cy.teardown());

  it('navigates account page', () => {
    cy.visit('/account');
    cy.shouldBeOn(profileTab);

    profileTab.el.nameInput.should('have.value', 'Test Account');
    profileTab.el.emailInput.should('have.value', 'account.cy.ts@voiceflow.com');

    accountPage.el.integrationsTab.click();
    cy.shouldBeOn(integrationsTab);

    integrationsTab.el.alexaConnectButton.should('have.text', 'Connect');
    integrationsTab.el.googleConnectButton.should('have.text', 'Connect');

    accountPage.el.profileTab.click();
    cy.shouldBeOn(profileTab);
  });
});
