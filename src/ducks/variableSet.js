import { createSelector } from 'reselect';

import client from '@/client';
import { creatorDiagramIDSelector } from '@/ducks/creator';
import { hasIdenticalMembers, withoutValue } from '@/utils/array';

import { createAction, createPureReducer, createRootSelector } from './utils';

export const STATE_KEY = 'variableSet';

// actions

export const ADD_VARIABLE = 'VARIABLE:ADD';
export const REMOVE_VARIABLE = 'VARIABLE:REMOVE';
export const REPLACE_VARIABLE_SET_DIAGRAM = 'VARIABLE_SET_DIAGRAM:REPLACE';
export const REPLACE_VARIABLE_SET = 'VARIABLE_SET:REPLACE';
// reducers

const DEFAULT_STATE = {};
const DEFAULT_VARIABLE_SET = [];

const replaceVariableSetDiagramReducer = (state, { payload: { diagramID, variables } }) => ({
  ...state,
  [diagramID]: variables,
});

const replaceVariableSetReducer = ({ payload: variableSet }) => variableSet;

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
  switch (action.type) {
    case REPLACE_VARIABLE_SET_DIAGRAM:
      return replaceVariableSetDiagramReducer(state, action);
    case REPLACE_VARIABLE_SET:
      return replaceVariableSetReducer(action);
    default:
      return variableReducer(state, action, action.meta && action.meta.diagramID);
  }
};

export default variableSetReducer;

// selectors

const rootSelector = createRootSelector(STATE_KEY);

export { rootSelector as variableSetSelector };

export const variablesByDiagramIDSelector = createSelector(rootSelector, (state) => (diagramID) => state[diagramID] || []);

export const hasVariablesByDiagramIDSelector = createSelector(variablesByDiagramIDSelector, (variables) => (diagramID) =>
  !!variables(diagramID).length
);

export const activeDiagramVariables = createSelector(creatorDiagramIDSelector, variablesByDiagramIDSelector, (diagramID, variablesByDiagramID) =>
  variablesByDiagramID(diagramID)
);

// action creators

export const replaceVariableSet = (variableSet, meta) => createAction(REPLACE_VARIABLE_SET, variableSet, meta);

export const replaceVariableSetDiagram = (diagramID, variables) => createAction(REPLACE_VARIABLE_SET_DIAGRAM, { diagramID, variables });

export const removeVariableFromDiagram = (diagramID, name) => createAction(REMOVE_VARIABLE, name, { diagramID });

// side effects

export const saveVariableSet = (diagramID) => async (_, getState) => {
  const state = getState();
  const variables = variablesByDiagramIDSelector(state)(diagramID);

  const remoteDiagramVariables = await client.diagram.findVariables(diagramID);

  if (!hasIdenticalMembers(remoteDiagramVariables, variables)) {
    await client.diagram.updateVariables(diagramID, variables);
  }
};

export const addVariableToDiagram = (diagramID, name) => (dispatch) => {
  dispatch(createAction(ADD_VARIABLE, name, { diagramID }));
  // eslint-disable-next-line no-use-before-define
  dispatch(saveVariableSet(diagramID));
};

export const loadVariableSetForDiagram = (diagramID) => async (dispatch) => {
  const variables = await client.diagram.findVariables(diagramID);
  dispatch(replaceVariableSetDiagram(diagramID, variables));

  return variables;
};

export const saveActiveDiagramVariables = () => async (dispatch, getState) => {
  const diagramID = creatorDiagramIDSelector(getState());

  if (!diagramID) return;

  dispatch(saveVariableSet(diagramID));
};
