import { createSelector } from 'reselect';

import client from '@/client';
import { hasIdenticalMembers, withoutValue } from '@/utils/array';

import { createAction, createPureReducer, createRootSelector } from './utils';

export const STATE_KEY = 'variableSet';

// actions

const ADD_VARIABLE = 'VARIABLE:ADD';
const REMOVE_VARIABLE = 'VARIABLE:REMOVE';
const REPLACE_VARIABLE_SET = 'VARIABLE_SET:REPLACE';

// reducers

const DEFAULT_STATE = {};
const DEFAULT_VARIABLE_SET = [];

const replaceVariableSetReducer = (state, { payload: { diagramID, variables } }) => ({
  ...state,
  [diagramID]: variables,
});

const addVariableReducer = (state, { payload: variable }) => [...state, variable];

const removeVariableReducer = (state, { payload: variable }) => withoutValue(state, variable);

const variableReducer = createPureReducer((state = DEFAULT_VARIABLE_SET, action) => {
  switch (action.type) {
    case ADD_VARIABLE:
      return addVariableReducer(state, action);
    case REMOVE_VARIABLE:
      return removeVariableReducer(state, action);
    default:
      return state;
  }
});

const variableSetReducer = (state = DEFAULT_STATE, action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case REPLACE_VARIABLE_SET:
      return replaceVariableSetReducer(state, action);
    default:
      return variableReducer(state, action, action.context && action.context.diagramID);
  }
};

export default variableSetReducer;

// selectors

const rootSelector = createRootSelector(STATE_KEY);

export { rootSelector as variableSetSelector };

export const variablesByDiagramIDSelector = createSelector(
  rootSelector,
  (state) => (diagramID) => state[diagramID] || []
);

export const hasVariablesByDiagramIDSelector = createSelector(
  variablesByDiagramIDSelector,
  (variables) => (diagramID) => !!variables(diagramID).length
);

// action creators

export const replaceVariableSet = (diagramID, variables) => createAction(REPLACE_VARIABLE_SET, { diagramID, variables });

export const addVariableToDiagram = (diagramID, name) => createAction(ADD_VARIABLE, name, { diagramID });

export const removeVariableFromDiagram = (diagramID, name) => createAction(REMOVE_VARIABLE, name, { diagramID });

// side effects

export const loadVariableSetForDiagram = (diagramID) => async (dispatch) => {
  const variables = await client.diagram.findVariables(diagramID);

  dispatch(replaceVariableSet(diagramID, variables));

  return variables;
};

export const saveVariableSet = (diagramID) => async (dispatch, getState) => {
  const state = getState();
  const variables = variablesByDiagramIDSelector(state)(diagramID);

  const remoteDiagramVariables = await client.diagram.findVariables(diagramID);

  if (!hasIdenticalMembers(remoteDiagramVariables, variables)) {
    await client.diagram.updateVariables(diagramID, variables);
  }
};
