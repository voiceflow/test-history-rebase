import _isEqual from 'lodash/isEqual';
import _sortBy from 'lodash/sortBy';
import { createSelector } from 'reselect';

import * as CreatorV2 from '@/ducks/creatorV2';
import { prototypeVariablesSelector } from '@/ducks/prototype/selectors';
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

export const selectedVariableStateIdSelector = createSelector([rootVariableStatesSelector], (variableStates) => variableStates?.selectedState?.id);

export const isVariableStateSelected = createSelector(
  [selectedVariableStateIdSelector],
  (selectedVariableStateId) => selectedVariableStateId && selectedVariableStateId !== ALL_PROJECT_VARIABLES_ID
);

export const selectedVariableStateSelector = createSelector([rootVariableStatesSelector], (variableStates) => variableStates?.selectedState);

export const getSelectedVariableStateNameSelector = createSelector(
  [selectedVariableStateSelector, getVariableStateByIDSelector],
  (variableState, getById) => variableState?.id && getById({ id: variableState.id })?.name
);

export const selectedVariableStateProjectIDSelector = createSelector(
  [selectedVariableStateSelector, getVariableStateByIDSelector],
  (variableState, getById) => variableState?.id && getById({ id: variableState.id })?.projectID
);

export const createVariableList = (variables?: Record<string, VariableValue>): Variable[] =>
  variables
    ? _sortBy(
        Object.entries(variables).map(([name, value]): Variable => ({ name, value })),
        ({ name }) => name.toLowerCase()
      )
    : [];

export const selectAllProjectVariablesSelector = createSelector([prototypeVariablesSelector], (prototypeVariables) => {
  return createVariableList(prototypeVariables);
});

export const selectedVariablesSelector = createSelector([selectedVariableStateSelector], (selectedVariableState) => {
  if (!selectedVariableState || selectedVariableState.id === ALL_PROJECT_VARIABLES_ID) return null;
  return selectedVariableState.variables;
});

export const selectedStartFromNodeIDSelector = createSelector(
  [selectedVariableStateIdSelector, getVariableStateByIDSelector, CreatorV2.getNodeByIDSelector],
  (selectedVariableStateID, getByID, getNodeByIDSelector) => {
    if (!selectedVariableStateID) return null;

    const selectedVariableState = getByID({ id: selectedVariableStateID });

    if (!selectedVariableState?.startFrom) return null;

    // The selected node block contains visual data. Start from first node step id in order to get the correct node.
    return getNodeByIDSelector({ id: selectedVariableState.startFrom?.stepID })?.combinedNodes[0] ?? null;
  }
);

export const selectedStartFromDiagramIDSelector = createSelector(
  [selectedVariableStateIdSelector, getVariableStateByIDSelector],
  (selectedVariableStateID, getByID) => {
    if (!selectedVariableStateID) return null;

    const selectedVariableState = getByID({ id: selectedVariableStateID });

    if (!selectedVariableState?.startFrom) return null;

    return selectedVariableState?.startFrom?.diagramID || null;
  }
);

export const selectedVariablesStateVariablesSelector = createSelector(
  [selectedVariableStateSelector, selectAllProjectVariablesSelector],
  (selectedVariableState, allProjectVariables) => {
    if (!selectedVariableState?.id) return [];

    if (selectedVariableState.id === ALL_PROJECT_VARIABLES_ID) {
      return allProjectVariables;
    }

    return createVariableList(selectedVariableState.variables);
  }
);

export const selectedVariableStateSavedStateSelector = createSelector(
  [selectedVariableStateIdSelector, getVariableStateByIDSelector],
  (selectedVariableStateID, getSavedStateByID) => selectedVariableStateID && getSavedStateByID({ id: selectedVariableStateID })
);

export const IsVariableStateUnsyncSelector = createSelector(
  [selectedVariableStateSelector, getVariableStateByIDSelector],
  (selectedVariableState, getVariableStateById) => {
    if (!selectedVariableState?.id || selectedVariableState.id === ALL_PROJECT_VARIABLES_ID) return false;

    const savedState = getVariableStateById({ id: selectedVariableState.id });

    if (!selectedVariableState.variables || !savedState?.variables) return false;

    return !_isEqual(savedState.variables, selectedVariableState.variables);
  }
);
