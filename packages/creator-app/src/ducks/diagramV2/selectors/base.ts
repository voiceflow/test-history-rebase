import { createSelector } from 'reselect';

import * as DiagramSelectorsV1 from '@/ducks/diagram/selectors';
import * as Feature from '@/ducks/feature';
import { createCurriedSelector } from '@/ducks/utils';
import { createCRUDSelectors, idParamSelector, idsParamSelector } from '@/ducks/utils/crudV2';

import { STATE_KEY } from '../constants';

const {
  root: rootDiagramSelector,
  all: _allDiagramsSelector,
  allIDs: _allDiagramIDsSelector,
  map: _diagramMapSelector,
  hasByIDs: _hasDiagramsByIDsSelector,
  byID: _diagramByIDSelector,
  byIDs: _diagramsByIDsSelector,
} = createCRUDSelectors(STATE_KEY);

export { rootDiagramSelector };

export const allDiagramsSelector = Feature.createAtomicActionsSelector([DiagramSelectorsV1.allDiagramsSelector, _allDiagramsSelector]);

export const allDiagramIDsSelector = Feature.createAtomicActionsSelector([DiagramSelectorsV1.allDiagramIDsSelector, _allDiagramIDsSelector]);

export const diagramMapSelector = Feature.createAtomicActionsSelector([DiagramSelectorsV1.diagramMapSelector, _diagramMapSelector]);

export const diagramByIDSelector = Feature.createAtomicActionsSelector(
  [DiagramSelectorsV1.diagramByIDSelector, _diagramByIDSelector, idParamSelector],
  (getDiagramV1, diagramV2, diagramID) => [diagramID ? getDiagramV1(diagramID) : null, diagramV2]
);

export const getDiagramByIDSelector = createCurriedSelector(diagramByIDSelector);

export const hasDiagramsByIDsSelector = Feature.createAtomicActionsPhase2Selector(
  [DiagramSelectorsV1.diagramByIDSelector, _hasDiagramsByIDsSelector, idsParamSelector],
  (getDiagramV1, hasDiagramsV2, diagramIDs) => [diagramIDs.every((diagramID) => !!getDiagramV1(diagramID)), hasDiagramsV2]
);

export const diagramsByIDsSelector = Feature.createAtomicActionsSelector(
  [DiagramSelectorsV1.diagramsByIDsSelector, _diagramsByIDsSelector, idsParamSelector],
  (getDiagramsV1, diagramsV2, diagramIDs) => [getDiagramsV1(diagramIDs), diagramsV2]
);

export const getDiagramsByIDsSelector = createCurriedSelector(diagramsByIDsSelector);

export const localVariablesByDiagramIDSelector = createSelector([diagramByIDSelector], (diagram) => diagram?.variables || []);

export const intentStepsSelector = createSelector([rootDiagramSelector], ({ intentSteps }) => intentSteps);

export const globalIntentStepMapSelector = createSelector([rootDiagramSelector], ({ globalIntentStepMap }) => globalIntentStepMap);
