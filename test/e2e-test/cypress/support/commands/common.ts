import { canvas } from '@voiceflow/cypress-page-objects';

/**
 * Finds step port using step name
 */
Cypress.Commands.add('findPort', (stepName) => {
  canvas.getSteps().contains(stepName).parentsUntil(canvas.blockSection()).find(canvas.port());
});
