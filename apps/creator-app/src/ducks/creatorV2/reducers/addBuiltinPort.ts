import * as Realtime from '@voiceflow/realtime-sdk';

import { createReverter } from '@/ducks/utils';

import { addBuiltinPort } from '../utils';
import { createActiveDiagramReducer, createDiagramInvalidator, createNodeRemovalInvalidators, DIAGRAM_INVALIDATORS } from './utils';

const addBuiltinPortReducer = createActiveDiagramReducer(Realtime.port.addBuiltin, (state, { nodeID, portID, type }) => {
  addBuiltinPort(state, { nodeID, portID, type });
});

export default addBuiltinPortReducer;

export const addBuiltinPortReverter = createReverter(
  Realtime.port.addBuiltin,

  ({ workspaceID, projectID, versionID, domainID, diagramID, nodeID, portID, type }) =>
    Realtime.port.removeBuiltin({ workspaceID, projectID, versionID, domainID, diagramID, nodeID, portID, type }),

  [
    ...DIAGRAM_INVALIDATORS,
    ...createNodeRemovalInvalidators<Realtime.port.BuiltinPayload>((origin, nodeID) => origin.nodeID === nodeID),
    createDiagramInvalidator(Realtime.port.addBuiltin, (origin, subject) => origin.nodeID === subject.nodeID && origin.type === subject.type),
  ]
);
