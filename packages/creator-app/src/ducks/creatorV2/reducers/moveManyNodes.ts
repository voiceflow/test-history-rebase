import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReverter } from '@/ducks/utils';
import { isPointEqual } from '@/utils/geometry';

import { nodeCoordsByIDSelector } from '../selectors';
import { createActiveDiagramReducer, createDiagramInvalidator, createNodeRemovalInvalidators, DIAGRAM_INVALIDATORS } from './utils';

const moveManyNodesReducer = createActiveDiagramReducer(Realtime.node.moveMany, (state, { blocks }) => {
  Object.entries(blocks).forEach(([nodeID, coords]) => {
    if (!Utils.object.hasProperty(state.coordsByNodeID, nodeID)) return;

    state.coordsByNodeID[nodeID] = coords;
  });
});

export default moveManyNodesReducer;

export const moveManyNodesReverter = createReverter(
  Realtime.node.moveMany,
  ({ workspaceID, projectID, versionID, domainID, diagramID, blocks }, getState) => {
    const state = getState();
    const prevCoords = Object.keys(blocks)
      .map((nodeID): [string, Realtime.Point | null] => [nodeID, nodeCoordsByIDSelector(state, { id: nodeID })])
      .filter((blockEntries): blockEntries is [string, Realtime.Point] => {
        const [nodeID, coords] = blockEntries;

        return !!coords && !isPointEqual(coords, blocks[nodeID]);
      });

    if (prevCoords.length === 0) return null;

    return Realtime.node.moveMany({ workspaceID, projectID, versionID, domainID, diagramID, blocks: Object.fromEntries(prevCoords) });
  },

  [
    ...DIAGRAM_INVALIDATORS,
    ...createNodeRemovalInvalidators<Realtime.node.TranslatePayload>((origin, nodeID) => !!origin.blocks[nodeID]),
    createDiagramInvalidator(Realtime.node.moveMany, (origin, subject) => Object.keys(origin.blocks).some((nodeID) => !!subject.blocks[nodeID])),
  ]
);
