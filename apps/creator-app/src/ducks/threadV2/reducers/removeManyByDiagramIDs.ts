/* eslint-disable no-param-reassign */
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from './utils';

const removeManyByDiagramIDs = createReducer(Realtime.thread.removeManyByDiagramIDs, (state, { diagramIDs }) => {
  state.allKeys.forEach((threadID) => {
    if (!diagramIDs.includes(state.byKey[threadID]?.diagramID)) return;

    delete state.byKey[threadID];
    state.allKeys = Utils.array.withoutValue(state.allKeys, threadID);
  });
});

export default removeManyByDiagramIDs;
