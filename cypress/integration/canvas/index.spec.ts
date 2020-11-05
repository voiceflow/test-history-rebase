import canvasPage from '../../pages/canvas';

context('Canvas', () => {
  beforeEach(() => {
    cy.setup();
    cy.createProject();
    canvasPage.goToCanvas();
  });
  afterEach(() => cy.teardown());

  it('opens canvas', () => {
    cy.shouldBeOn(canvasPage);
    cy.awaitLoaded();
  });

  it('open settings', () => {
    canvasPage.el.projectSettings.click();
    canvasPage.el.settingsPage.should('have.length', 1);
  });

  it('has a home block', () => {
    canvasPage.el.node.should('have.length', 1);
    canvasPage.el.homeBlock.should('be.visible');
    canvasPage.el.homeBlock.find('.vf-canvas__block__section__title').first().should('be.visible').should('have.text', 'Start');
  });

  it('drag block on canvas', () => {
    cy.awaitCanvasAnimation();

    canvasPage.el.node.should('have.coords', [400, 304]).dragNode(200, 200).should('have.coords', [600, 504]);
  });

  it('drag canvas', () => {
    cy.awaitCanvasAnimation();

    canvasPage.el.canvas.children().should('have.coords', [112, 208]);

    cy.dragCanvas(200, -20);

    canvasPage.el.canvas.children().should('have.coords', [312, 188]);
  });
});
