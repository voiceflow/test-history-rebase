import canvasPage from '../pages/canvas';

context('Canvas', () => {
  beforeEach(() => {
    cy.setup();
    cy.createProject();
    canvasPage.goToCanvas();
  });
  afterEach(() => cy.teardown());

  it('open settings', () => {
    canvasPage.openSettings();

    canvasPage.el.modal.should('be.visible');
    canvasPage.el.modalTitle.should('have.text', 'Project Settings');
  });

  it('has a home block', () => {
    canvasPage.el.node.should('have.length', 1);
    canvasPage.el.homeBlock.should('be.visible');
    canvasPage.el.homeBlock.find('.vf-canvas__block__section__title').first().should('be.visible').should('have.text', 'Home');
  });

  it('drag block on canvas', () => {
    cy.awaitCanvasAnimation();

    canvasPage.el.node.should('have.coords', [400, 304]).dragNode(200, 200).should('have.coords', [600, 504]);
  });

  it('drag canvas', () => {
    cy.awaitCanvasAnimation();

    canvasPage.el.canvas.children().should('have.coords', [737, -275]);

    cy.dragCanvas(200, -20);

    canvasPage.el.canvas.children().should('have.coords', [937, -295]);
  });
});
