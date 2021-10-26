import * as Realtime from '@voiceflow/realtime-sdk';

import { safeGetNormalizedByKey } from '@/utils/normalized';

import { createReducer } from './utils';

const patchSettingsReducer = createReducer(Realtime.version.patchSettings, (state, { versionID, settings }) => {
  const version = safeGetNormalizedByKey(state, versionID);

  if (version) {
    Object.assign(version.settings, settings);
  }
});

export default patchSettingsReducer;
