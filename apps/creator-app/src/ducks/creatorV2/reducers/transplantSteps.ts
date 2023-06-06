import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import * as Project from '@/ducks/projectV2';
import { createReverter } from '@/ducks/utils';
import * as Version from '@/ducks/versionV2';

import {
  builtInPortTypeSelector,
  byKeyPortKeySelector,
  linksByPortIDSelector,
  nodeCoordsByIDSelector,
  nodeDataByIDSelector,
  portsByNodeIDSelector,
  stepIDsByParentNodeIDSelector,
} from '../selectors';
import { addStepReferences, orphanSteps, removeManyNodes, removeNodePortRemapLinks } from '../utils';
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

const transplantStepsReducer = createActiveDiagramReducer(
  Realtime.node.transplantSteps,
  (state, { sourceParentNodeID, targetParentNodeID, stepIDs, index, nodePortRemaps = [], removeNodes }) => {
    if (!Normal.hasMany(state.nodes, [sourceParentNodeID, targetParentNodeID, ...stepIDs])) return;

    const removeNodeIDs = removeNodes.map((node) => node.stepID ?? node.parentNodeID);

    removeManyNodes(state, removeNodeIDs);

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
    { stepIDs, projectID, versionID, diagramID, removeNodes, workspaceID, removeSource, nodePortRemaps = [], sourceParentNodeID, targetParentNodeID },
    getState
  ) => {
    const state = getState();
    const index = stepIDsByParentNodeIDSelector(state, { id: sourceParentNodeID }).indexOf(stepIDs[0]);

    const ctx = { workspaceID, projectID, versionID, diagramID };

    // only re-add links that have been removed
    const reAddLinks = nodePortRemaps.flatMap((portRemap) => (portRemap.targetNodeID ? [] : buildLinkRecreateActions(state, ctx, portRemap)));

    const removeActions = removeManyNodesReverter.revert({ workspaceID, projectID, versionID, diagramID, nodes: removeNodes }, getState) ?? [];

    if (removeSource) {
      // if source removed, restore the original block
      const schemaVersion = Version.active.schemaVersionSelector(state);
      const projectMeta = Project.active.metaSelector(state);
      const sourceParentNode = nodeDataByIDSelector(state, { id: sourceParentNodeID });
      const parentCoords = nodeCoordsByIDSelector(state, { id: sourceParentNodeID });
      const inPortID = portsByNodeIDSelector(state, { id: sourceParentNodeID }).in[0];
      const inLinks = linksByPortIDSelector(state, { id: inPortID });

      if (!(sourceParentNode && parentCoords && inPortID)) return [];

      return [
        Realtime.node.isolateSteps({
          ...ctx,
          stepIDs,
          projectMeta,
          parentNodeID: sourceParentNodeID,
          schemaVersion,
          parentNodeData: {
            name: sourceParentNode.name,
            type: sourceParentNode.type as Realtime.BlockType.COMBINED,
            ports: { in: [{ id: inPortID }], out: Realtime.Utils.port.createEmptyNodeOutPorts() },
            coords: parentCoords,
          },
          sourceParentNodeID: targetParentNodeID,
        }),
        ...reAddLinks,

        ...inLinks.map((link) => {
          const portKey = byKeyPortKeySelector(state, { id: link.source.portID });
          const portType = builtInPortTypeSelector(state, { id: link.source.portID });

          const context = {
            ...ctx,
            data: link.data,
            linkID: link.id,
            sourceNodeID: link.source.nodeID,
            sourcePortID: link.source.portID,
            targetNodeID: link.target.nodeID,
            targetPortID: link.target.portID,
            sourceParentNodeID,
          };

          if (portKey) return Realtime.link.addByKey({ ...context, key: portKey });

          if (portType) return Realtime.link.addBuiltin({ ...context, type: portType });

          return Realtime.link.addDynamic(context);
        }),

        ...(Array.isArray(removeActions) ? removeActions : [removeActions]),
      ];
    }

    return [
      Realtime.node.transplantSteps({
        ...ctx,
        index,
        stepIDs,
        removeNodes: [],
        removeSource: false,
        nodePortRemaps: [],
        sourceParentNodeID: targetParentNodeID,
        targetParentNodeID: sourceParentNodeID,
      }),
      ...reAddLinks,
      ...(Array.isArray(removeActions) ? removeActions : [removeActions]),
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
    ...createManyNodesRemovalInvalidators<Realtime.node.TransplantStepsPayload>((origin) => origin.removeNodes),
  ]
);
