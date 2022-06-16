import dashboard from '../pages/dashboard';
import projectCreationPage, { helper } from '../pages/projectCreation';

context.skip('Project Creation Flow', () => {
  beforeEach(() => {
    cy.setup();
    cy.createWorkspace();
  });
  afterEach(() => cy.teardown());

  describe('All Platforms - Happy Path', () => {
    it('Alexa - English', () => {
      projectCreationPage.createProject('Alexa');
      helper.getHomeStep().should('have.text', `Alexa, open Untitled`);
    });

    it('Google - English', () => {
      projectCreationPage.createProject('Google');
      helper.getHomeStep().should('have.text', `Hey Google, start Untitled`);
    });

    it('Voice Assistant - English', () => {
      projectCreationPage.createProject('Voice Assistant');
      helper.getHomeStep().should('have.text', `Project starts here`);
    });

    it('Chat Assistant - English', () => {
      projectCreationPage.createProject('Chat Assistant');
      helper.getHomeStep().should('have.text', `Project starts here`);
    });

    it.skip('IVR - English', () => {
      projectCreationPage.createProject('IVR');
      helper.getHomeStep().should('have.text', `Project starts here`);
    });

    it.skip('Mobile App - English', () => {
      projectCreationPage.createProject('Mobile App');
      helper.getHomeStep().should('have.text', `Project starts here`);
    });
  });

  describe('Change Language', () => {
    it('Alexa - Spanish', () => {
      projectCreationPage.createProject('Alexa', 'Spanish');
      helper.getHomeStep().should('have.text', `Alexa, open Untitled`);
    });
  });

  describe('Change Invocation Name', () => {
    it('Alexa - Invocation Name', () => {
      const CUSTOM_INVOCATION_NAME = 'Custom Invocation';
      projectCreationPage.createProject('Alexa', undefined, CUSTOM_INVOCATION_NAME);
      helper.getHomeStep().should('have.text', `Alexa, open ${CUSTOM_INVOCATION_NAME}`);
    });
  });

  describe('Project Creation Navigation', () => {
    it('Step Back', () => {
      cy.visit('/');
      helper.clickProjectCreateButton();
      helper.completePlatformSelect('Google');
      helper.goBackStep();
      helper.el.projectCreationStepTitle.should('have.text', 'Project Type');
    });

    it('Cancel', () => {
      cy.visit('/');
      helper.clickProjectCreateButton();
      helper.cancelFlow();
      dashboard.el.workspaceDropdownButton.should('be.visible');
    });
  });
});
