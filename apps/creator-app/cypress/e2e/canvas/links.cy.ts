import canvasPage from '../../pages/canvas';

context.skip('Canvas - Links', () => {
  beforeEach(() => {
    cy.setup();
    cy.createProject();
    canvasPage.goToCanvas();
  });
  afterEach(() => cy.teardown());

  it('add link via clicks', () => {
    cy.awaitCanvasAnimation();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(120);

    cy.addBlockToCanvasViaStepMenu('Talk', 'Speak', [400, 50]);

    canvasPage.el.homeChip.find('.vf-canvas__port').eq(0).click({ force: true });
    canvasPage.el.newLink.should('have.length', 1);
    canvasPage.el.node.eq(1).trigger('mouseover');
    canvasPage.el.node.eq(1).trigger('hover');

    canvasPage.el.nodeHovered.click({ force: true });

    canvasPage.el.link.should('have.length', 1);
  });

  it('remove link', () => {
    cy.awaitCanvasAnimation();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(120);

    cy.addBlockToCanvasViaStepMenu('Talk', 'Speak', [400, 50]);

    canvasPage.el.canvas.click(0, 0, { force: true });

    canvasPage.el.homeChip.find('.vf-canvas__port').eq(0).click({ force: true });
    canvasPage.el.newLink.should('have.length', 1);
    canvasPage.el.node.eq(1).trigger('mouseover');
    canvasPage.el.node.eq(1).trigger('hover');

    canvasPage.el.nodeHovered.click({ force: true });

    canvasPage.el.link.should('have.length', 1);

    canvasPage.el.canvas.click(0, 0, { force: true });

    canvasPage.el.link.find('path').eq(0).click({ force: true });
    canvasPage.el.linkSettings.find('.vf-svg-icon--trash').click({ force: true });

    canvasPage.el.link.should('have.length', 0);
  });
});
