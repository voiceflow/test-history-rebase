import * as Realtime from '@voiceflow/realtime-sdk';

import { removeBuiltinPort } from '../utils';
import { createActiveDiagramReducer } from './utils';

const removeBuiltinPortReducer = createActiveDiagramReducer(Realtime.port.removeBuiltin, (state, { nodeID, portID }) => {
  removeBuiltinPort(state, nodeID, portID);
});

export default removeBuiltinPortReducer;
