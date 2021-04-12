/* eslint-disable promise/always-return */

import canvasPage from '../../pages/canvas';

Cypress.Commands.add('awaitCanvasAnimation', () => {
  canvasPage.el.canvas.children().then(($el) => cy.wrap($el, { timeout: 1000 }).invoke('css', 'transition').should('eq', 'all 0s ease 0s'));
});

Cypress.Commands.add(
  'dragNode',
  { prevSubject: 'element' },
  ($node: Cypress.Chainable<JQuery<HTMLElement>>, movementX: number, movementY: number) => {
    cy.wrap($node).trigger('dragstart', { force: true });

    cy.document().then(($doc) => {
      const { clientHeight, clientWidth } = $doc.body;

      cy.wrap($doc)
        .trigger('mousemove', { force: true, clientX: clientWidth / 2, clientY: clientHeight / 2, movementX, movementY })
        .trigger('mouseup', { force: true });
    });

    cy.wrap($node);
  }
);

Cypress.Commands.add('dragCanvas', (movementX: number, movementY: number) => {
  cy.document().then(($doc) => {
    const { clientWidth, clientHeight } = $doc.body;

    canvasPage.el.canvas.trigger('dragstart', clientWidth / 2, 50, { button: 2 });

    cy.wrap($doc)
      .trigger('mousemove', { clientX: clientWidth / 2, clientY: clientHeight / 2, movementX, movementY })
      .trigger('mouseup');
  });
});

Cypress.Commands.add(
  'sendHotkey',
  { prevSubject: ['optional', 'element'] },
  ($node: Cypress.Chainable<JQuery<HTMLElement>> | undefined, hotkey: string) => {
    if (!$node) {
      canvasPage.el.canvas.type(hotkey);
    } else {
      cy.wrap($node).type(hotkey);
    }
  }
);

Cypress.Commands.add('addBlockToCanvasViaSpotlight', (blockName: string) => {
  cy.sendHotkey('{shift} ');

  cy.get('#vf-spotlight input').type(`${blockName}{enter}`);
});

Cypress.Commands.add('addBlockToCanvasViaStepMenu', (blockName: string, [offsetX, offsetY]: Cypress.Coords) => {
  canvasPage.el.stepMenu
    .contains('.vf-step-menu__item', blockName)
    .scrollIntoView()
    .reactDnD('#vf-canvas', { offsetY, offsetX })
    .awaitCanvasAnimation();
});

Cypress.Commands.add('selectAllCanvasNodes', () => {
  canvasPage.el.node.each(($node) => cy.wrap($node).click({ shiftKey: true, force: true }));
});
