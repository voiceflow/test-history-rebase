import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const reloadGlobalVariablesReducer = createReducer(Realtime.version.reloadFolders, (state, { versionID, folders }) => {
  const version = Normal.getOne(state, versionID);

  if (version) {
    version.folders = folders;
  }
});

export default reloadGlobalVariablesReducer;
