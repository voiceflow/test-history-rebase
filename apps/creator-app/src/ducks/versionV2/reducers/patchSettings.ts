import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const patchSettingsReducer = createReducer(Realtime.version.patchSettings, (state, { versionID, settings }) => {
  const version = Normal.getOne(state, versionID);

  if (version) {
    Object.assign(version.settings, settings);
  }
});

export default patchSettingsReducer;
