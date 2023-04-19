import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReverter } from '@/ducks/utils';

import { stepIDsByParentNodeIDSelector } from '../selectors';
import { removeManyNodes, removeNodePortRemapLinks } from '../utils';
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

const reorderStepsReducer = createActiveDiagramReducer(
  Realtime.node.reorderSteps,
  (state, { parentNodeID, stepID, index: toIndex, removeNodes, nodePortRemaps = [] }) => {
    if (!Normal.hasMany(state.nodes, [parentNodeID, stepID])) return;

    const removeNodeIDs = removeNodes.map((node) => node.stepID ?? node.parentNodeID);

    removeManyNodes(state, removeNodeIDs);

    const stepIDs = state.stepIDsByParentNodeID[parentNodeID] ?? [];
    const fromIndex = stepIDs.indexOf(stepID);

    state.stepIDsByParentNodeID[parentNodeID] = Utils.array.reorder(stepIDs, fromIndex, toIndex);

    removeNodePortRemapLinks(state, nodePortRemaps);
  }
);

export default reorderStepsReducer;

export const reorderStepsReverter = createReverter(
  Realtime.node.reorderSteps,

  ({ workspaceID, projectID, versionID, domainID, diagramID, parentNodeID, stepID, removeNodes, nodePortRemaps = [] }, getState) => {
    const ctx = { workspaceID, projectID, versionID, domainID, diagramID };
    const state = getState();
    const index = stepIDsByParentNodeIDSelector(state, { id: parentNodeID }).indexOf(stepID);

    const removeActions =
      removeManyNodesReverter.revert({ workspaceID, projectID, versionID, domainID, diagramID, nodes: removeNodes }, getState) ?? [];

    return [
      Realtime.node.reorderSteps({ ...ctx, parentNodeID, stepID, index, removeNodes: [], nodePortRemaps: [] }),

      ...nodePortRemaps.flatMap((portRemap) =>
        // only re-add links that have been removed
        portRemap.targetNodeID ? [] : buildLinkRecreateActions(state, ctx, portRemap)
      ),

      ...(Array.isArray(removeActions) ? removeActions : [removeActions]),
    ];
  },

  [
    ...DIAGRAM_INVALIDATORS,
    ...createNodeRemovalInvalidators<Realtime.node.ReorderStepsPayload>((origin, nodeID) => origin.parentNodeID === nodeID),
    ...createNodeIndexInvalidators<Realtime.node.ReorderStepsPayload>(({ parentNodeID, index }) => ({ parentNodeID, index })),
    ...createNodePortRemapsInvalidators<Realtime.node.ReorderStepsPayload>(({ parentNodeID, nodePortRemaps = [] }) => ({
      parentNodeID,
      nodePortRemaps,
    })),
    ...createManyNodesRemovalInvalidators<Realtime.node.ReorderStepsPayload>((origin) => origin.removeNodes),
  ]
);
