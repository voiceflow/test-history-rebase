/// <reference types="cypress" />
/// <reference types="cypress-real-events" />

declare namespace Cypress {
  type Coords = [x: number, y: number];

  interface PageModel {
    meta: {
      route: string | RegExp;
    };
  }

  type VFWindow = Cypress.AUTWindow & {
    cypress_clipboard?: string;
  };

  interface Chainable {
    setup(): Chainable;

    teardown(): Chainable;

    // OVERRIDES

    /**
     * override window method to add custom properties
     */
    window(options?: Partial<Loggable & Timeoutable>): Chainable<VFWindow>;

    // HELPERS

    /**
     * Get data from the window.cypress_clipboard
     */
    clipboard(): Chainable<string | undefined>;

    /**
     * Emulate react Drag and Drop behavior
     */
    reactDnD<E extends Node = HTMLElement>(
      targetNodeSelector: string,
      { offsetX, offsetY }: { offsetX: number; offsetY: number }
    ): Chainable<JQuery<E>>;

    /**
     * complete signup flow using configured name, email + password, with optional queryString
     */
    signup(queryString?: string): Chainable;

    /**
     * verification confirmation through API of the email of the user created during the signup flow
     */
    verifyEmail(queryParam?: string): Chainable;

    /**
     * verify the email of the user created during the signup flow
     */
    setVerified(): Chainable;

    /**
     * create workspace, needs to be called after signup()
     */
    createWorkspace(): Chainable;

    /**
     * get element's clientRect
     */
    boundingClientRect(): Chainable<DOMRect>;

    /**
     * set auth cookies and other identification settings
     */
    setAuth(): Chainable;

    /**
     * clear cookies and localStorage
     */
    clearAuth(): Chainable;

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
    createProject(platform?: 'alexa' | 'google' | 'general', tag?: string): Chainable;

    /**
     * render a project for testing
     */
    renderTest(platform: 'alexa' | 'google' | 'general'): Chainable;

    /**
     * configure the public prototype experience
     */
    configurePrototype(settings: Partial<{ layout: 'voice-and-dialog' | 'text-and-dialog' | 'voice-and-visuals' }>): Chainable;

    /**
     Fills stripe input
     */
    fillElementsInput(field: string, value: string): Chainable;

    /**
     * create a new thread
     */
    createThread(text: string): Chainable;

    /**
     * create a new transcript
     */
    createTranscript(options: { sessionID: string; creatorID: string | null; createdAt?: number; reportTags?: string[] }): Chainable;

    /**
     * create a new transcript report tag
     */
    createReportTag(options: { label: string; tagID: string }): Chainable;

    /**
     * wait for canvas animation to complete
     */
    awaitCanvasAnimation(wait?: number): Chainable;

    /**
     * drag a node by the specified amounts
     */
    dragNode<E extends Node = HTMLElement>(movementX: number, movementY: number): Chainable<JQuery<E>>;

    /**
     * drag the canvas by specified amounts
     */
    dragCanvas(movementX: number, movementY: number): Chainable;

    /**
     * send a hotkey event to the canvas
     */
    sendHotkey(hotkey: string): Chainable;
    sendHotkey<E extends Node = HTMLElement>(hotkey: string): Chainable<E>;

    /**
     * add block by name to canvas via spotlight
     */
    addBlockToCanvasViaSpotlight(blockName: string): Chainable;

    /**
     * add block by name to canvas via step menu
     */
    addBlockToCanvasViaStepMenu(section: string, stepName: string, coords: Coords): Chainable;

    /**
     * select all nodes
     */
    selectAllCanvasNodes(): Chainable;

    /**
     * add speak and choice blocks that are linked with the start block
     */
    addSpeakAndChoiceBlocks(speakBlockMessage: string): Chainable;

    /**
     * add a visual block that is linked with the start block
     */
    addVisualBlock(): Chainable;

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
    (chainer: 'have.coords', coords: Coords, pixelDisparity?: number): Chainable<Subject>;

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
