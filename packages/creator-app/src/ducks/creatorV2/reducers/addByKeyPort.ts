import * as Realtime from '@voiceflow/realtime-sdk';

import { addByKeyPort } from '../utils';
import { createActiveDiagramReducer } from './utils';

const addByKeyPortReducer = createActiveDiagramReducer(Realtime.port.addByKey, (state, { nodeID, portID, key, label }) => {
  addByKeyPort(state, { nodeID, portID, key, label });
});

export default addByKeyPortReducer;
