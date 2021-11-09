import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from './utils';

const patchPublishingReducer = createReducer(Realtime.version.patchPublishing, (state, { versionID, publishing }) => {
  const version = Utils.normalized.safeGetNormalizedByKey(state, versionID);

  if (version) {
    Object.assign(version.publishing, publishing);
  }
});

export default patchPublishingReducer;
