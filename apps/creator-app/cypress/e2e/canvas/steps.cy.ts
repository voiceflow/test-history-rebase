import canvasPage from '../../pages/canvas';
import sharedPage from '../../pages/shared';
import buildTools from '../../utils/canvas/buildTools';

context('Canvas - Steps', () => {
  beforeEach(() => {
    cy.setup();
    cy.createProject();
    canvasPage.goToCanvas();
  });
  afterEach(() => cy.teardown());

  it('copy/paste step via hotkey', () => {
    cy.awaitCanvasAnimation();

    buildTools.spawnNodeInGrid('speak', 0, 1);
    buildTools.getLastBlock().click({ force: true }).sendHotkey('{meta}c');

    sharedPage.el.toastify.should('contain', '1 block(s) copied to clipboard');

    cy.document().trigger('mousemove', { clientX: 400, clientY: 600 });
    cy.clipboard().then((clipboardData) => cy.document().trigger('paste', { clipboardData: { getData: () => clipboardData } }));

    canvasPage.el.node.should('have.length', 3).eq(2).and('have.coords', [400, 600]);
  });

  it('copy/paste step via context menu', () => {
    cy.awaitCanvasAnimation();

    buildTools.spawnNodeInGrid('speak', 0, 1);

    buildTools.getLastBlock().rightclick();
    sharedPage.el.contextMenu.contains('Copy').click();

    sharedPage.el.toastify.should('contain', '1 block(s) copied to clipboard');

    canvasPage.el.canvas.rightclick(400, 500, { force: true });
    sharedPage.el.contextMenu.contains('Paste').click();

    canvasPage.el.node.should('have.length', 3).eq(2).and('have.coords', [400, 565]);
  });

  it('duplicate step via hotkey', () => {
    cy.awaitCanvasAnimation();

    buildTools.spawnNodeInGrid('speak', 0, 1);

    buildTools.getLastStep().click().sendHotkey('{meta}d');

    canvasPage.el.node.should('have.length', 3).eq(2).and('have.coords', [398, 394]);
  });

  it('duplicate step via context menu', () => {
    cy.awaitCanvasAnimation();

    buildTools.spawnNodeInGrid('speak', 0, 1);

    buildTools.getLastStep().rightclick();
    sharedPage.el.contextMenu.contains('Duplicate').click();

    canvasPage.el.node.should('have.length', 3).eq(2).and('have.coords', [398, 394]);
  });
});
