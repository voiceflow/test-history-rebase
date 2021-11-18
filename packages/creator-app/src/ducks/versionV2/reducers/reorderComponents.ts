import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from './utils';

const reorderComponentsReducer = createReducer(Realtime.version.reorderComponents, (state, { versionID, from, to }) => {
  const version = Utils.normalized.safeGetNormalizedByKey(state, versionID);

  if (version) {
    version.components = Utils.array.reorder(version.components, from, to);
  }
});

export default reorderComponentsReducer;
