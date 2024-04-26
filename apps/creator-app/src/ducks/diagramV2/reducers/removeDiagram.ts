import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer, removeDiagramSharedNodes } from './utils';

const removeDiagramReducer = createReducer(Realtime.diagram.crud.remove, (state, { key }) =>
  removeDiagramSharedNodes(state, key)
);

export default removeDiagramReducer;
