import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from './utils';

const patchSettingsReducer = createReducer(Realtime.version.patchSettings, (state, { versionID, settings }) => {
  const version = Utils.normalized.safeGetNormalizedByKey(state, versionID);

  if (version) {
    Object.assign(version.settings, settings);
  }
});

export default patchSettingsReducer;
