/* eslint-disable promise/always-return */

import { ClassName } from '../../../src/styles/constants';
import canvasPage from '../../pages/canvas';

Cypress.Commands.add('awaitCanvasAnimation', (wait = 150) => {
  canvasPage.el.canvas.children().then(($el) => cy.wrap($el, { timeout: 1000 }).invoke('css', 'transition').should('eq', 'all 0s ease 0s'));

  // extra wait time to be sure the animation is finished
  cy.wait(wait);
});

Cypress.Commands.add('dragNode', { prevSubject: 'element' }, ($node, movementX, movementY) => {
  cy.wrap($node).trigger('dragstart', { force: true, waitForAnimations: true });

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(10);

  cy.document().then(($doc) => {
    const { clientHeight, clientWidth } = $doc.body;

    cy.wrap($doc)
      .trigger('mousemove', { force: true, clientX: clientWidth / 2, clientY: clientHeight / 2, movementX, movementY })
      .trigger('mouseup', { force: true });
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

Cypress.Commands.add('sendHotkey', { prevSubject: ['optional', 'element'] }, ($node, hotkey) => {
  if (!$node) {
    canvasPage.el.canvas.type(hotkey);
  } else {
    cy.wrap($node).type(hotkey);
  }
});

Cypress.Commands.add('addBlockToCanvasViaSpotlight', (blockName) => {
  cy.sendHotkey('{shift} ');
  cy.get('#vf-spotlight input').type(`${blockName}{enter}`, { force: true });
});

Cypress.Commands.add('addBlockToCanvasViaStepMenu', (section, stepName, [offsetX, offsetY]) => {
  canvasPage.el.stepMenu.contains('.vf-step-menu__item', section).trigger('mouseover');
  // the sub menu is a popper tied to the root dom element
  cy.contains('.vf-sub-step-menu__item', stepName).reactDnD('#vf-canvas', { offsetY, offsetX }).awaitCanvasAnimation();
});

Cypress.Commands.add('selectAllCanvasNodes', () => {
  canvasPage.el.node.each(($node) =>
    cy.wrap($node).click({ shiftKey: true, force: true }).should('have.class', `${ClassName.CANVAS_NODE}--selected`)
  );
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(50);
});

Cypress.Commands.add('addSpeakAndChoiceBlocks', (speakBlockMessage) => {
  cy.awaitCanvasAnimation();
  cy.addBlockToCanvasViaStepMenu('Talk', 'Speak', [400, 120]);
  canvasPage.el.speakBlockTextInput.type(speakBlockMessage);

  cy.selectAllCanvasNodes();

  canvasPage.el.node.eq(0).find('.vf-canvas__step .vf-canvas__port').eq(0).click();
  canvasPage.el.node.eq(1).click();

  canvasPage.el.userInputToggle.click();

  cy.addBlockToCanvasViaStepMenu('Listen', 'Choice', [400, 20]);
  canvasPage.el.choiceBlockTextInput.type('yes{enter}');

  cy.selectAllCanvasNodes();
  canvasPage.el.node.eq(1).find('.vf-canvas__step .vf-canvas__port').eq(0).click();
  canvasPage.el.node.eq(2).click();
});

Cypress.Commands.add('addVisualBlock', () => {
  cy.addBlockToCanvasViaStepMenu('Talk', 'Display', [400, 400]);

  cy.get('input[type="file"]').selectFile({ contents: 'cypress/fixtures/image.png' }, { force: true });

  cy.selectAllCanvasNodes();
  canvasPage.el.node.eq(0).find('.vf-canvas__step .vf-canvas__port').eq(0).click();
  canvasPage.el.node.eq(1).click();
});
