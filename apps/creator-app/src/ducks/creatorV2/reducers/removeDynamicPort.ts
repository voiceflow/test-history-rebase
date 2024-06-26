import * as Realtime from '@voiceflow/realtime-sdk';

import { createReverter } from '@/ducks/utils';

import {
  linksByPortIDSelector,
  parentNodeIDByStepIDSelector,
  portByIDSelector,
  portsByNodeIDSelector,
} from '../selectors';
import { removeDynamicPort, removeManyNodes } from '../utils';
import { removeManyNodesReverter } from './removeManyNodes';
import {
  createActiveDiagramReducer,
  createDiagramInvalidator,
  createNodeRemovalInvalidators,
  DIAGRAM_INVALIDATORS,
} from './utils';

const removeDynamicPortReducer = createActiveDiagramReducer(
  Realtime.port.removeDynamic,
  (state, { nodeID, portID, removeNodes }) => {
    const removeNodeIDs = removeNodes.map((node) => node.stepID ?? node.parentNodeID);

    removeManyNodes(state, removeNodeIDs);

    removeDynamicPort(state, nodeID, portID);
  }
);

export default removeDynamicPortReducer;

export const removeDynamicPortReverter = createReverter(
  Realtime.port.removeDynamic,

  ({ workspaceID, projectID, versionID, diagramID, nodeID, portID, removeNodes }, getState) => {
    const ctx = { workspaceID, projectID, versionID, diagramID };
    const state = getState();
    const port = portByIDSelector(state, { id: portID });
    const links = linksByPortIDSelector(state, { id: portID });
    const ports = portsByNodeIDSelector(state, { id: nodeID });
    const index = ports.out.dynamic.indexOf(portID);

    const removeNodeActions =
      removeManyNodesReverter.revert({ workspaceID, projectID, versionID, diagramID, nodes: removeNodes }, getState) ??
      [];

    return [
      Realtime.port.addDynamic({ ...ctx, nodeID, portID, index, label: port?.label }),

      ...links.map((link) => {
        const sourceParentNodeID = parentNodeIDByStepIDSelector(state, { id: link.source.nodeID });

        return Realtime.link.addDynamic({
          ...ctx,
          sourceParentNodeID,
          sourceNodeID: link.source.nodeID,
          sourcePortID: link.source.portID,
          targetNodeID: link.target.nodeID,
          targetPortID: link.target.portID,
          linkID: link.id,
          data: link.data,
        });
      }),

      ...(Array.isArray(removeNodeActions) ? removeNodeActions : [removeNodeActions]),
    ];
  },

  [
    ...DIAGRAM_INVALIDATORS,
    ...createNodeRemovalInvalidators<Realtime.BasePortPayload>((origin, nodeID) => origin.nodeID === nodeID),
    createDiagramInvalidator(Realtime.port.addDynamic, (origin, subject) => origin.nodeID === subject.nodeID),
    createDiagramInvalidator(
      Realtime.port.removeDynamic,
      (origin, subject) => origin.nodeID === subject.nodeID && origin.portID === subject.portID
    ),
    createDiagramInvalidator(Realtime.port.reorderDynamic, (origin, subject) => origin.nodeID === subject.nodeID),
    createDiagramInvalidator(
      Realtime.link.addDynamic,
      (origin, subject) => origin.nodeID === subject.sourceNodeID && origin.portID === subject.sourcePortID
    ),
    createDiagramInvalidator(Realtime.link.patchMany, (origin, subject) =>
      subject.patches.some((patch) => origin.nodeID === patch.nodeID && origin.portID === patch.portID)
    ),
  ]
);
