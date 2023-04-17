import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const patchSessionReducer = createReducer(Realtime.version.patchSession, (state, { versionID, session }) => {
  const version = Normal.getOne(state, versionID);

  if (!version) return;

  if (version.session) {
    Object.assign(version.session, session);
  } else {
    Object.assign(version, { session });
  }
});

export default patchSessionReducer;
