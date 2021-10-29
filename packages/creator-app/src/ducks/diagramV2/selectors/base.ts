import { createSelector } from 'reselect';

import * as DiagramSelectorsV1 from '@/ducks/diagram/selectors';
import * as Feature from '@/ducks/feature';
import { createCRUDSelectors, idParamSelector, idsParamSelector } from '@/ducks/utils/crudV2';

import { STATE_KEY } from '../constants';

const {
  root: rootDiagramSelector,
  all: _allDiagramsSelector,
  allIDs: _allDiagramIDsSelector,
  map: _diagramMapSelector,
  byID: _diagramByIDSelector,
  getByID: _getDiagramByIDSelector,
  byIDs: _diagramsByIDsSelector,
  getByIDs: _getDiagramsByIDsSelector,
} = createCRUDSelectors(STATE_KEY);

export { rootDiagramSelector };

export const allDiagramsSelector = Feature.createAtomicActionsSelector([DiagramSelectorsV1.allDiagramsSelector, _allDiagramsSelector]);

export const allDiagramIDsSelector = Feature.createAtomicActionsSelector([DiagramSelectorsV1.allDiagramIDsSelector, _allDiagramIDsSelector]);

export const diagramMapSelector = Feature.createAtomicActionsSelector([DiagramSelectorsV1.diagramMapSelector, _diagramMapSelector]);

export const diagramByIDSelector = Feature.createAtomicActionsSelector(
  [DiagramSelectorsV1.diagramByIDSelector, _diagramByIDSelector, idParamSelector],
  (getDiagramV1, diagramV2, diagramID) => [diagramID ? getDiagramV1(diagramID) : null, diagramV2]
);

export const getDiagramByIDSelector = Feature.createAtomicActionsSelector([DiagramSelectorsV1.diagramByIDSelector, _getDiagramByIDSelector]);

export const diagramsByIDsSelector = Feature.createAtomicActionsSelector(
  [DiagramSelectorsV1.diagramsByIDsSelector, _diagramsByIDsSelector, idsParamSelector],
  (getDiagramsV1, diagramsV2, diagramIDs) => [getDiagramsV1(diagramIDs), diagramsV2]
);

export const getDiagramsByIDsSelector = Feature.createAtomicActionsSelector([DiagramSelectorsV1.diagramsByIDsSelector, _getDiagramsByIDsSelector]);

export const localVariablesByDiagramIDSelector = createSelector([diagramByIDSelector], (diagram) => diagram?.variables || []);

export const intentStepsSelector = createSelector([rootDiagramSelector], ({ intentSteps }) => intentSteps);
