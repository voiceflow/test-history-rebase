import projectCreate from '../pages/projectCreation';

context.skip('Project Creation Flow', () => {
  beforeEach(() => {
    cy.setup();
    cy.createWorkspace();
  });
  afterEach(() => cy.teardown());

  describe('All Platforms - Happy Path', () => {
    it('Alexa - English', () => {
      projectCreate.createProject('Amazon Alexa', { invocationName: 'happy path' });
    });

    it('Google - English', () => {
      projectCreate.createProject('Google Assistant', { invocationName: 'happy path' });
    });

    it('Voice Assistant - English', () => {
      projectCreate.createProject('Voice Assistant', { nlu: 'Voiceflow' });
    });

    it('Chat Assistant - English', () => {
      projectCreate.createProject('Chat Assistant', { nlu: 'Voiceflow' });
    });
  });

  describe('Change Language', () => {
    it('Alexa - Spanish', () => {
      projectCreate.createProject('Amazon Alexa', { invocationName: 'spanish path', locale: 'Spanish' });
    });
  });
});
