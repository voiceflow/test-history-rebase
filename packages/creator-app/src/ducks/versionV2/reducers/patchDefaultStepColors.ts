import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const patchDefaultStepColors = createReducer(Realtime.version.patchDefaultStepColors, (state, { versionID, defaultStepColors }) => {
  const version = Normal.getOne(state, versionID);

  if (version) {
    version.defaultStepColors ??= {};
    Object.assign(version.defaultStepColors, defaultStepColors);
  }
});

export default patchDefaultStepColors;
