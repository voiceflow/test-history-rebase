import canvasPage from '../../pages/canvas';

context('Canvas - Links', () => {
  beforeEach(() => {
    cy.setup();
    cy.createProject();
    canvasPage.goToCanvas();
  });
  afterEach(() => cy.teardown());

  it('add link via clicks', () => {
    cy.awaitCanvasAnimation();

    cy.addBlockToCanvasViaStepMenu('Speak', [400, 50]);

    canvasPage.el.node.eq(0).find('.vf-canvas__step .vf-canvas__port').eq(0).click();
    canvasPage.el.node.eq(1).click();

    canvasPage.el.link.should('have.length', 1);
  });

  it('remove link', () => {
    cy.awaitCanvasAnimation();

    cy.addBlockToCanvasViaStepMenu('Speak', [400, 50]);

    canvasPage.el.node.eq(0).find('.vf-canvas__step .vf-canvas__port').eq(0).click();
    canvasPage.el.node.eq(1).click();

    canvasPage.el.canvas.click(0, 0);

    canvasPage.el.link.find('path').eq(0).click({ force: true });
    canvasPage.el.linkSettings.find('.vf-svg-icon--trash').click();

    canvasPage.el.link.should('have.length', 0);
  });
});
