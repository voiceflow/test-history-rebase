import * as Realtime from '@voiceflow/realtime-sdk';

import { createReverter } from '@/ducks/utils';

import { linksByPortIDSelector, parentNodeIDByStepIDSelector } from '../selectors';
import { removeBuiltinPort, removeManyNodes } from '../utils';
import { removeManyNodesReverter } from './removeManyNodes';
import {
  createActiveDiagramReducer,
  createDiagramInvalidator,
  createNodeRemovalInvalidators,
  DIAGRAM_INVALIDATORS,
} from './utils';

const removeBuiltinPortReducer = createActiveDiagramReducer(
  Realtime.port.removeBuiltin,
  (state, { nodeID, portID, removeNodes }) => {
    const removeNodeIDs = removeNodes.map((node) => node.stepID ?? node.parentNodeID);

    removeManyNodes(state, removeNodeIDs);
    removeBuiltinPort(state, nodeID, portID);
  }
);

export default removeBuiltinPortReducer;

export const removeBuiltinPortReverter = createReverter(
  Realtime.port.removeBuiltin,

  ({ workspaceID, projectID, versionID, diagramID, nodeID, portID, type, removeNodes }, getState) => {
    const ctx = { workspaceID, projectID, versionID, diagramID };
    const state = getState();
    const links = linksByPortIDSelector(state, { id: portID });

    const removeNodeActions =
      removeManyNodesReverter.revert({ workspaceID, projectID, versionID, diagramID, nodes: removeNodes }, getState) ??
      [];

    return [
      Realtime.port.addBuiltin({ ...ctx, nodeID, portID, type }),

      ...links.map((link) => {
        const sourceParentNodeID = parentNodeIDByStepIDSelector(state, { id: link.source.nodeID });

        return Realtime.link.addBuiltin({
          ...ctx,
          sourceParentNodeID,
          sourceNodeID: link.source.nodeID,
          sourcePortID: link.source.portID,
          targetNodeID: link.target.nodeID,
          targetPortID: link.target.portID,
          linkID: link.id,
          data: link.data,
          type,
        });
      }),

      ...(Array.isArray(removeNodeActions) ? removeNodeActions : [removeNodeActions]),
    ];
  },

  [
    ...DIAGRAM_INVALIDATORS,
    ...createNodeRemovalInvalidators<Realtime.port.RemoveBuiltinPayload>((origin, nodeID) => origin.nodeID === nodeID),
    createDiagramInvalidator(
      Realtime.port.removeBuiltin,
      (origin, subject) => origin.nodeID === subject.nodeID && origin.type === subject.type
    ),
    createDiagramInvalidator(
      Realtime.link.addBuiltin,
      (origin, subject) => origin.nodeID === subject.sourceNodeID && origin.type === subject.type
    ),
    createDiagramInvalidator(Realtime.link.patchMany, (origin, subject) =>
      subject.patches.some((patch) => origin.nodeID === patch.nodeID && origin.portID === patch.portID)
    ),
  ]
);
