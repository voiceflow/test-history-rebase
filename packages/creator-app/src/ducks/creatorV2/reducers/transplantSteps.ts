import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import * as Project from '@/ducks/projectV2';
import { createReverter } from '@/ducks/utils';
import * as Version from '@/ducks/versionV2';

import { nodeCoordsByIDSelector, nodeDataByIDSelector, portsByNodeIDSelector, stepIDsByParentNodeIDSelector } from '../selectors';
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
  (state, { sourceParentNodeID, targetParentNodeID, stepIDs, index, nodePortRemaps }) => {
    if (!Normal.hasMany(state.nodes, [sourceParentNodeID, targetParentNodeID, ...stepIDs])) return;

    orphanSteps(
      state,
      () => {
        addStepReferences(state, (currentStepIDs) => Utils.array.insertAll(currentStepIDs, index, stepIDs), {
          parentNodeID: targetParentNodeID,
          stepIDs,
        });
      },
      { parentNodeID: sourceParentNodeID, stepIDs }
    );

    removeNodePortRemapLinks(state, nodePortRemaps);
  }
);

export default transplantStepsReducer;

export const transplantStepsReverter = createReverter(
  Realtime.node.transplantSteps,

  (
    { workspaceID, projectID, versionID, domainID, diagramID, sourceParentNodeID, targetParentNodeID, stepIDs, removeSource, nodePortRemaps = [] },
    getState
  ) => {
    const state = getState();
    const index = stepIDsByParentNodeIDSelector(state, { id: sourceParentNodeID }).indexOf(stepIDs[0]);

    const ctx = { workspaceID, projectID, versionID, domainID, diagramID };

    // only re-add links that have been removed
    const reAddLinks = nodePortRemaps.flatMap((portRemap) => (portRemap.targetNodeID ? [] : buildLinkRecreateActions(state, ctx, portRemap)));

    if (removeSource) {
      // if source removed, restore the original block
      const schemaVersion = Version.active.schemaVersionSelector(state);
      const projectMeta = Project.active.metaSelector(state);
      const sourceParentNode = nodeDataByIDSelector(state, { id: sourceParentNodeID });
      const parentCoords = nodeCoordsByIDSelector(state, { id: sourceParentNodeID });
      const inPortID = portsByNodeIDSelector(state, { id: sourceParentNodeID }).in[0];

      if (!(sourceParentNode && parentCoords && inPortID)) {
        return [];
      }

      return [
        Realtime.node.isolateSteps({
          ...ctx,
          sourceParentNodeID: targetParentNodeID,
          parentNodeID: sourceParentNodeID,
          parentNodeData: {
            name: sourceParentNode.name,
            type: sourceParentNode.type as Realtime.BlockType.COMBINED,
            ports: {
              in: [{ id: inPortID }],
              out: Realtime.Utils.port.createEmptyNodeOutPorts(),
            },
            coords: parentCoords,
          },
          stepIDs,
          projectMeta,
          schemaVersion,
        }),
        ...reAddLinks,
      ];
    }

    return [
      Realtime.node.transplantSteps({
        ...ctx,
        sourceParentNodeID: targetParentNodeID,
        targetParentNodeID: sourceParentNodeID,
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
      [...origin.stepIDs, origin.targetParentNodeID, origin.sourceParentNodeID].includes(nodeID)
    ),
    ...createNodeIndexInvalidators<Realtime.node.TransplantStepsPayload>(({ index, targetParentNodeID }) => ({
      index,
      parentNodeID: targetParentNodeID,
    })),
    ...createNodePortRemapsInvalidators<Realtime.node.TransplantStepsPayload>(({ targetParentNodeID, nodePortRemaps = [] }) => ({
      nodePortRemaps,
      parentNodeID: targetParentNodeID,
    })),
  ]
);
