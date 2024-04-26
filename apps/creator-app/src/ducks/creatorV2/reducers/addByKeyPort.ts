import * as Realtime from '@voiceflow/realtime-sdk';

import { createReverter } from '@/ducks/utils';

import { addByKeyPort } from '../utils';
import {
  createActiveDiagramReducer,
  createDiagramInvalidator,
  createNodeRemovalInvalidators,
  DIAGRAM_INVALIDATORS,
} from './utils';

const addByKeyPortReducer = createActiveDiagramReducer(
  Realtime.port.addByKey,
  (state, { nodeID, portID, key, label }) => {
    addByKeyPort(state, { nodeID, portID, key, label });
  }
);

export default addByKeyPortReducer;

export const addByKeyPortReverter = createReverter(
  Realtime.port.addByKey,

  ({ workspaceID, projectID, versionID, domainID, diagramID, nodeID, key }) =>
    Realtime.port.removeManyByKey({
      workspaceID,
      projectID,
      versionID,
      domainID,
      diagramID,
      nodeID,
      keys: [key],
      removeNodes: [],
    }),

  [
    ...DIAGRAM_INVALIDATORS,
    ...createNodeRemovalInvalidators<Realtime.port.AddByKeyPayload>((origin, nodeID) => origin.nodeID === nodeID),
    createDiagramInvalidator(
      Realtime.port.addByKey,
      (origin, subject) => origin.nodeID === subject.nodeID && origin.key === subject.key
    ),
  ]
);
