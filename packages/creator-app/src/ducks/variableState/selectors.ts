import _sortBy from 'lodash/sortBy';
import { createSelector } from 'reselect';

import * as Prototype from '@/ducks/prototype';
import { createCRUDSelectors } from '@/ducks/utils/crud';
import { Variable, VariableValue } from '@/models';

import { ALL_PROJECT_VARIABLES_ID, STATE_KEY } from './constants';

export const {
  root: rootVariableStatesSelector,
  map: mapVariableStatesSelector,
  all: allVariableStatesSelector,
  byID: variableStateByIDSelector,
  findByIDs: variableStatesByIDsSelector,
  has: hasVariableStatesSelector,
} = createCRUDSelectors(STATE_KEY);

export const selectedVariableStateId = createSelector([rootVariableStatesSelector], (variableStates) => variableStates?.selectedID);

export const createVariableList = (variables: Record<string, VariableValue>): Variable[] =>
  _sortBy(
    Object.entries(variables).map(([name, value]): Variable => ({ name, value })),
    ({ name }) => name.toLowerCase()
  );

export const selectAllProjectVariables = createSelector([Prototype.prototypeVariablesSelector], (prototypeVariables) =>
  createVariableList(prototypeVariables)
);
export const selectedVariablesStateVariables = createSelector(
  [selectedVariableStateId, variableStateByIDSelector, selectAllProjectVariables],
  (variableStateId, variableStatesById, allProjectVariables) => {
    if (variableStateId === ALL_PROJECT_VARIABLES_ID) {
      return allProjectVariables;
    }
    return variableStateId ? createVariableList(variableStatesById(variableStateId)?.variables) : [];
  }
);
