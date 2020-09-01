import canvasPage from '../../pages/canvas';
import paymentModal from '../../pages/modals/payment';

const commentingMode = canvasPage.mode.commenting;

context('Canvas - Commenting', () => {
  beforeEach(() => cy.setup());
  afterEach(() => cy.teardown());

  describe('starter plan', () => {
    beforeEach(() => {
      cy.createProject();
      canvasPage.goToCanvas();
    });

    it('show upgrade modal if starter', () => {
      canvasPage.el.commentingModeControl.click();

      paymentModal.el.root.should('be.visible');
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

      canvasPage.el.commentingModeControl.click();

      cy.shouldBeOn(commentingMode);
    });

    it('enter mode with hotkey', () => {
      canvasPage.goToCanvas();
      cy.wait('@loadDiagram');

      canvasPage.el.canvas.find('[tabindex]').first().type('c');

      cy.shouldBeOn(commentingMode);
    });

    it('navigate with URL', () => {
      commentingMode.goToCanvas();
      cy.wait('@loadDiagram');

      cy.shouldBeOn(commentingMode);
      commentingMode.el.historyDrawer.should('be.visible');
      canvasPage.el.escapeModePrompt.should('be.visible').and('have.text', 'esc to exit commenting');
      canvasPage.el.commentingModeControl.find('.vf-svg-icon--close').should('be.visible');
    });
  });
});
