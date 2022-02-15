import * as Realtime from '@voiceflow/realtime-sdk';

import { addDynamicPort } from '../utils';
import { createActiveDiagramReducer } from './utils';

const addDynamicPortReducer = createActiveDiagramReducer(Realtime.port.addDynamic, (state, { nodeID, portID, label }) => {
  addDynamicPort(state, { nodeID, portID, label });
});

export default addDynamicPortReducer;
