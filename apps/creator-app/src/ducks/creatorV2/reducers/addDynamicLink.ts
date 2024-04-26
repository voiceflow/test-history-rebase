import * as Realtime from '@voiceflow/realtime-sdk';

import { createReverter } from '@/ducks/utils';

import { addLink } from '../utils';
import {
  createActiveDiagramReducer,
  createDiagramInvalidator,
  createNodeRemovalInvalidators,
  DIAGRAM_INVALIDATORS,
} from './utils';

const addDynamicLinkReducer = createActiveDiagramReducer(Realtime.link.addDynamic, (state, payload) => {
  addLink(state, payload);
});

export default addDynamicLinkReducer;

export const addDynamicLinkReverter = createReverter(
  Realtime.link.addDynamic,

  ({ workspaceID, projectID, versionID, domainID, diagramID, sourceNodeID, sourcePortID, linkID }) =>
    Realtime.link.removeMany({
      workspaceID,
      projectID,
      versionID,
      domainID,
      diagramID,
      links: [{ nodeID: sourceNodeID, portID: sourcePortID, linkID }],
    }),

  [
    ...DIAGRAM_INVALIDATORS,
    ...createNodeRemovalInvalidators<Realtime.link.AddDynamicPayload>(
      (origin, nodeID) => origin.sourceNodeID === nodeID || origin.targetNodeID === nodeID
    ),
    createDiagramInvalidator(
      Realtime.port.addDynamic,
      (origin, subject) => origin.sourceNodeID === subject.nodeID && origin.sourcePortID === subject.portID
    ),
  ]
);
