import * as Realtime from '@voiceflow/realtime-sdk';

import { createReverter } from '@/ducks/utils';

import { addDynamicPort } from '../utils';
import {
  createActiveDiagramReducer,
  createDiagramInvalidator,
  createNodeRemovalInvalidators,
  DIAGRAM_INVALIDATORS,
} from './utils';

const addDynamicPortReducer = createActiveDiagramReducer(
  Realtime.port.addDynamic,
  (state, { nodeID, portID, label }) => {
    addDynamicPort(state, { nodeID, portID, label });
  }
);

export default addDynamicPortReducer;

export const addDynamicPortReverter = createReverter(
  Realtime.port.addDynamic,

  ({ workspaceID, projectID, versionID, diagramID, nodeID, portID }) =>
    Realtime.port.removeDynamic({ workspaceID, projectID, versionID, diagramID, nodeID, portID, removeNodes: [] }),

  [
    ...DIAGRAM_INVALIDATORS,
    ...createNodeRemovalInvalidators<Realtime.port.AddDynamicPayload>((origin, nodeID) => origin.nodeID === nodeID),
    createDiagramInvalidator(Realtime.port.addDynamic, (origin, subject) => origin.nodeID === subject.nodeID),
    createDiagramInvalidator(Realtime.port.removeDynamic, (origin, subject) => origin.nodeID === subject.nodeID),
    createDiagramInvalidator(Realtime.port.reorderDynamic, (origin, subject) => origin.nodeID === subject.nodeID),
  ]
);
