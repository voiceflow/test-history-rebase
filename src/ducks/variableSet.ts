import { createSelector } from 'reselect';

import client from '@/client';
import { creatorDiagramIDSelector } from '@/ducks/creator';
import { Action, Reducer, RootReducer, RootState, Thunk } from '@/store/types';
import { hasIdenticalMembers, withoutValue } from '@/utils/array';

import { createAction, createLookupReducer, createRootSelector } from './utils';

type VariableSetState = Record<string, VariableSet>;
type VariableSet = string[];

export const INITIAL_STATE: VariableSetState = {};
export const INITIAL_VARIABLE_SET = [];
export const STATE_KEY = 'variableSet';

// actions

type DiagramAction<T extends string, P> = Action<T, P, { diagramID: string }>;

export const ADD_VARIABLE = 'VARIABLE:ADD';
export type AddVariable = DiagramAction<typeof ADD_VARIABLE, string>;
export const REMOVE_VARIABLE = 'VARIABLE:REMOVE';
export type RemoveVariable = DiagramAction<typeof REMOVE_VARIABLE, string>;
export const REPLACE_VARIABLE_SET_DIAGRAM = 'VARIABLE_SET_DIAGRAM:REPLACE';
export type ReplaceVariableSetDiagram = Action<typeof REPLACE_VARIABLE_SET_DIAGRAM, { diagramID: string; variables: string[] }>;
export const REPLACE_VARIABLE_SET = 'VARIABLE_SET:REPLACE';
export type ReplaceVariableSet = Action<typeof REPLACE_VARIABLE_SET, VariableSetState, object>;

type AnyVariableSetAction = AddVariable | RemoveVariable | ReplaceVariableSetDiagram | ReplaceVariableSet;

// reducers

type VariableSetReducer<T extends AnyVariableSetAction> = Reducer<VariableSetState, T>;

const replaceVariableSetDiagramReducer: VariableSetReducer<ReplaceVariableSetDiagram> = (state, { payload: { diagramID, variables } }) => ({
  ...state,
  [diagramID]: variables,
});

const replaceVariableSetReducer = ({ payload: variableSet }: ReplaceVariableSet): VariableSetState => variableSet;

const addVariableReducer: Reducer<VariableSet, AddVariable> = (state, { payload: variable }) => [...state, variable];

const removeVariableReducer: Reducer<VariableSet, RemoveVariable> = (state, { payload: variable }) => withoutValue(state, variable);

const variableReducer = createLookupReducer<VariableSet, AnyVariableSetAction>((state = INITIAL_VARIABLE_SET, action) => {
  switch (action.type) {
    case ADD_VARIABLE:
      return addVariableReducer(state, action);
    case REMOVE_VARIABLE:
      return removeVariableReducer(state, action);
    default:
      return state;
  }
});

const variableSetReducer: RootReducer<VariableSetState, AnyVariableSetAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REPLACE_VARIABLE_SET_DIAGRAM:
      return replaceVariableSetDiagramReducer(state, action);
    case REPLACE_VARIABLE_SET:
      return replaceVariableSetReducer(action);
    default:
      return variableReducer(state, action, action?.meta?.diagramID);
  }
};

export default variableSetReducer;

// selectors

const rootSelector = createRootSelector<VariableSetState>(STATE_KEY);

export { rootSelector as variableSetSelector };

export const variablesByDiagramIDSelector = createSelector(rootSelector, (state) => (diagramID: string) => state[diagramID] || []);

export const hasVariablesByDiagramIDSelector = createSelector(variablesByDiagramIDSelector, (variables) => (diagramID: string) =>
  !!variables(diagramID).length
);

export const activeDiagramVariables = createSelector(creatorDiagramIDSelector, variablesByDiagramIDSelector, (diagramID, variablesByDiagramID) =>
  variablesByDiagramID(diagramID)
);

// action creators

export const replaceVariableSet = (variableSet: VariableSetState, meta: object): ReplaceVariableSet =>
  createAction(REPLACE_VARIABLE_SET, variableSet, meta);

export const replaceVariableSetDiagram = (diagramID: string, variables: VariableSet): ReplaceVariableSetDiagram =>
  createAction(REPLACE_VARIABLE_SET_DIAGRAM, { diagramID, variables });

export const addVariableToDiagram = (diagramID: string, name: string): AddVariable => createAction(ADD_VARIABLE, name, { diagramID });

export const removeVariableFromDiagram = (diagramID: string, name: string): RemoveVariable => createAction(REMOVE_VARIABLE, name, { diagramID });

// side effects

type VariableSetThunk<R = void> = Thunk<RootState<typeof STATE_KEY, VariableSetState>, R>;

export const saveVariableSet = (diagramID: string): VariableSetThunk => async (_, getState) => {
  const state = getState();
  const variables = variablesByDiagramIDSelector(state)(diagramID);

  const remoteDiagramVariables = await client.diagram.findVariables(diagramID);

  if (!hasIdenticalMembers(remoteDiagramVariables, variables)) {
    await client.diagram.updateVariables(diagramID, variables);
  }
};

export const addVariableToDiagramAndSave = (diagramID: string, name: string): VariableSetThunk => (dispatch) => {
  dispatch(addVariableToDiagram(diagramID, name));
  // eslint-disable-next-line no-use-before-define
  dispatch(saveVariableSet(diagramID));
};

export const loadVariableSetForDiagram = (diagramID: string): VariableSetThunk<VariableSet> => async (dispatch) => {
  const variables = await client.diagram.findVariables(diagramID);
  dispatch(replaceVariableSetDiagram(diagramID, variables));

  return variables;
};

export const saveActiveDiagramVariables = (): VariableSetThunk => async (dispatch, getState) => {
  const diagramID = creatorDiagramIDSelector(getState());

  if (!diagramID) return;

  dispatch(saveVariableSet(diagramID));
};
