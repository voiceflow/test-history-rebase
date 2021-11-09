import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from './utils';

const patchSessionReducer = createReducer(Realtime.version.patchSession, (state, { versionID, session }) => {
  const version = Utils.normalized.safeGetNormalizedByKey(state, versionID);

  if (version) {
    Object.assign(version.session, session);
  }
});

export default patchSessionReducer;
