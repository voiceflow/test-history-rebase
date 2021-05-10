import prototypePage from '../pages/prototype';

context('Prototype', () => {
  const systemPrompt = 'This is a speak step';

  beforeEach(() => cy.setup());
  afterEach(() => cy.teardown());

  describe('with speak and choice', () => {
    beforeEach(() => {
      cy.createProject('general', 'prototype:speak_and_choice');
      cy.renderTest('general');
    });

    it('text and transcript', () => {
      prototypePage.goToPrototype();
      cy.shouldBeOn(prototypePage);

      prototypePage.el.startPrototypeButton.should('be.visible');

      // Highlight textbox and send with enter
      prototypePage.el.messageInput.parent().click();
      prototypePage.awaitMessage();
      prototypePage.el.systemResponse.should('have.text', systemPrompt);
      prototypePage.el.messageInput.type('yes{enter}');
      prototypePage.assertFinished();
      prototypePage.el.resetPrototypeButton.click();

      // Click start button and send with send button
      prototypePage.startPrototype();
      prototypePage.awaitMessage();
      prototypePage.el.systemResponse.should('have.text', systemPrompt);
      prototypePage.el.messageInput.type('yes');
      prototypePage.el.submitMessageInputButton.click();
      prototypePage.assertFinished();
      prototypePage.el.resetPrototypeButton.click();

      // Use chips
      prototypePage.startPrototype();
      prototypePage.awaitMessage();
      prototypePage.el.systemResponse.should('have.text', systemPrompt);
      prototypePage.el.chips.should('have.length', 1).click();
      prototypePage.assertFinished();
      prototypePage.el.resetPrototypeButton.click();

      // Reset button in the middle of a conversation
      prototypePage.startPrototype();
      prototypePage.awaitMessage();
      prototypePage.el.systemResponse.should('have.text', systemPrompt);
      prototypePage.el.resetPrototypeButton.click();
    });

    it('voice and transcript', () => {
      cy.configurePrototype({ layout: 'voice-and-dialog' });

      prototypePage.goToPrototype();
      cy.shouldBeOn(prototypePage);

      prototypePage.el.startPrototypeButton.should('be.visible');

      prototypePage.startPrototype();
      prototypePage.awaitMessage();
      prototypePage.el.systemResponse.should('have.text', systemPrompt);
      // TODO: fix this assertion, it fails on circleci for some reason
      // prototypePage.el.voiceInput.contains('Hold spacebar for Voice Input').should('be.visible');
    });
  });

  describe('with visuals', () => {
    beforeEach(() => {
      cy.createProject('general', 'prototype:visual');
      cy.renderTest('general');
      cy.configurePrototype({ layout: 'voice-and-visuals' });
      prototypePage.goToPrototype();
    });

    it('voice and visuals', () => {
      prototypePage.el.startPrototypeButton.should('be.visible');

      prototypePage.startPrototype();
      prototypePage.el.visualImage.should('be.visible');
      // TODO: fix this assertion, it fails on circleci for some reason
      // prototypePage.el.voiceInput.contains('Hold spacebar for Voice Input').should('be.visible');
    });
  });

  describe('unauthenticated', () => {
    beforeEach(() => {
      cy.createProject('general', 'prototype:speak_and_choice');
      cy.renderTest('general');
      cy.clearAuth();
      prototypePage.goToPrototype();
    });

    it('able to open prototype tool when signed out', () => {
      cy.shouldBeOn(prototypePage);
      prototypePage.el.startPrototypeButton.should('be.visible');
    });
  });
});
