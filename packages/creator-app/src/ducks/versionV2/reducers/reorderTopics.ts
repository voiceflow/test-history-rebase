import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const reorderTopicsReducer = createReducer(Realtime.version.reorderTopics, (state, { versionID, from, to }) => {
  const version = Normal.getOne(state, versionID);

  if (version) {
    version.topics = Utils.array.reorder(version.topics, from, to);
  }
});

export default reorderTopicsReducer;
