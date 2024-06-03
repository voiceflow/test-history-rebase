import * as Realtime from '@voiceflow/realtime-sdk';

import { createReverter } from '@/ducks/utils';

import { addDynamicPort } from '../utils';
import { createActiveDiagramReducer } from './utils';

const addCustomBlockPortReducer = createActiveDiagramReducer(
  Realtime.port.syncCustomBlockPorts,
  (state, { patchData }) => {
    Object.keys(patchData).forEach((nodeID) => {
      patchData[nodeID].forEach(({ portID, label }) => addDynamicPort(state, { nodeID, portID, label }));
    });
  }
);

export default addCustomBlockPortReducer;

export const addCustomBlockPortReverter = createReverter(
  Realtime.port.syncCustomBlockPorts,
  ({ workspaceID, projectID, versionID, diagramID, patchData }) =>
    Realtime.port.undoSyncCustomBlockPorts({ workspaceID, projectID, versionID, diagramID, patchData }),
  []
);
