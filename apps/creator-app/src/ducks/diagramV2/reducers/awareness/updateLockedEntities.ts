/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from '../utils';

const updateLockedEntities = createReducer(
  Realtime.diagram.awareness.updateLockedEntities,
  (state, { diagramID, locks }) => {
    state.awareness.locks[diagramID] = locks;
  }
);

export default updateLockedEntities;
