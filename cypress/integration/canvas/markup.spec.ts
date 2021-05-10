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

    canvasPage.el.canvas.click(500, 100);

    canvasPage.el.markupText.should('be.visible').and('have.canvasFocus');
    canvasPage.el.markupTextInput.type('madagascar');

    canvasPage.el.canvas.click(400, 100);

    canvasPage.el.markupText //
      .should('have.length', 1)
      .and('not.have.canvasFocus')
      .and('contain.text', 'madagascar');
  });

  it('create new image markup', () => {
    cy.server({ method: 'POST' });
    cy.route({ method: 'POST', url: /\/image/ }).as('upload-image');

    canvasPage.el.markupImageControl.click();

    canvasPage.el.markupImageUpload.attachFile({ filePath: 'image.png' }, { subject: 'input', force: true });

    cy.wait('@upload-image', { requestTimeout: 60000 });
    cy.server({ enable: false });

    canvasPage.el.markupImage //
      .should('have.length', 1)
      .children()
      .eq(0)
      .children()
      .eq(0)
      .should('have.attr', 'height', '256');
  });
});
