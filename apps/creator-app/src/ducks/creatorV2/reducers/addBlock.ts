import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import type { Draft } from 'immer';
import * as Normal from 'normal-store';

import { blockNodeDataFactory } from '@/ducks/creatorV2/utils/node';
import { createReverter } from '@/ducks/utils';

import type { CreatorState } from '../types';
import { addNodeWithPorts, addStep } from '../utils';
import { createActiveDiagramReducer, DIAGRAM_INVALIDATORS } from './utils';

export const addBlock = (
  state: Draft<CreatorState>,
  {
    blockID,
    ports,
    coords,
    name,
    blockColor = '',
  }: { blockID: string; ports: Realtime.PortsDescriptor; coords: Realtime.Point; name: string; blockColor?: string }
): void => {
  state.blockIDs = Utils.array.append(state.blockIDs, blockID);

  state.coordsByNodeID[blockID] = coords;
  state.stepIDsByParentNodeID[blockID] = [];

  addNodeWithPorts(state, { nodeID: blockID, data: blockNodeDataFactory(blockID, { name, blockColor }), ports });
};

const addBlockReducer = createActiveDiagramReducer(
  Realtime.node.addBlock,
  (state, { blockID, blockPorts, blockCoords, blockName, blockColor = '', stepID, stepData, stepPorts }) => {
    if (Normal.hasOne(state.nodes, blockID)) return;
    if (Normal.hasOne(state.nodes, stepID)) return;

    addBlock(state, { blockID, ports: blockPorts, coords: blockCoords, name: blockName, blockColor });
    addStep(state, (stepIDs) => Utils.array.append(stepIDs, stepID), {
      parentNodeID: blockID,
      stepID,
      data: stepData,
      ports: stepPorts,
    });
  }
);

export default addBlockReducer;

export const addBlockReverter = createReverter(
  Realtime.node.addBlock,

  ({ workspaceID, projectID, versionID, diagramID, blockID, stepID }) =>
    Realtime.node.removeMany({
      workspaceID,
      projectID,
      versionID,
      diagramID,
      nodes: [{ parentNodeID: blockID }, { parentNodeID: blockID, stepID }],
    }),

  DIAGRAM_INVALIDATORS
);
