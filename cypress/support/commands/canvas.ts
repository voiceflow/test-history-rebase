import canvasPage from '../../pages/canvas';

Cypress.Commands.add('awaitCanvasAnimation', () => {
  canvasPage.el.canvas.children().then(($el) => cy.wrap($el, { timeout: 1000 }).invoke('css', 'transition').should('eq', 'all 0s ease 0s'));
});

Cypress.Commands.add('dragNode', { prevSubject: 'element' }, ($node, movementX, movementY) => {
  cy.wrap($node).children().trigger('dragstart');

  cy.document().then(($doc) => {
    const { clientHeight, clientWidth } = $doc.body;

    cy.wrap($doc)
      .trigger('mousemove', { clientX: clientWidth / 2, clientY: clientHeight / 2, movementX, movementY })
      .trigger('mouseup');
  });

  cy.wrap($node);
});

Cypress.Commands.add('dragCanvas', (movementX, movementY) => {
  cy.document().then(($doc) => {
    const { clientWidth, clientHeight } = $doc.body;

    canvasPage.el.canvas.trigger('dragstart', clientWidth / 2, 50, { button: 2 });

    cy.wrap($doc)
      .trigger('mousemove', { clientX: clientWidth / 2, clientY: clientHeight / 2, movementX, movementY })
      .trigger('mouseup');
  });
});
