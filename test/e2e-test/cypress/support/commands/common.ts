import { canvas, knowledgeBase, knowledgeBaseImportFileModal } from '@voiceflow/cypress-page-objects';

/**
 * Finds step port using step name
 */
Cypress.Commands.add('findPort', (stepName) => {
  canvas.getSteps().contains(stepName).parentsUntil(canvas.blockSection()).find(canvas.port());
});

/**
 * Uploads a file to knowledge base
 */
Cypress.Commands.add('uploadKBFile', (fileName) => {
  knowledgeBase.getAddDataSourceButton().should('be.visible').click();
  knowledgeBase.getUploadFileLabel().should('be.visible').click();
  knowledgeBase.getFileInput().selectFile(`cypress/fixtures/${fileName}`, { force: true });
  knowledgeBaseImportFileModal.getImportButton().should('be.visible').click();
  cy.awaitLoaders();
});
