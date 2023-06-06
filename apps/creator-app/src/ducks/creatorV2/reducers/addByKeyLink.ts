import * as Realtime from '@voiceflow/realtime-sdk';

import { createReverter } from '@/ducks/utils';

import { addLink } from '../utils';
import { createActiveDiagramReducer, createDiagramInvalidator, createNodeRemovalInvalidators, DIAGRAM_INVALIDATORS } from './utils';

const addByKeyLinkReducer = createActiveDiagramReducer(Realtime.link.addByKey, (state, payload) => {
  addLink(state, payload);
});

export default addByKeyLinkReducer;

export const addByKeyLinkReverter = createReverter(
  Realtime.link.addByKey,

  ({ workspaceID, projectID, versionID, diagramID, sourceNodeID, sourcePortID, key, linkID }) =>
    Realtime.link.removeMany({
      workspaceID,
      projectID,
      versionID,
      diagramID,
      links: [{ nodeID: sourceNodeID, portID: sourcePortID, key, linkID }],
    }),

  [
    ...DIAGRAM_INVALIDATORS,
    ...createNodeRemovalInvalidators<Realtime.link.AddByKeyPayload>(
      (origin, nodeID) => origin.sourceNodeID === nodeID || origin.targetNodeID === nodeID
    ),
    createDiagramInvalidator(Realtime.link.addByKey, (origin, subject) => origin.sourceNodeID === subject.sourceNodeID && origin.key === subject.key),
    createDiagramInvalidator(
      Realtime.port.removeManyByKey,
      (origin, subject) => origin.sourceNodeID === subject.nodeID && subject.keys.includes(origin.key)
    ),
  ]
);
