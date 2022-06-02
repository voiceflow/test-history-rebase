import * as Realtime from '@voiceflow/realtime-sdk';

import { removeManyByKeyPort } from '../utils';
import { createActiveDiagramReducer } from './utils';

const removeManyByKeyPortReducer = createActiveDiagramReducer(Realtime.port.removeManyByKey, (state, { nodeID, keys }) => {
  removeManyByKeyPort(state, nodeID, keys);
});

export default removeManyByKeyPortReducer;
