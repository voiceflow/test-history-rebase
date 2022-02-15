import * as Realtime from '@voiceflow/realtime-sdk';

import { removeDynamicPort } from '../utils';
import { createActiveDiagramReducer } from './utils';

const removeDynamicPortReducer = createActiveDiagramReducer(Realtime.port.removeDynamic, (state, { nodeID, portID }) => {
  removeDynamicPort(state, nodeID, portID);
});

export default removeDynamicPortReducer;
