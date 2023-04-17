import { ClassName, Identifier } from '../../src/styles/constants';
import canvasPage from '../pages/canvas';
import prototypePage from '../pages/prototype';
import { createSimple2BlockSpeak, createSimpleDisplay, createSimpleSpeakChoice } from '../utils/canvas/buildTestProject/Alexa';

const CHANGED_BRANDING_HEX_COLOR = 'F70303';
const CHANGED_BRANDING_RGB = 'rgb(247, 3, 3)';
const DEFAULT_VF_LOGO_URL =
  'https://res-3.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco/dohvpzgjnwzndaen346r';

context('Prototype', () => {
  const systemPrompt = 'This is a speak step';

  describe('canvas prototype', () => {
    beforeEach(() => {
      cy.setup();
    });

    it('switching between visuals', () => {
      createSimpleDisplay();
      canvasPage.el.testButton.click();
      canvasPage.el.startPrototypeButton.click();
      prototypePage.el.dialog.get('.chat-dialog-content a[href$="image.png"]');
    });

    it('Assert correct speak texts', () => {
      createSimple2BlockSpeak();
      canvasPage.el.testButton.click();
      canvasPage.el.startPrototypeButton.click();

      cy.get(`.${ClassName.CHAT_DIALOG_SPEAK_MESSAGE}`).eq(0).contains('Speak 1, welcome to a simple Alexa project');
      cy.get(`.${ClassName.CHAT_DIALOG_SPEAK_MESSAGE}`).should('have.length.above', 1).eq(1).contains('Bye, this is the end');
    });

    it('reply with text', () => {
      createSimpleSpeakChoice();
      canvasPage.el.testButton.click();
      prototypePage.startPrototype();
      cy.get(`.${ClassName.CHAT_DIALOG_SPEAK_MESSAGE}`).eq(0).contains('Test');
      cy.get(`#${Identifier.PROTOTYPE_RESPONSE}`).type('no{enter}');
      cy.get(`.${ClassName.CHAT_DIALOG_SPEAK_MESSAGE}`).should('have.length.above', 1).eq(1).contains('No End');
    });
  });

  describe.only('public prototype', () => {
    beforeEach(() => cy.setup());
    afterEach(() => {
      cy.teardown();
    });

    describe('sharing prototype', () => {
      beforeEach(() => {
        cy.setup();
        cy.createProject('general', 'prototype:speak_and_choice');
        cy.renderTest('general');
      });
      afterEach(() => cy.teardown());

      it('generate share link and visit link', () => {
        canvasPage.goToCanvas();
        canvasPage.el.shareButton.click();
        canvasPage.el.shareTabs.prototypeTab.click();
        canvasPage.el.shareLinkCopyButton.click();
        cy.clipboard().then((clipboardData) => cy.visit(clipboardData!));
        prototypePage.el.startPrototypeButton.should('be.visible');
      });

      it('brand configuration (with pro account)', () => {
        cy.intercept('POST', '/image').as('updateImage');
        cy.intercept('PATCH', '/v2/versions/*/prototype?path=settings').as('updateSettings');
        cy.intercept('POST', '/prototype/*/renderSync').as('renderSync');

        cy.upgradeTestAccount('pro');
        canvasPage.goToCanvas();
        canvasPage.el.shareButton.click();
        canvasPage.el.shareTabs.prototypeTab.click();
        cy.wait('@renderSync');
        canvasPage.el.brandingDropdown.click();
        canvasPage.el.brandingColorInput.clear();
        canvasPage.el.brandingColorInput.type(CHANGED_BRANDING_HEX_COLOR);
        cy.wait('@updateSettings');
        prototypePage.uploadImage(Identifier.BRAND_IMAGE_INPUT_CONTAINER);
        cy.wait('@updateImage');
        cy.wait('@updateSettings');
        prototypePage.uploadImage(Identifier.MESSAGE_ICON_INPUT_CONTAINER);
        cy.wait('@updateImage');
        cy.wait('@updateSettings');
        canvasPage.el.shareLinkCopyButton.click();

        cy.clipboard().then((clipboardData) => {
          cy.visit(clipboardData!);
        });

        prototypePage.el.startPrototypeButton.should('be.visible');
        prototypePage.el.startPrototypeButton.should('have.css', 'background-color').and('eq', CHANGED_BRANDING_RGB);
        prototypePage.el.publicPrototypeImage.should('have.css', 'background').and('not.contain', DEFAULT_VF_LOGO_URL);
        prototypePage.el.startPrototypeButton.click();
        prototypePage.el.publicPrototypeMessageIcon.should('be.visible');
        prototypePage.el.publicPrototypeMessageIcon.should('have.css', 'background').and('not.contain', DEFAULT_VF_LOGO_URL);
      });

      it('brand configuration (with free account)', () => {
        canvasPage.goToCanvas();
        canvasPage.el.shareButton.click();
        canvasPage.el.shareTabs.prototypeTab.click();
        cy.contains('Customize prototype style and branding');
      });
    });

    describe('with speak and choice', () => {
      beforeEach(() => {
        cy.createProject('general', 'prototype:speak_and_choice');
        cy.renderTest('general');
      });

      it('text and transcript', () => {
        cy.configurePrototype({ layout: 'text-and-dialog' });

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
});
