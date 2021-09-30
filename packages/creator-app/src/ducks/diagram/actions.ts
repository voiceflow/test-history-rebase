import { createCRUDActionCreators } from '../utils/crud';
import { STATE_KEY } from './constants';

// action creators

export const { add: addDiagram, update: updateDiagram, remove: removeDiagram, replace: replaceDiagrams } = createCRUDActionCreators(STATE_KEY);

export const replaceLocalVariables = (diagramID: string, variables: string[], meta?: any) => updateDiagram(diagramID, { variables }, true, meta);

export const replaceIntentStepIDs = (diagramID: string, intentStepIDs: string[], meta?: any) =>
  updateDiagram(diagramID, { intentStepIDs }, true, meta);
