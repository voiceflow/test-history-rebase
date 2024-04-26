/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from '../utils';

const lockEntities = createReducer(
  Realtime.diagram.awareness.lockEntities,
  (state, { diagramID, entityIDs, lockType, loguxNodeID }) => {
    state.awareness.locks[diagramID] ??= {};
    state.awareness.locks[diagramID][lockType] ??= {};

    entityIDs.forEach((entityID) => {
      state.awareness.locks[diagramID][lockType]![entityID] = loguxNodeID;
    });
  }
);

export default lockEntities;
