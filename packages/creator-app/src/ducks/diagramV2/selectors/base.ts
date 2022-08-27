import { createSelector } from 'reselect';

import { createCurriedSelector } from '@/ducks/utils';
import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from '../constants';

export const {
  all: allDiagramsSelector,
  map: diagramMapSelector,
  root: rootDiagramSelector,
  byID: diagramByIDSelector,
  byIDs: diagramsByIDsSelector,
  allIDs: allDiagramIDsSelector,
  hasByIDs: hasDiagramsByIDsSelector,
} = createCRUDSelectors(STATE_KEY);

export const getDiagramByIDSelector = createCurriedSelector(diagramByIDSelector);

export const getDiagramsByIDsSelector = createCurriedSelector(diagramsByIDsSelector);

export const localVariablesByDiagramIDSelector = createSelector([diagramByIDSelector], (diagram) => diagram?.variables || []);

export const sharedNodesSelector = createSelector([rootDiagramSelector], ({ sharedNodes }) => sharedNodes);

export const globalIntentStepMapSelector = createSelector([rootDiagramSelector], ({ globalIntentStepMap }) => globalIntentStepMap);
