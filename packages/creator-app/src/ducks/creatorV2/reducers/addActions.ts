import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Draft } from 'immer';
import * as Normal from 'normal-store';

import { blockNodeDataFactory } from '@/ducks/creator/diagram/factories';

import { CreatorState } from '../types';
import { addNodeWithPorts, addStep } from '../utils';
import { createActiveDiagramReducer } from './utils';

export const addActions = (
  state: Draft<CreatorState>,
  { ports, coords, actionsID }: { actionsID: string; ports: Realtime.PortsDescriptor; coords: Realtime.Point }
): void => {
  state.actionsIDs = Utils.array.append(state.actionsIDs, actionsID);

  state.coordsByNodeID[actionsID] = coords;
  state.stepIDsByParentNodeID[actionsID] = [];

  addNodeWithPorts(state, { nodeID: actionsID, data: blockNodeDataFactory(actionsID), ports });
};

const addActionsReducer = createActiveDiagramReducer(
  Realtime.node.addActions,
  (state, { actionsID, actionsPorts, actionsCoords, stepID, stepData, stepPorts }) => {
    if (Normal.hasOne(state.nodes, actionsID)) return;
    if (Normal.hasOne(state.nodes, stepID)) return;

    addActions(state, { actionsID, ports: actionsPorts, coords: actionsCoords });
    addStep(state, (stepIDs) => Utils.array.append(stepIDs, stepID), { parentNodeID: actionsID, stepID, data: stepData, ports: stepPorts });
  }
);

export default addActionsReducer;
