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

  it('drag canvas', () => {
    cy.awaitCanvasAnimation();

    canvasPage.el.canvas.children().should('have.coords', [112, 208]);

    cy.dragCanvas(200, -20);

    canvasPage.el.canvas.children().should('have.coords', [312, 188]);
  });
});
