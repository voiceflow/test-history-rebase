import { createCRUDActionCreators } from '../utils/crud';
import { STATE_KEY } from './constants';

// action creators

export const {
  add: addDiagram,
  addMany: addDiagrams,
  update: updateDiagram,
  remove: removeDiagram,
  replace: replaceDiagrams,
} = createCRUDActionCreators(STATE_KEY);

export const replaceLocalVariables = (diagramID: string, variables: string[], meta?: any) => updateDiagram(diagramID, { variables }, true, meta);
