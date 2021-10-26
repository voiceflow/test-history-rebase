import * as Realtime from '@voiceflow/realtime-sdk';

import { safeGetNormalizedByKey } from '@/utils/normalized';

import { createReducer } from './utils';

const patchPublishingReducer = createReducer(Realtime.version.patchPublishing, (state, { versionID, publishing }) => {
  const version = safeGetNormalizedByKey(state, versionID);

  if (version) {
    Object.assign(version.publishing, publishing);
  }
});

export default patchPublishingReducer;
