import canvasPage from '../../pages/canvas';

const commentingMode = canvasPage.mode.commenting;

context('Canvas - Commenting', () => {
  beforeEach(() => cy.setup());
  afterEach(() => cy.teardown());

  describe('pro plan navigate', () => {
    beforeEach(() => {
      cy.createProject();
      cy.upgradeTestAccount('pro');
    });

    it('enter mode with controls', () => {
      canvasPage.goToCanvas();
      cy.awaitLoaded();

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(120);

      canvasPage.el.commentingModeControl.click();

      cy.shouldBeOn(commentingMode);
    });

    it('enter mode with hotkey', () => {
      canvasPage.goToCanvas();

      cy.awaitLoaded();

      cy.sendHotkey('c');

      cy.shouldBeOn(commentingMode);
    });

    it('navigate with URL', () => {
      commentingMode.goToCanvas();

      cy.shouldBeOn(commentingMode);
      commentingMode.el.historyDrawer.should('be.visible');
      canvasPage.el.commentingModeControl.should('be.visible');
    });
  });

  describe('commenting mode', () => {
    // eslint-disable-next-line sonarjs/no-identical-functions
    beforeEach(() => {
      cy.createProject();
      cy.upgradeTestAccount('pro');
    });
    afterEach(() => cy.removeTestThreads());

    it('create new comment thread', () => {
      commentingMode.goToCanvas();

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
        commentingMode.el.threadEditor.find('.vf-svg-icon--ellipsis').click();

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
