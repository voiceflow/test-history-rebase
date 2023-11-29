import { BaseModels } from '@voiceflow/base-types';
import { BlockType } from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { createCRUDSelectors } from '@/ducks/utils/crudV2';

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

export const isTopicDiagramSelector = createSelector([diagramByIDSelector], (diagram) => diagram?.type === BaseModels.Diagram.DiagramType.TOPIC);

export const getRootTopicIDBySubtopicIDSelector = createSelector([allDiagramsSelector], (diagrams) => (diagramID: string | null) => {
  if (!diagramID) return null;

  for (const diagram of diagrams) {
    if (diagram.type !== BaseModels.Diagram.DiagramType.TOPIC) continue;

    for (const item of diagram.menuItems) {
      if (item.type !== BaseModels.Diagram.MenuItemType.DIAGRAM || item.sourceID !== diagramID) continue;

      return { subtopicID: diagramID, rootTopicID: diagram.id };
    }
  }

  return null;
});

export const localVariablesByDiagramIDSelector = createSelector([diagramByIDSelector], (diagram) => diagram?.variables || []);

export const sharedNodesSelector = createSelector([rootDiagramSelector], ({ sharedNodes }) => sharedNodes);

export const lastCreatedIDSelector = createSelector([rootDiagramSelector], ({ lastCreatedID }) => lastCreatedID);

export const sharedNodesStartIDSelector = createSelector(
  [sharedNodesSelector],
  (sharedNodes) => (diagramID: string) => Object.values(sharedNodes[diagramID] || {})?.find((node) => node?.type === BlockType.START)?.nodeID ?? null
);

export const globalIntentStepMapSelector = createSelector([rootDiagramSelector], ({ globalIntentStepMap }) => globalIntentStepMap);
