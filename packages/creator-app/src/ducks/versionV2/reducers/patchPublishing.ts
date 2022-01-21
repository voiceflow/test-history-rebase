import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const patchPublishingReducer = createReducer(Realtime.version.patchPublishing, (state, { versionID, publishing }) => {
  const version = Normal.getOne(state, versionID);

  if (version) {
    Object.assign(version.publishing, publishing);
  }
});

export default patchPublishingReducer;
