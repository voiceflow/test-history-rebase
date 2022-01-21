import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const reorderComponentsReducer = createReducer(Realtime.version.reorderComponents, (state, { versionID, from, to }) => {
  const version = Normal.getOne(state, versionID);

  if (version) {
    version.components = Utils.array.reorder(version.components, from, to);
  }
});

export default reorderComponentsReducer;
