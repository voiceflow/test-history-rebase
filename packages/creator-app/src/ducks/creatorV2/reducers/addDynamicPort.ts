import * as Realtime from '@voiceflow/realtime-sdk';

import { addDynamicPort } from '../utils';
import { createActiveDiagramReducer } from './utils';

const addDynamicPortReducer = createActiveDiagramReducer(Realtime.node.addDynamicPort, (state, { nodeID, portID, label }) => {
  addDynamicPort(state, { nodeID, portID, label });
});

export default addDynamicPortReducer;
