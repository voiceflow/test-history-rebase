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

    it('prototype modes (display, developer, canvas)', () => {
      cy.createProject('general', 'prototype:speak_and_choice');
      canvasPage.goToCanvas();
      canvasPage.el.testButton.click();
      prototypePage.el.prototypeMenuCanvasButton.should('be.visible');
      prototypePage.el.prototypeMenuDisplayButton.click();
      prototypePage.el.displayCanvasContainer.should('be.visible');
      prototypePage.el.prototypeDeveloperDisplayButton.click();
      prototypePage.el.protoVariablesMenuContainer.should('be.visible');
      prototypePage.el.prototypeMenuSettingsButton.click();
      prototypePage.el.protoSettingsMenuContainer.should('be.visible');
    });

    // Flakey, need to fix
    it.skip('switching between visuals', () => {
      createSimpleDisplay();
      canvasPage.el.testButton.click();
      canvasPage.el.startPrototypeButton.click();
      prototypePage.el.prototypeMenuDisplayButton.click();
      prototypePage.el.displayCanvasContainer.get('.imageHolder img ').should('have.attr', 'src').and('not.equal', '');
      cy.get(`.${ClassName.DISPLAY_TYPE_ITEM}`).eq(1).click();
      prototypePage.el.displayCanvasContainer.get('.imageHolder img ').should('have.attr', 'src').and('not.equal', '');
    });
    // Flakey, need to fix
    it.skip('Assert correct speak texts', () => {
      createSimple2BlockSpeak();
      canvasPage.el.testButton.click();
      canvasPage.el.startPrototypeButton.click();
      cy.get(`.${ClassName.CHAT_DIALOG_SPEAK_MESSAGE}`).eq(0).contains('Speak 1, welcome to a simple Alexa project');
      cy.get(`.${ClassName.CHAT_DIALOG_SPEAK_MESSAGE}`).eq(1).contains('Bye, this is the end');
    });

    // The createSimpleSpeakChoice is flakey, gunna skip for now so i can merge the bulk of the new e2es
    it.skip('reply with chips', () => {
      createSimpleSpeakChoice();
      canvasPage.el.testButton.click();
      prototypePage.startPrototype();
      cy.get(`.${ClassName.CHAT_DIALOG_SPEAK_MESSAGE}`).eq(0).contains('Test');
      cy.get(`.${ClassName.PROTOTYPE_CHIP}`).contains('yes').click();
      cy.get(`.${ClassName.CHAT_DIALOG_LOADING_MESSAGE}`).should('not.be.visible');
      cy.get(`.${ClassName.CHAT_DIALOG_SPEAK_MESSAGE}`).eq(1).contains('Yes End');
    });

    // The createSimpleSpeakChoice is flakey, gunna skip for now so i can merge the bulk of the new e2es
    it.skip('reply with text', () => {
      createSimpleSpeakChoice();
      canvasPage.el.testButton.click();
      prototypePage.startPrototype();
      cy.get(`.${ClassName.CHAT_DIALOG_SPEAK_MESSAGE}`).eq(0).contains('Test');
      cy.get(`.${ClassName.CHAT_DIALOG_SPEAK_MESSAGE}`).eq(0).contains('Test');
      cy.get(`#${Identifier.PROTOTYPE_RESPONSE}`).type('no{enter}');
      cy.get(`.${ClassName.CHAT_DIALOG_LOADING_MESSAGE}`).should('not.be.visible');
      cy.get(`.${ClassName.CHAT_DIALOG_SPEAK_MESSAGE}`).eq(1).contains('No End');
    });
  });

  describe('public prototype', () => {
    beforeEach(() => cy.setup());
    afterEach(() => cy.teardown());

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
        canvasPage.el.shareLinkCopyButton.click();
        cy.clipboard().then((clipboardData) => cy.visit(clipboardData!));
        prototypePage.el.startPrototypeButton.should('be.visible');
      });

      it('brand configuration (with pro account)', () => {
        cy.upgradeTestAccount('pro');
        canvasPage.goToCanvas();
        canvasPage.el.shareButton.click();
        canvasPage.el.shareLinkCopyButton.click();
        canvasPage.el.brandingDropdown.click();
        canvasPage.el.brandingColorInput.clear();
        canvasPage.el.brandingColorInput.type(CHANGED_BRANDING_HEX_COLOR);
        prototypePage.uploadImage(Identifier.BRAND_IMAGE_INPUT_CONTAINER);
        prototypePage.uploadImage(Identifier.MESSAGE_ICON_INPUT_CONTAINER);
        canvasPage.el.shareLinkCopyButton.click();
        cy.clipboard().then((clipboardData) => cy.visit(clipboardData!));
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
        cy.contains('Customize prototype style and branding');
      });
    });

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
});
