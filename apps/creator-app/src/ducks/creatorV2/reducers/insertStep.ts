import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReverter } from '@/ducks/utils';

import { addStep, removeManyNodes, removeNodePortRemapLinks } from '../utils';
import { removeManyNodesReverter } from './removeManyNodes';
import {
  buildLinkRecreateActions,
  createActiveDiagramReducer,
  createManyNodesRemovalInvalidators,
  createNodeIndexInvalidators,
  createNodePortRemapsInvalidators,
  createNodeRemovalInvalidators,
  DIAGRAM_INVALIDATORS,
} from './utils';

const insertStepReducer = createActiveDiagramReducer(
  Realtime.node.insertStep,
  (state, { parentNodeID, stepID, index, data, ports, nodePortRemaps = [], removeNodes }) => {
    const removeNodeIDs = removeNodes.map((node) => node.stepID ?? node.parentNodeID);

    removeManyNodes(state, removeNodeIDs);

    addStep(state, (stepIDs) => Utils.array.insert(stepIDs, index, stepID), {
      parentNodeID,
      stepID,
      data,
      ports,
    });

    removeNodePortRemapLinks(state, nodePortRemaps);
  }
);

export default insertStepReducer;

export const insertStepReverter = createReverter(
  Realtime.node.insertStep,

  ({ workspaceID, projectID, versionID, domainID, diagramID, parentNodeID, stepID, removeNodes, nodePortRemaps = [] }, getState) => {
    const ctx = { workspaceID, projectID, versionID, domainID, diagramID };
    const state = getState();

    const removeActions =
      removeManyNodesReverter.revert({ workspaceID, projectID, versionID, domainID, diagramID, nodes: removeNodes }, getState) ?? [];

    return [
      Realtime.node.removeMany({ ...ctx, nodes: [{ parentNodeID, stepID }] }),
      ...nodePortRemaps.flatMap((portRemap) =>
        // only re-add links that have been removed
        portRemap.targetNodeID ? [] : buildLinkRecreateActions(state, ctx, portRemap)
      ),
      ...(Array.isArray(removeActions) ? removeActions : [removeActions]),
    ];
  },

  [
    ...DIAGRAM_INVALIDATORS,
    ...createNodeRemovalInvalidators<Realtime.node.InsertStepPayload>((origin, nodeID) => origin.parentNodeID === nodeID),
    ...createNodeIndexInvalidators<Realtime.node.InsertStepPayload>(({ parentNodeID, index }) => ({ parentNodeID, index })),
    ...createNodePortRemapsInvalidators<Realtime.node.InsertStepPayload>(({ parentNodeID, nodePortRemaps = [] }) => ({
      parentNodeID,
      nodePortRemaps,
    })),
    ...createManyNodesRemovalInvalidators<Realtime.node.InsertStepPayload>((origin) => origin.removeNodes),
  ]
);
