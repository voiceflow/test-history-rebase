import canvasPage from '../../pages/canvas';
import paymentModal from '../../pages/modals/payment';

const commentingMode = canvasPage.mode.commenting;

context('Canvas - Commenting', () => {
  beforeEach(() => cy.setup());
  afterEach(() => cy.teardown());

  describe('starter plan navigate', () => {
    beforeEach(() => {
      cy.createProject();
      canvasPage.goToCanvas();
    });

    it('show upgrade modal if starter', () => {
      canvasPage.el.commentingModeControl.click();

      paymentModal.el.root.should('be.visible');
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

  describe('commenting mode', () => {
    // eslint-disable-next-line sonarjs/no-identical-functions
    beforeEach(() => {
      cy.server();
      cy.createProject();
      cy.upgradeTestAccount('pro');
      canvasPage.route.postDiagram().as('loadDiagram');
    });
    afterEach(() => cy.removeTestThreads());

    it('create new comment thread', () => {
      commentingMode.goToCanvas();
      cy.wait('@loadDiagram');

      canvasPage.el.canvas.click(200, 200);

      commentingMode.el.newThreadEditor.should('be.visible');

      commentingMode.el.newTreadEditorInput //
        .should('be.focused')
        .type('this looks good!')
        .type('{ctrl}{enter}');

      commentingMode.el.threadComments //
        .should('have.length', 1)
        .first()
        .find('.vf-thread-editor__comment')
        .should('contain.text', 'this looks good!');
    });

    describe('with comment', () => {
      beforeEach(() => {
        cy.createThread('commenting is fun!');
        commentingMode.goToCanvas();
        cy.wait('@loadDiagram');
      });

      it('reply', () => {
        commentingMode.el.thread //
          .should('have.length', 1)
          .first()
          .click();

        commentingMode.el.threadEditor.should('be.visible');

        commentingMode.el.threadReply.click();

        commentingMode.el.threadEditorInput //
          .type('this is my reply!')
          .type('{ctrl}{enter}');

        commentingMode.el.threadComments.should('have.length', 2);
        commentingMode.el.threadReply.should('be.visible');

        commentingMode.el.threadComments //
          .eq(1)
          .find('.vf-thread-editor__comment')
          .should('contain.text', 'this is my reply!');
      });

      it('delete', () => {
        commentingMode.el.thread //
          .first()
          .click();

        commentingMode.el.threadEditor.should('be.visible');
        commentingMode.el.threadEditor.find('.vf-svg-icon--elipsis').click();

        cy.get('.vf-menu') //
          .should('be.visible')
          .find('li')
          .eq(1)
          .should('have.text', 'Delete')
          .click();

        commentingMode.el.thread.should('have.length', 0);
      });
    });
  });
});
