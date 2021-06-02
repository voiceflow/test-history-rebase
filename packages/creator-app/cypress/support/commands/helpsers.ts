Cypress.Commands.add('clipboard', () => cy.window().then(($win) => $win.cypress_clipboard));

Cypress.Commands.add('boundingClientRect', { prevSubject: 'element' }, ($node: Cypress.Chainable<JQuery<HTMLElement>>) =>
  $node.then(($el) => $el.get(0).getBoundingClientRect())
);
