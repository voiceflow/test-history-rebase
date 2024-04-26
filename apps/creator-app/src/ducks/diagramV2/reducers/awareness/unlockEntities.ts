/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from '../utils';

const unlockEntities = createReducer(
  Realtime.diagram.awareness.unlockEntities,
  (state, { diagramID, entityIDs, lockType }) => {
    if (state.awareness.locks[diagramID]?.[lockType]) {
      entityIDs.forEach((entityID) => {
        delete state.awareness.locks[diagramID][lockType]![entityID];
      });
    }
  }
);

export default unlockEntities;
