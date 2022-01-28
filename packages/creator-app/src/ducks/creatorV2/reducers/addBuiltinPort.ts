import * as Realtime from '@realtime-sdk';

import { addBuiltinPort } from '../utils';
import { createActiveDiagramReducer } from './utils';

const addBuiltinPortReducer = createActiveDiagramReducer(Realtime.node.addBuiltinPort, (state, { nodeID, portID, type, platform }) => {
  addBuiltinPort(state, { nodeID, portID, type, platform });
});

export default addBuiltinPortReducer;
