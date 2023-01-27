import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReverter } from '@/ducks/utils';

import { stepIDsByParentNodeIDSelector } from '../selectors';
import { removeNodePortRemapLinks } from '../utils';
import {
  buildLinkRecreateActions,
  createActiveDiagramReducer,
  createNodeIndexInvalidators,
  createNodePortRemapsInvalidators,
  createNodeRemovalInvalidators,
  DIAGRAM_INVALIDATORS,
} from './utils';

const reorderStepsReducer = createActiveDiagramReducer(
  Realtime.node.reorderSteps,
  (state, { parentNodeID, stepID, index: toIndex, nodePortRemaps }) => {
    if (!Normal.hasMany(state.nodes, [parentNodeID, stepID])) return;

    const stepIDs = state.stepIDsByParentNodeID[parentNodeID] ?? [];
    const fromIndex = stepIDs.indexOf(stepID);

    state.stepIDsByParentNodeID[parentNodeID] = Utils.array.reorder(stepIDs, fromIndex, toIndex);

    removeNodePortRemapLinks(state, nodePortRemaps);
  }
);

export default reorderStepsReducer;

export const reorderStepsReverter = createReverter(
  Realtime.node.reorderSteps,

  ({ workspaceID, projectID, versionID, domainID, diagramID, parentNodeID, stepID, nodePortRemaps = [] }, getState) => {
    const ctx = { workspaceID, projectID, versionID, domainID, diagramID };
    const state = getState();
    const index = stepIDsByParentNodeIDSelector(state, { id: parentNodeID }).indexOf(stepID);

    return [
      Realtime.node.reorderSteps({ ...ctx, parentNodeID, stepID, index, nodePortRemaps: [] }),
      ...nodePortRemaps.flatMap((portRemap) =>
        // only re-add links that have been removed
        portRemap.targetNodeID ? [] : buildLinkRecreateActions(state, ctx, portRemap)
      ),
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
  ]
);
