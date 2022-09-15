Cypress.Commands.add('clipboard', () => cy.window().then(($win) => cy.wrap($win.cypress_clipboard)));

Cypress.Commands.add('boundingClientRect', { prevSubject: 'element' }, ($node) => cy.wrap($node.get(0).getBoundingClientRect()));
