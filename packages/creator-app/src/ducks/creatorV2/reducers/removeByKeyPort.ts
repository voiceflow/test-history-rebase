import * as Realtime from '@voiceflow/realtime-sdk';

import { removeByKeyPort } from '../utils';
import { createActiveDiagramReducer } from './utils';

const removeByKeyPortReducer = createActiveDiagramReducer(Realtime.port.removeByKey, (state, { nodeID, portID }) => {
  removeByKeyPort(state, nodeID, portID);
});

export default removeByKeyPortReducer;
