import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Draft } from 'immer';
import * as Normal from 'normal-store';

import { blockNodeDataFactory } from '@/ducks/creator/diagram/factories';

import { CreatorState } from '../types';
import { addNodeWithPorts } from '../utils';
import { appendStep } from './appendStep';
import { createActiveDiagramReducer } from './utils';

export const addBlock = (
  state: Draft<CreatorState>,
  { blockID, ports, coords, name }: { blockID: string; ports: Realtime.PortsDescriptor; coords: Realtime.Point; name: string }
): void => {
  state.blockIDs = Utils.array.append(state.blockIDs, blockID);

  state.coordsByNodeID[blockID] = coords;
  state.stepIDsByBlockID[blockID] = [];

  addNodeWithPorts(state, { nodeID: blockID, data: blockNodeDataFactory(blockID, { name }), ports });
};

const addBlockReducer = createActiveDiagramReducer(
  Realtime.node.addBlock,
  (state, { blockID, blockPorts, blockCoords, blockName, stepID, stepData, stepPorts }) => {
    if (Normal.hasOne(state.nodes, blockID)) return;
    if (Normal.hasOne(state.nodes, stepID)) return;

    addBlock(state, { blockID, ports: blockPorts, coords: blockCoords, name: blockName });
    appendStep(state, { blockID, stepID, data: stepData, ports: stepPorts });
  }
);

export default addBlockReducer;
