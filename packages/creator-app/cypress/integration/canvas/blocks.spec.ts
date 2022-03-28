import canvasPage from '../../pages/canvas';
import sharedPage from '../../pages/shared';
import buildTools from '../../utils/canvas/buildTools';

context('Canvas - Blocks', () => {
  beforeEach(() => {
    cy.setup();
    cy.createProject();
    canvasPage.goToCanvas();
  });
  afterEach(() => cy.teardown());

  it('has a home block', () => {
    cy.awaitCanvasAnimation();
    buildTools.unStickCanvas();
    buildTools.toggleDesignMenu();
    canvasPage.el.node.should('have.length', 1);
    canvasPage.el.homeBlock.should('be.visible');
    canvasPage.el.homeBlock.find('.vf-canvas__block__section__title').first().should('have.text', 'Start');
  });

  it('drag home block on canvas', () => {
    cy.awaitCanvasAnimation();

    canvasPage.el.node.should('have.coords', [400, 249]).dragNode(200, 200).should('have.coords', [600, 449]);
  });

  it('add block to canvas using spotlight', () => {
    cy.awaitCanvasAnimation(300);

    cy.addBlockToCanvasViaSpotlight('Audio');

    canvasPage.el.node.should('have.length', 2).eq(1).and('have.coords', [368, 355]);
  });

  it('add block to canvas using step menu', () => {
    cy.awaitCanvasAnimation();

    cy.addBlockToCanvasViaStepMenu('Speak', [600, 400]);

    canvasPage.el.node.should('have.length', 2).eq(1).and('have.coords', [368, 465]);
  });

  it('drag added block via spotlight on canvas', () => {
    cy.awaitCanvasAnimation();

    buildTools.unStickCanvas();
    cy.addBlockToCanvasViaSpotlight('Audio');
    cy.awaitCanvasAnimation();
    canvasPage.el.node.eq(1).should('have.coords', [368, 389]).dragNode(200, 0).should('have.coords', [568, 389], 2);
  });

  it('drag added block via step menu on canvas', () => {
    cy.awaitCanvasAnimation();

    buildTools.unStickCanvas();
    cy.addBlockToCanvasViaStepMenu('Speak', [400, 400]);
    buildTools.getLastBlock().should('have.coords', [236, 465], 2).dragNode(200, 200).should('have.coords', [436, 665], 2);
  });

  it('copy/paste block via hotkey', () => {
    cy.awaitCanvasAnimation();

    buildTools.spawnNodeInGrid('speak', 1, 0);

    buildTools.clickLastBlock().sendHotkey('{meta}c');

    sharedPage.el.toastify.should('contain', '1 block(s) copied to clipboard');

    cy.document().trigger('mousemove', { clientX: 400, clientY: 600 });

    cy.clipboard().then((clipboardData) => cy.document().trigger('paste', { clipboardData: { getData: () => clipboardData } }));

    canvasPage.el.node.should('have.length', 3).eq(2).and('have.coords', [400, 599]);
  });

  it('copy/paste block via context menu', () => {
    cy.awaitCanvasAnimation();

    buildTools.spawnNodeInGrid('speak', 1, 0);

    buildTools.getLastBlock().rightclick();
    sharedPage.el.contextMenu.contains('Copy').click();

    sharedPage.el.toastify.should('contain', '1 block(s) copied to clipboard');

    canvasPage.el.canvas.rightclick(400, 500, { force: true });
    sharedPage.el.contextMenu.contains('Paste').click();

    canvasPage.el.node.should('have.length', 3).eq(2).and('have.coords', [400, 564]);
  });

  it('duplicate block via hotkey', () => {
    cy.awaitCanvasAnimation();

    buildTools.spawnNodeInGrid('speak', 1, 0);

    buildTools.getLastBlock().click().sendHotkey('{meta}d');

    canvasPage.el.node.should('have.length', 3).eq(2).and('have.coords', [368, 394]);
  });

  it('duplicate block via context menu', () => {
    cy.awaitCanvasAnimation();

    cy.addBlockToCanvasViaStepMenu('Speak', [400, 50]);

    buildTools.getLastBlock().rightclick();
    sharedPage.el.contextMenu.contains('Duplicate').click();

    canvasPage.el.node.should('have.length', 3).eq(2).and('have.coords', [368, 147]);
  });

  it.only('drag multiple blocks', () => {
    cy.awaitCanvasAnimation();

    cy.addBlockToCanvasViaStepMenu('Speak', [400, 100]);
    cy.addBlockToCanvasViaStepMenu('Speak', [400, 500]);

    canvasPage.el.node.eq(0).should('have.coords', [336, 249], 2);
    canvasPage.el.node.eq(1).should('have.coords', [336, 165], 2);
    canvasPage.el.node.eq(2).should('have.coords', [368, 565], 2);

    cy.selectAllCanvasNodes();

    canvasPage.el.node.eq(2).dragNode(100, 100);

    canvasPage.el.node.eq(0).should('have.coords', [436, 349], 2);
    canvasPage.el.node.eq(1).should('have.coords', [436, 265], 2);
    canvasPage.el.node.eq(2).should('have.coords', [468, 665], 2);
  });
});
