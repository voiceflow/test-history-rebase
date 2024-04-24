/// <reference types='cypress-tags' />

declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    /**
     * Finds the unique port for a step using the name of the  step
     *  @example
     * cy.findPort(StepName)
     * */
    findPort(stepName: string): Chainable<any>;

    /**
     * Uploads to knowledge base by specifying the file name
     * and asserts it is uploaded
     * cy.uploadKBFile(fileName)
     * */
    uploadKBFile(fileName: string): Chainable<any>;
  }
}
