import _isEqual from 'lodash/isEqual';
import _sortBy from 'lodash/sortBy';
import { createSelector } from 'reselect';

import { BlockType } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import { createCRUDSelectors } from '@/ducks/utils/crudV2';
import { Variable, VariableValue } from '@/models';

import { ALL_PROJECT_VARIABLES_ID, STATE_KEY } from './constants';

export const {
  root: rootVariableStatesSelector,
  map: mapVariableStatesSelector,
  all: allVariableStatesSelector,
  byID: variableStateByIDSelector,
  getByID: getVariableStateByIDSelector,
} = createCRUDSelectors(STATE_KEY);

export const selectedVariableStateSelector = createSelector([rootVariableStatesSelector], (variableStates) => variableStates?.selectedState || null);

export const selectedVariableStateIDSelector = createSelector(
  [selectedVariableStateSelector],
  (selectedVariableState) => selectedVariableState?.id ?? null
);

export const isVariableStateSelected = createSelector(
  [selectedVariableStateIDSelector],
  (selectedVariableStateID) => selectedVariableStateID && selectedVariableStateID !== ALL_PROJECT_VARIABLES_ID
);

export const getSelectedVariableStateNameSelector = createSelector(
  [selectedVariableStateSelector, getVariableStateByIDSelector],
  (variableState, getById) => variableState?.id && getById({ id: variableState.id })?.name
);

export const getSelectedVariableStateSelector = createSelector(
  [selectedVariableStateSelector, getVariableStateByIDSelector],
  (variableState, getById) => variableState?.id && getById({ id: variableState.id })
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

export const selectedVariablesSelector = createSelector([selectedVariableStateSelector], (selectedVariableState) => {
  if (!selectedVariableState) return null;
  return selectedVariableState.variables;
});

export const selectedStartFromNodeIDSelector = createSelector(
  [selectedVariableStateSelector, CreatorV2.getNodeByIDSelector],
  (selectedVariableState, getNodeByIDSelector) => {
    if (!selectedVariableState?.startFrom) return null;

    const stepID = selectedVariableState?.startFrom?.stepID;

    const node = getNodeByIDSelector({ id: stepID });
    if (node?.type === BlockType.COMBINED) {
      return node.combinedNodes[0];
    }

    return stepID;
  }
);

export const selectedStartFromDiagramIDSelector = createSelector([selectedVariableStateSelector], (selectedVariableState) => {
  if (!selectedVariableState?.startFrom) return null;
  return selectedVariableState?.startFrom?.diagramID || null;
});

export const selectedVariablesStateVariablesSelector = createSelector([selectedVariableStateSelector], (selectedVariableState) => {
  if (!selectedVariableState) return [];
  return createVariableList(selectedVariableState.variables);
});

export const selectedVariableStateSavedStateSelector = createSelector(
  [selectedVariableStateIDSelector, getVariableStateByIDSelector],
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
