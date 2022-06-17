import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReverter } from '@/ducks/utils';

import { stepIDsByBlockIDSelector } from '../selectors';
import { removeNodePortRemapLinks } from '../utils';
import {
  buildLinkRecreateActions,
  createActiveDiagramReducer,
  createNodeIndexInvalidators,
  createNodePortRemapsInvalidators,
  createNodeRemovalInvalidators,
  DIAGRAM_INVALIDATORS,
} from './utils';

const reorderStepsReducer = createActiveDiagramReducer(Realtime.node.reorderSteps, (state, { blockID, stepID, index: toIndex, nodePortRemaps }) => {
  if (!Normal.hasMany(state.nodes, [blockID, stepID])) return;

  const stepIDs = state.stepIDsByBlockID[blockID] ?? [];
  const fromIndex = stepIDs.indexOf(stepID);
  if (fromIndex === -1) return;

  state.stepIDsByBlockID[blockID] = Utils.array.reorder(stepIDs, fromIndex, toIndex);

  removeNodePortRemapLinks(state, nodePortRemaps);
});

export default reorderStepsReducer;

export const reorderStepsReverter = createReverter(
  Realtime.node.reorderSteps,

  ({ workspaceID, projectID, versionID, diagramID, blockID, stepID, nodePortRemaps = [] }, getState) => {
    const ctx = { workspaceID, projectID, versionID, diagramID };
    const state = getState();
    const index = stepIDsByBlockIDSelector(state, { id: blockID }).indexOf(stepID);

    return [
      Realtime.node.reorderSteps({ ...ctx, blockID, stepID, index, nodePortRemaps: [] }),
      ...nodePortRemaps.flatMap((portRemap) =>
        // only re-add links that have been removed
        portRemap.targetNodeID ? [] : buildLinkRecreateActions(state, ctx, portRemap)
      ),
    ];
  },

  [
    ...DIAGRAM_INVALIDATORS,
    ...createNodeRemovalInvalidators<Realtime.node.ReorderStepsPayload>((origin, nodeID) => origin.blockID === nodeID),
    ...createNodeIndexInvalidators<Realtime.node.ReorderStepsPayload>(({ blockID, index }) => ({ blockID, index })),
    ...createNodePortRemapsInvalidators<Realtime.node.ReorderStepsPayload>(({ blockID, nodePortRemaps = [] }) => ({ blockID, nodePortRemaps })),
  ]
);
