/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from '../utils';

const removeDiagramLocks = createReducer(Realtime.diagram.crud.remove, (state, { key }) => {
  delete state.awareness.locks[key];
});

export default removeDiagramLocks;
