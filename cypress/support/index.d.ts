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
     * remove all threads associated with the test account
     */
    removeTestThreads(): Chainable;

    /**
     * create a new project
     */
    createProject(platform?: 'alexa' | 'google'): Chainable;

    /**
     * create a new thread
     */
    createThread(text: string): Chainable;

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
     * send a hotkey event to the canvas
     */
    sendHotkey(hotkey: string): Chainable;

    /**
     * get stored session information
     */
    getSession(): Promise<{ versionID: string; diagramID: string }>;

    /**
     * assert the active page based off of path matching
     */
    shouldBeOn(page: PageModel): Chainable;

    /**
     * await for all loaders on the page to resolve
     */
    awaitLoaded(): Chainable;

    /**
     * from `cypress-file-upload`
     */
    attachFile(
      fixture: { filePath: string; fileName?: string; fileContent?: Blob; mimeType?: string; encoding?: string },
      processingOptions?: { subject: 'drag-n-drop' | 'input'; force?: boolean; allowEmpty?: boolean }
    ): Chainable;
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

    /**
     * check to see if the element is at the provided coords
     *
     * @example
     ```
    cy.get('.node').should('have.canvasFocus')
    ```
    * */
    (chainer: 'have.canvasFocus'): Chainable<Subject>;
    (chainer: 'not.have.canvasFocus'): Chainable<Subject>;
  }
}
