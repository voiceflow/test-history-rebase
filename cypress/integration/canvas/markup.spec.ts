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

  describe('pro plan', () => {
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

      canvasPage.el.canvas.find('[tabindex]').first().type('a');

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
});
