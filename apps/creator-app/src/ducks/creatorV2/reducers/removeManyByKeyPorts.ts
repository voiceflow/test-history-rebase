import * as Realtime from '@voiceflow/realtime-sdk';

import { createReverter } from '@/ducks/utils';

import { portsByNodeIDSelector } from '../selectors';
import { removeManyByKeyPort, removeManyNodes } from '../utils';
import { removeManyNodesReverter } from './removeManyNodes';
import { createActiveDiagramReducer, createDiagramInvalidator, createNodeRemovalInvalidators, DIAGRAM_INVALIDATORS } from './utils';

const removeManyByKeyPortReducer = createActiveDiagramReducer(Realtime.port.removeManyByKey, (state, { nodeID, keys, removeNodes }) => {
  const removeNodeIDs = removeNodes.map((node) => node.stepID ?? node.parentNodeID);

  removeManyNodes(state, removeNodeIDs);
  removeManyByKeyPort(state, nodeID, keys);
});

export default removeManyByKeyPortReducer;

export const removeManyByKeyPortsReverter = createReverter(
  Realtime.port.removeManyByKey,
  ({ workspaceID, projectID, versionID, diagramID, nodeID, keys, removeNodes }, getState) => {
    const ports = portsByNodeIDSelector(getState(), { id: nodeID });

    const removeNodeActions = removeManyNodesReverter.revert({ workspaceID, projectID, versionID, diagramID, nodes: removeNodes }, getState) ?? [];

    return [
      ...keys.map((key) => Realtime.port.addByKey({ workspaceID, projectID, versionID, diagramID, nodeID, portID: ports.out.byKey[key], key })),

      ...(Array.isArray(removeNodeActions) ? removeNodeActions : [removeNodeActions]),
    ];
  },
  [
    ...DIAGRAM_INVALIDATORS,
    ...createNodeRemovalInvalidators<Realtime.port.RemoveManyByKeyPayload>((origin, nodeID) => origin.nodeID === nodeID),
    createDiagramInvalidator(
      Realtime.port.removeManyByKey,
      (origin, subject) => origin.nodeID === subject.nodeID && origin.keys.some((key) => subject.keys.includes(key))
    ),
    createDiagramInvalidator(
      Realtime.link.addByKey,
      (origin, subject) => origin.nodeID === subject.sourceNodeID && origin.keys.includes(subject.key)
    ),
    createDiagramInvalidator(Realtime.link.patchMany, (origin, subject) =>
      subject.patches.some((patch) => origin.nodeID === patch.nodeID && patch.key && origin.keys.includes(patch.key))
    ),
  ]
);
