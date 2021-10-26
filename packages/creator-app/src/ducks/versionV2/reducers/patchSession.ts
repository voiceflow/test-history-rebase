import * as Realtime from '@voiceflow/realtime-sdk';

import { safeGetNormalizedByKey } from '@/utils/normalized';

import { createReducer } from './utils';

const patchSessionReducer = createReducer(Realtime.version.patchSession, (state, { versionID, session }) => {
  const version = safeGetNormalizedByKey(state, versionID);

  if (version) {
    Object.assign(version.session, session);
  }
});

export default patchSessionReducer;
