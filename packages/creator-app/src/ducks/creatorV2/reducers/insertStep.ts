import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReverter } from '@/ducks/utils';

import { addStep, removeNodePortRemapLinks } from '../utils';
import {
  buildLinkRecreateActions,
  createActiveDiagramReducer,
  createDiagramInvalidator,
  createNodeRemovalInvalidators,
  DIAGRAM_INVALIDATORS,
  remapsTargetSamePorts,
} from './utils';

const insertStepReducer = createActiveDiagramReducer(Realtime.node.insertStep, (state, { blockID, stepID, index, data, ports, nodePortRemaps }) => {
  addStep(state, (stepIDs) => Utils.array.insert(stepIDs, index, stepID), {
    blockID,
    stepID,
    data,
    ports,
  });
  removeNodePortRemapLinks(state, nodePortRemaps);
});

export default insertStepReducer;

export const insertStepReverter = createReverter(
  Realtime.node.insertStep,

  ({ workspaceID, projectID, versionID, diagramID, blockID, stepID, nodePortRemaps = [] }, getState) => {
    const ctx = { workspaceID, projectID, versionID, diagramID };
    const state = getState();

    return [
      Realtime.node.removeMany({ ...ctx, nodes: [{ blockID, stepID }] }),
      ...nodePortRemaps.flatMap((portRemap) =>
        // only re-add links that have been removed
        portRemap.targetNodeID ? [] : buildLinkRecreateActions(state, ctx, portRemap)
      ),
    ];
  },

  [
    ...DIAGRAM_INVALIDATORS,
    ...createNodeRemovalInvalidators<Realtime.node.InsertStepPayload>((origin, nodeID) => origin.blockID === nodeID),
    createDiagramInvalidator(Realtime.node.insertStep, (origin, subject) => remapsTargetSamePorts(origin.nodePortRemaps, subject.nodePortRemaps)),
    createDiagramInvalidator(Realtime.node.isolateSteps, (origin, subject) => !!subject.removeSource && origin.blockID === subject.sourceBlockID),
    createDiagramInvalidator(
      Realtime.node.transplantSteps,
      (origin, subject) =>
        (!!subject.removeSource && origin.blockID === subject.sourceBlockID) || remapsTargetSamePorts(origin.nodePortRemaps, subject.nodePortRemaps)
    ),
    createDiagramInvalidator(Realtime.node.reorderSteps, (origin, subject) => remapsTargetSamePorts(origin.nodePortRemaps, subject.nodePortRemaps)),
    createDiagramInvalidator(
      Realtime.link.patchMany,
      (origin, subject) =>
        !!origin.nodePortRemaps?.some((portRemap) => portRemap.ports.some((port) => subject.patches.some((patch) => patch.portID === port.portID)))
    ),
  ]
);
