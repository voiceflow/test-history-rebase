import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createActiveDiagramReducer } from './utils';

const updateManyNodeDataReducer = createActiveDiagramReducer(Realtime.node.updateDataMany, (state, payload) => {
  payload.nodes.forEach(({ nodeID, ...data }) => {
    if (!Normal.hasOne(state.nodes, nodeID)) return;

    Object.assign(state.nodes.byKey[nodeID], data);
  });
});

export default updateManyNodeDataReducer;
