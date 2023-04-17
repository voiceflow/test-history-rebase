import * as Realtime from '@voiceflow/realtime-sdk';

import { createReverter } from '@/ducks/utils';

import { portsByNodeIDSelector } from '../selectors';
import { removeManyByKeyPort } from '../utils';
import { createActiveDiagramReducer, createDiagramInvalidator, createNodeRemovalInvalidators, DIAGRAM_INVALIDATORS } from './utils';

const removeManyByKeyPortReducer = createActiveDiagramReducer(Realtime.port.removeManyByKey, (state, { nodeID, keys }) => {
  removeManyByKeyPort(state, nodeID, keys);
});

export default removeManyByKeyPortReducer;

export const removeManyByKeyPortsReverter = createReverter(
  Realtime.port.removeManyByKey,
  ({ workspaceID, projectID, versionID, domainID, diagramID, nodeID, keys }, getState) => {
    const ports = portsByNodeIDSelector(getState(), { id: nodeID });

    return keys.map((key) =>
      Realtime.port.addByKey({ workspaceID, projectID, versionID, domainID, diagramID, nodeID, portID: ports.out.byKey[key], key })
    );
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
