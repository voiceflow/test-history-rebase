/// <reference types="cypress" />

declare namespace Cypress {
  type PageModel = {
    meta: {
      route: string | RegExp;
    };
  };

  interface Chainable {
    setup(): Chainable;

    teardown(): Chainable;

    /**
     * complete signup flow using configured name, email + password
     */
    signup(): Chainable;

    /**
     * set the auth token cookie
     */
    setAuthToken(): Chainable;

    /**
     * create a test account using configured name, email + password
     */
    createTestAccount(): Chainable;

    /**
     * create the active test account to a specific plan
     */
    upgradeTestAccount(plan: 'pro'): Chainable;

    /**
     * remove existing test account
     */
    removeTestAccount(): Chainable;

    /**
     * create a new project
     */
    createProject(): Chainable;

    /**
     * wait for canvas animation to complete
     */
    awaitCanvasAnimation(): Chainable;

    /**
     * drag a node by the specified amounts
     */
    dragNode(movementX: number, movementY: number): Chainable;

    /**
     * drag the canvas by specified amounts
     */
    dragCanvas(movementX: number, movementY: number): Chainable;

    /**
     * get stored session information
     */
    getSession(): Promise<{ skillID: string; diagramID: string }>;

    /**
     * assert the active page based off of path matching
     */
    shouldBeOn(page: PageModel): Chainable;

    /**
     * await for all loaders on the page to resolve
     */
    awaitLoaded(): Chainable;
  }

  interface Chainer<Subject> {
    /**
     * check if the current route matches the provided page model
     *
     * @example
     ```
    cy.location('pathname').should('be.onRoute', page)
    ```
    * */
    (chainer: 'be.onRoute', page: PageModel): Chainable<Subject>;

    /**
     * check to see if the element is at the provided coords
     *
     * @example
     ```
    cy.get('.node').should('have.coords', [123, 456])
    ```
    * */
    (chainer: 'have.coords', coords: [number, number]): Chainable<Subject>;
  }
}
