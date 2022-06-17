import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReverter } from '@/ducks/utils';

import { blockIDByStepIDSelector, linksByPortIDSelector } from '../selectors';
import { addStep, removeNodePortRemapLinks } from '../utils';
import {
  createActiveDiagramReducer,
  createDiagramInvalidator,
  createNodeRemovalInvalidators,
  DIAGRAM_INVALIDATORS,
  remapTargetsSamePorts,
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

  ({ workspaceID, projectID, versionID, diagramID, blockID, stepID, nodePortRemaps }, getState) => {
    const ctx = { workspaceID, projectID, versionID, diagramID };
    const state = getState();

    return [
      Realtime.node.removeMany({ ...ctx, nodes: [{ blockID, stepID }] }),
      ...(nodePortRemaps?.flatMap((portRemap) =>
        // only re-add links that have been removed
        portRemap.targetNodeID
          ? []
          : portRemap.ports.flatMap((port) => {
              const links = linksByPortIDSelector(state, { id: port.portID });

              return links.map((link) => {
                const payload = {
                  ...ctx,
                  sourceBlockID: blockIDByStepIDSelector(state, { id: portRemap.nodeID }),
                  sourceNodeID: portRemap.nodeID,
                  sourcePortID: port.portID,
                  targetNodeID: link.target.nodeID,
                  targetPortID: link.target.portID,
                  linkID: link.id,
                };

                if (port.key) {
                  return Realtime.link.addByKey({ ...payload, key: port.key });
                }

                if (port.type) {
                  return Realtime.link.addBuiltin({ ...payload, type: port.type as BaseModels.PortType });
                }

                return Realtime.link.addDynamic(payload);
              });
            })
      ) ?? []),
    ];
  },

  [
    ...DIAGRAM_INVALIDATORS,
    ...createNodeRemovalInvalidators<Realtime.node.InsertStepPayload>((origin, nodeID) => origin.blockID === nodeID),
    createDiagramInvalidator(Realtime.node.insertStep, (origin, subject) => remapTargetsSamePorts(origin.nodePortRemaps, subject.nodePortRemaps)),
    createDiagramInvalidator(
      Realtime.node.transplantSteps,
      (origin, subject) =>
        (!!subject.removeSource && origin.blockID === subject.sourceBlockID) || remapTargetsSamePorts(origin.nodePortRemaps, subject.nodePortRemaps)
    ),
    createDiagramInvalidator(Realtime.node.reorderSteps, (origin, subject) => remapTargetsSamePorts(origin.nodePortRemaps, subject.nodePortRemaps)),
    createDiagramInvalidator(
      Realtime.link.patchMany,
      (origin, subject) =>
        !!origin.nodePortRemaps?.some((portRemap) => portRemap.ports.some((port) => subject.patches.some((patch) => patch.portID === port.portID)))
    ),
  ]
);
