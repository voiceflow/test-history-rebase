import { createSelector } from 'reselect';

import { creatorDiagramIDSelector } from '@/ducks/creator/diagram/selectors';
import { Thunk } from '@/store/types';
import { append, unique, withoutValue } from '@/utils/array';

import { createCRUDActionCreators } from '../utils/crud';
import { STATE_KEY } from './constants';
import { diagramVariablesSelector } from './selectors';

// action creators

export const {
  add: addDiagram,
  addMany: addDiagrams,
  update: updateDiagram,
  remove: removeDiagram,
  replace: replaceDiagrams,
} = createCRUDActionCreators(STATE_KEY);

export const replaceSubDiagrams = (diagramID: string, subDiagrams: string[]) => updateDiagram(diagramID, { subDiagrams }, true);

// Diagram Variables

export const activeDiagramVariables = createSelector([creatorDiagramIDSelector, diagramVariablesSelector], (diagramID, variablesByDiagramID) =>
  variablesByDiagramID(diagramID!)
);

export const updateDiagramVariables = (diagramID: string, variables: string[], meta?: any) => updateDiagram(diagramID, { variables }, true, meta);

export const removeDiagramVariable = (diagramID: string, variable: string): Thunk => async (dispatch, getState) => {
  const variables = diagramVariablesSelector(getState())(diagramID);
  dispatch(updateDiagramVariables(diagramID, withoutValue(variables, variable)));
};

export const addDiagramVariable = (diagramID: string, variable: string): Thunk => async (dispatch, getState) => {
  const variables = diagramVariablesSelector(getState())(diagramID);
  dispatch(updateDiagramVariables(diagramID, unique(append(variables, variable))));
};
