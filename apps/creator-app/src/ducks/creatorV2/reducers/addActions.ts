import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Draft } from 'immer';
import * as Normal from 'normal-store';

import { nodeDataFactory } from '@/ducks/creatorV2/utils/node';
import { createReverter } from '@/ducks/utils';

import { CreatorState } from '../types';
import { addNodeWithPorts, addStep } from '../utils';
import { createActiveDiagramReducer, DIAGRAM_INVALIDATORS } from './utils';

export const addActions = (
  state: Draft<CreatorState>,
  { ports, coords, actionsID }: { actionsID: string; ports: Realtime.PortsDescriptor; coords: Realtime.Point }
): void => {
  state.actionsIDs = Utils.array.append(state.actionsIDs, actionsID);

  state.coordsByNodeID[actionsID] = coords;
  state.stepIDsByParentNodeID[actionsID] = [];

  addNodeWithPorts(state, {
    nodeID: actionsID,
    data: nodeDataFactory(actionsID, { type: Realtime.BlockType.ACTIONS, name: 'Actions' }),
    ports,
  });
};

const addActionsReducer = createActiveDiagramReducer(
  Realtime.node.addActions,
  (state, { actionsID, actionsPorts, actionsCoords, stepID, stepData, stepPorts }) => {
    if (Normal.hasOne(state.nodes, actionsID)) return;
    if (Normal.hasOne(state.nodes, stepID)) return;

    addActions(state, { actionsID, ports: actionsPorts, coords: actionsCoords });
    addStep(state, (stepIDs) => Utils.array.append(stepIDs, stepID), {
      parentNodeID: actionsID,
      stepID,
      data: stepData,
      ports: stepPorts,
    });
  }
);

export default addActionsReducer;

export const addActionsReverted = createReverter(
  Realtime.node.addActions,

  ({ workspaceID, projectID, versionID, diagramID, actionsID, stepID }) =>
    Realtime.node.removeMany({
      workspaceID,
      projectID,
      versionID,
      diagramID,
      nodes: [{ parentNodeID: actionsID }, { parentNodeID: actionsID, stepID }],
    }),

  DIAGRAM_INVALIDATORS
);
