import canvasPage from '../../pages/canvas';
import markupModal from '../../pages/modals/markup';

const markupMode = canvasPage.mode.markup;

context('Canvas - Markup', () => {
  beforeEach(() => cy.setup());
  afterEach(() => cy.teardown());

  describe('starter plan', () => {
    beforeEach(() => {
      cy.createProject();
      canvasPage.goToCanvas();
    });

    it('show upgrade modal if starter', () => {
      canvasPage.el.markupModeControl.click();

      markupModal.el.root.should('be.visible');
    });
  });

  describe('pro plan navigate', () => {
    beforeEach(() => {
      cy.server();
      cy.createProject();
      cy.upgradeTestAccount('pro');
      canvasPage.route.postDiagram().as('loadDiagram');
    });

    it('enter mode with controls', () => {
      canvasPage.goToCanvas();
      cy.wait('@loadDiagram');

      canvasPage.el.markupModeControl.click();

      cy.shouldBeOn(markupMode);
    });

    it('enter mode with hotkey', () => {
      canvasPage.goToCanvas();
      cy.wait('@loadDiagram');

      cy.sendHotkey('a');

      cy.shouldBeOn(markupMode);
    });

    it('navigate with URL', () => {
      markupMode.goToCanvas();
      cy.wait('@loadDiagram');

      cy.shouldBeOn(markupMode);
      canvasPage.el.escapeModePrompt.should('be.visible').and('have.text', 'esc to exit markup');
      canvasPage.el.markupModeControl.find('.vf-svg-icon--close').should('be.visible');
    });
  });

  describe('markup mode', () => {
    // eslint-disable-next-line sonarjs/no-identical-functions
    beforeEach(() => {
      cy.server();
      cy.createProject();
      cy.upgradeTestAccount('pro');
      canvasPage.route.postDiagram().as('loadDiagram');
    });

    it('create new text markup', () => {
      markupMode.goToCanvas();
      cy.wait('@loadDiagram');

      markupMode.el.textMenuButton.click();

      canvasPage.el.canvas.click(100, 100);

      markupMode.el.markupText.should('be.visible').and('have.canvasFocus');
      markupMode.el.markupTextInput.type('madagascar');

      canvasPage.el.canvas.click(200, 200);

      markupMode.el.markupText //
        .should('have.length', 1)
        .and('not.have.canvasFocus')
        .and('contain.text', 'madagascar');
    });

    it.skip('create new image markup', () => {
      markupMode.goToCanvas();
      cy.wait('@loadDiagram');

      markupMode.el.imageMenuButton.click();

      markupMode.el.imageUpload.attachFile({
        filePath: 'image.png',
      });

      markupMode.el.markupImage //
        .should('have.length', 1)
        .and('not.have.canvasFocus')
        .children()
        .eq(0)
        .should('have.attr', 'height', '200px');
    });
  });
});
