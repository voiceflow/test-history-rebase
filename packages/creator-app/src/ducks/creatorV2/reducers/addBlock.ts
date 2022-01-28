import * as Realtime from '@realtime-sdk';
import { Utils } from '@voiceflow/common';
import { Draft } from 'immer';
import * as Normal from 'normal-store';

import { blockNodeDataFactory } from '@/ducks/creator/diagram/factories';

import { CreatorState } from '../types';
import { addNodeWithPorts } from '../utils';
import { appendStep } from './appendStep';
import { createActiveDiagramReducer } from './utils';

export const addBlock = (
  state: Draft<CreatorState>,
  { blockID, ports, origin }: { blockID: string; ports: Realtime.PortsDescriptor; origin: Realtime.Point }
): void => {
  state.blockIDs = Utils.array.append(state.blockIDs, blockID);

  state.originByNodeID[blockID] = origin;
  state.stepIDsByBlockID[blockID] = [];

  addNodeWithPorts(state, { nodeID: blockID, data: blockNodeDataFactory(blockID), ports });
};

const addBlockReducer = createActiveDiagramReducer(
  Realtime.node.addBlock,
  (state, { blockID, blockPorts, blockOrigin, stepID, stepData, stepPorts }) => {
    if (Normal.hasOne(state.nodes, blockID)) return;
    if (Normal.hasOne(state.nodes, stepID)) return;

    addBlock(state, { blockID, ports: blockPorts, origin: blockOrigin });
    appendStep(state, { blockID, stepID, data: stepData, ports: stepPorts });
  }
);

export default addBlockReducer;
