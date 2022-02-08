// eslint-disable-next-line lodash/import-scope
import _ from 'lodash';
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

export const selectedVariableStateId = createSelector([rootVariableStatesSelector], (variableStates) => variableStates?.selectedState?.id);

export const selectedVariableState = createSelector([rootVariableStatesSelector], (variableStates) => variableStates?.selectedState);

export const getSelectedVariableStateName = createSelector(
  [selectedVariableState, getVariableStateByIDSelector],
  (variableState, getById) => variableState?.id && getById({ id: variableState.id })?.name
);

export const createVariableList = (variables?: Record<string, VariableValue>): Variable[] =>
  variables
    ? _sortBy(
        Object.entries(variables).map(([name, value]): Variable => ({ name, value })),
        ({ name }) => name.toLowerCase()
      )
    : [];

export const selectAllProjectVariables = createSelector([Prototype.prototypeVariablesSelector], (prototypeVariables) => {
  return createVariableList(prototypeVariables);
});

export const selectedVariables = createSelector(
  [selectedVariableState, Prototype.prototypeVariablesSelector],
  (selectedVariableState, prototypeVariables) => {
    if (!selectedVariableState || selectedVariableState?.id === ALL_PROJECT_VARIABLES_ID) {
      return prototypeVariables;
    }

    return selectedVariableState.variables;
  }
);

export const selectedVariablesStateVariables = createSelector(
  [selectedVariableState, selectAllProjectVariables],
  (selectedVariableState, allProjectVariables) => {
    if (!selectedVariableState?.id) return [];

    if (selectedVariableState.id === ALL_PROJECT_VARIABLES_ID) {
      return allProjectVariables;
    }

    return createVariableList(selectedVariableState.variables);
  }
);

export const selectedVariableStateSavedState = createSelector(
  [selectedVariableStateId, getVariableStateByIDSelector],
  (selectedVariableStateID, getSavedStateByID) => selectedVariableStateID && getSavedStateByID({ id: selectedVariableStateID })
);

export const IsVariableStateUnsync = createSelector(
  [selectedVariableState, getVariableStateByIDSelector],
  (selectedVariableState, getVariableStateById) => {
    if (!selectedVariableState?.id || selectedVariableState.id === ALL_PROJECT_VARIABLES_ID) return false;

    const savedState = getVariableStateById({ id: selectedVariableState.id });

    if (!selectedVariableState.variables || !savedState?.variables) return false;

    return !_.isEqual(savedState.variables, selectedVariableState.variables);
  }
);
