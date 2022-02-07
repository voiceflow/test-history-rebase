import _sortBy from 'lodash/sortBy';
import { createSelector } from 'reselect';

import * as Prototype from '@/ducks/prototype';
import { createCurriedSelector } from '@/ducks/utils';
import { createCRUDSelectors } from '@/ducks/utils/crudV2';
import { Variable, VariableValue } from '@/models';

import { ALL_PROJECT_VARIABLES_ID, STATE_KEY } from './constants';

export const {
  root: rootVariableStatesSelector,
  map: mapVariableStatesSelector,
  all: allVariableStatesSelector,
  byID: variableStateByIDSelector,
} = createCRUDSelectors(STATE_KEY);

export const getVariableStateByIDSelector = createCurriedSelector(variableStateByIDSelector);

export const selectedVariableStateId = createSelector([rootVariableStatesSelector], (variableStates) => variableStates?.selectedID);

export const createVariableList = (variables?: Record<string, VariableValue>): Variable[] =>
  variables
    ? _sortBy(
        Object.entries(variables).map(([name, value]): Variable => ({ name, value })),
        ({ name }) => name.toLowerCase()
      )
    : [];

export const selectAllProjectVariables = createSelector([Prototype.prototypeVariablesSelector], (prototypeVariables) =>
  createVariableList(prototypeVariables)
);

export const selectedVariablesStateVariables = createSelector(
  [selectedVariableStateId, createCurriedSelector(variableStateByIDSelector), selectAllProjectVariables],
  (variableStateId, variableStatesById, allProjectVariables) => {
    if (variableStateId === ALL_PROJECT_VARIABLES_ID) {
      return allProjectVariables;
    }

    return createVariableList(variableStatesById({ id: variableStateId })?.variables) ?? [];
  }
);
