import { BlockType } from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { diagramIDParamSelector, nodeIDParamSelector } from '@/ducks/utils';
import { createCRUDSelectors } from '@/ducks/utils/crudV2';
import { isTopicDiagram } from '@/utils/diagram.utils';

import { STATE_KEY } from '../constants';

export const {
  all: allDiagramsSelector,
  map: diagramMapSelector,
  root: rootDiagramSelector,
  byID: diagramByIDSelector,
  byIDs: diagramsByIDsSelector,
  allIDs: allDiagramIDsSelector,
  getByID: getDiagramByIDSelector,
  getByIDs: getDiagramsByIDsSelector,
  hasByIDs: hasDiagramsByIDsSelector,
} = createCRUDSelectors(STATE_KEY);

export const isTopicDiagramSelector = createSelector([diagramByIDSelector], (diagram) => isTopicDiagram(diagram?.type));

export const sharedNodesSelector = createSelector([rootDiagramSelector], ({ sharedNodes }) => sharedNodes);

export const sharedNodeByDiagramIDAndNodeIDSelector = createSelector(
  [sharedNodesSelector, diagramIDParamSelector, nodeIDParamSelector],
  (sharedNodes, diagramID, nodeID) => (nodeID && diagramID && sharedNodes[diagramID]?.[nodeID]) || null
);

export const lastCreatedIDSelector = createSelector([rootDiagramSelector], ({ lastCreatedID }) => lastCreatedID);

export const sharedNodesStartIDSelector = createSelector(
  [sharedNodesSelector],
  (sharedNodes) => (diagramID: string) =>
    Object.values(sharedNodes[diagramID] || {})?.find((node) => node?.type === BlockType.START)?.nodeID ?? null
);

export const globalIntentStepMapSelector = createSelector(
  [rootDiagramSelector],
  ({ globalIntentStepMap }) => globalIntentStepMap
);
