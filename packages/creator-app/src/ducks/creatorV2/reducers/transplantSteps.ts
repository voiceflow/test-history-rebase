import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import * as Project from '@/ducks/projectV2';
import { createReverter } from '@/ducks/utils';
import * as Version from '@/ducks/versionV2';

import { nodeCoordsByIDSelector, nodeDataByIDSelector, portsByNodeIDSelector, stepIDsByBlockIDSelector } from '../selectors';
import { addStepReferences, orphanSteps, removeNodePortRemapLinks } from '../utils';
import {
  buildLinkRecreateActions,
  createActiveDiagramReducer,
  createNodeIndexInvalidators,
  createNodePortRemapsInvalidators,
  createNodeRemovalInvalidators,
  DIAGRAM_INVALIDATORS,
} from './utils';

const transplantStepsReducer = createActiveDiagramReducer(
  Realtime.node.transplantSteps,
  (state, { sourceBlockID, targetBlockID, stepIDs, index, nodePortRemaps }) => {
    if (!Normal.hasMany(state.nodes, [sourceBlockID, targetBlockID, ...stepIDs])) return;

    orphanSteps(
      state,
      () => {
        addStepReferences(state, (currentStepIDs) => Utils.array.insertAll(currentStepIDs, index, stepIDs), { blockID: targetBlockID, stepIDs });
      },
      { blockID: sourceBlockID, stepIDs }
    );

    removeNodePortRemapLinks(state, nodePortRemaps);
  }
);

export default transplantStepsReducer;

export const transplantStepsReverter = createReverter(
  Realtime.node.transplantSteps,

  ({ workspaceID, projectID, versionID, diagramID, sourceBlockID, targetBlockID, stepIDs, removeSource, nodePortRemaps = [] }, getState) => {
    const state = getState();
    const index = stepIDsByBlockIDSelector(state, { id: sourceBlockID }).indexOf(stepIDs[0]);

    const ctx = { workspaceID, projectID, versionID, diagramID };

    // only re-add links that have been removed
    const reAddLinks = nodePortRemaps.flatMap((portRemap) => (portRemap.targetNodeID ? [] : buildLinkRecreateActions(state, ctx, portRemap)));

    if (removeSource) {
      // if source removed, restore the original block
      const schemaVersion = Version.active.schemaVersionSelector(state);
      const projectMeta = Project.active.metaSelector(state);
      const sourceBlock = nodeDataByIDSelector(state, { id: sourceBlockID });
      const blockCoords = nodeCoordsByIDSelector(state, { id: sourceBlockID });
      const inPortID = portsByNodeIDSelector(state, { id: sourceBlockID }).in[0];

      if (!(sourceBlock && blockCoords && inPortID)) {
        return [];
      }

      return [
        Realtime.node.isolateSteps({
          ...ctx,
          sourceBlockID: targetBlockID,
          blockID: sourceBlockID,
          blockPorts: {
            in: [{ id: inPortID }],
            out: Realtime.Utils.port.createEmptyNodeOutPorts(),
          },
          blockCoords,
          stepIDs,
          blockName: sourceBlock.name,
          projectMeta,
          schemaVersion,
          removeSource: false,
        }),
        ...reAddLinks,
      ];
    }

    return [
      Realtime.node.transplantSteps({
        ...ctx,
        sourceBlockID: targetBlockID,
        targetBlockID: sourceBlockID,
        stepIDs,
        index,
        removeSource: false,
        nodePortRemaps: [],
      }),
      ...reAddLinks,
    ];
  },

  [
    ...DIAGRAM_INVALIDATORS,
    ...createNodeRemovalInvalidators<Realtime.node.TransplantStepsPayload>((origin, nodeID) =>
      [...origin.stepIDs, origin.targetBlockID, origin.sourceBlockID].includes(nodeID)
    ),
    ...createNodeIndexInvalidators<Realtime.node.TransplantStepsPayload>(({ index, targetBlockID }) => ({ index, blockID: targetBlockID })),
    ...createNodePortRemapsInvalidators<Realtime.node.TransplantStepsPayload>(({ targetBlockID, nodePortRemaps = [] }) => ({
      nodePortRemaps,
      blockID: targetBlockID,
    })),
  ]
);
