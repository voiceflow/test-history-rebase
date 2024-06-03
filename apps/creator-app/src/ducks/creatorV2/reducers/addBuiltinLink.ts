import * as Realtime from '@voiceflow/realtime-sdk';

import { createReverter } from '@/ducks/utils';

import { addLink } from '../utils';
import {
  createActiveDiagramReducer,
  createDiagramInvalidator,
  createNodeRemovalInvalidators,
  DIAGRAM_INVALIDATORS,
} from './utils';

const addBuiltinLinkReducer = createActiveDiagramReducer(Realtime.link.addBuiltin, (state, payload) => {
  addLink(state, payload);
});

export default addBuiltinLinkReducer;

export const addBuiltinLinkReverter = createReverter(
  Realtime.link.addBuiltin,

  ({ workspaceID, projectID, versionID, diagramID, sourceNodeID, sourcePortID, type, linkID }) =>
    Realtime.link.removeMany({
      workspaceID,
      projectID,
      versionID,
      diagramID,
      links: [{ nodeID: sourceNodeID, portID: sourcePortID, type, linkID }],
    }),

  [
    ...DIAGRAM_INVALIDATORS,
    ...createNodeRemovalInvalidators<Realtime.link.AddBuiltinPayload>(
      (origin, nodeID) => origin.sourceNodeID === nodeID || origin.targetNodeID === nodeID
    ),
    createDiagramInvalidator(
      Realtime.link.addBuiltin,
      (origin, subject) => origin.sourceNodeID === subject.sourceNodeID && origin.type === subject.type
    ),
    createDiagramInvalidator(
      Realtime.node.insertStep,
      (origin, subject) => origin.sourceParentNodeID === subject.parentNodeID
    ),
    createDiagramInvalidator(
      Realtime.node.reorderSteps,
      (origin, subject) => origin.sourceParentNodeID === subject.parentNodeID
    ),
    createDiagramInvalidator(
      Realtime.port.removeBuiltin,
      (origin, subject) => origin.sourceNodeID === subject.nodeID && origin.type === subject.type
    ),
  ]
);
