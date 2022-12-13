import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReverter } from '@/ducks/utils';

import { addStep, removeNodePortRemapLinks } from '../utils';
import {
  buildLinkRecreateActions,
  createActiveDiagramReducer,
  createNodeIndexInvalidators,
  createNodePortRemapsInvalidators,
  createNodeRemovalInvalidators,
  DIAGRAM_INVALIDATORS,
} from './utils';

const insertStepReducer = createActiveDiagramReducer(
  Realtime.node.insertStep,
  (state, { parentNodeID, stepID, index, data, ports, nodePortRemaps }) => {
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

  ({ workspaceID, projectID, versionID, domainID, diagramID, parentNodeID, stepID, nodePortRemaps = [] }, getState) => {
    const ctx = { workspaceID, projectID, versionID, domainID, diagramID };
    const state = getState();

    return [
      Realtime.node.removeMany({ ...ctx, nodes: [{ parentNodeID, stepID }] }),
      ...nodePortRemaps.flatMap((portRemap) =>
        // only re-add links that have been removed
        portRemap.targetNodeID ? [] : buildLinkRecreateActions(state, ctx, portRemap)
      ),
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
  ]
);
