import canvasPage from '../../pages/canvas';

context('Canvas - Markup', () => {
  afterEach(() => cy.teardown());

  beforeEach(() => {
    cy.setup();
    cy.createProject();
    canvasPage.goToCanvas();
  });

  it('create new text markup', () => {
    canvasPage.el.markupTextControl.click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(120);

    canvasPage.el.canvas.click(500, 100);

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(120);

    canvasPage.el.markupText.should('be.visible').and('have.canvasFocus');
    canvasPage.el.markupTextInput.type('madagascar');

    canvasPage.el.canvas.click(400, 100);

    canvasPage.el.markupText //
      .should('have.length', 1)
      .and('not.have.canvasFocus')
      .and('contain.text', 'madagascar');
  });

  it('create new image markup', () => {
    cy.intercept('POST', '/image').as('upload-image');

    canvasPage.el.markupImageControl.click();

    canvasPage.el.markupImageUpload.selectFile({ contents: 'cypress/fixtures/image.png' }, { force: true });

    cy.wait('@upload-image', { requestTimeout: 60000 });

    canvasPage.el.markupImage //
      .should('have.length', 1)
      .children()
      .eq(0)
      .children()
      .eq(0)
      .should('have.attr', 'height', '256');
  });
});
