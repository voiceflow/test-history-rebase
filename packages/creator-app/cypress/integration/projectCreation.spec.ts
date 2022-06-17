import projectCreate from '../pages/projectCreation';

context('Project Creation Flow', () => {
  beforeEach(() => {
    cy.setup();
    cy.createWorkspace();
  });
  afterEach(() => cy.teardown());

  describe('All Platforms - Happy Path', () => {
    it('Alexa - English', () => {
      projectCreate.createProject('Amazon Alexa', { invocationName: 'happy path' });
      projectCreate.el.homeStep.should('have.text', 'Alexa, open happy path');
    });

    it('Google - English', () => {
      projectCreate.createProject('Google Assistant', { invocationName: 'happy path' });
      projectCreate.el.homeStep.should('have.text', 'Hey Google, start happy path');
    });

    it('Voice Assistant - English', () => {
      projectCreate.createProject('Voice Assistant', { nlu: 'Voiceflow' });
      projectCreate.el.homeStep.should('have.text', 'Project starts here');
    });

    it('Chat Assistant - English', () => {
      projectCreate.createProject('Chat Assistant', { nlu: 'Voiceflow' });
      projectCreate.el.homeStep.should('have.text', 'Project starts here');
    });
  });

  describe('Change Language', () => {
    it('Alexa - Spanish', () => {
      projectCreate.createProject('Amazon Alexa', { invocationName: 'spanish path', locale: 'Spanish' });
      projectCreate.el.homeStep.should('have.text', 'Alexa, open spanish path');
    });
  });
});
