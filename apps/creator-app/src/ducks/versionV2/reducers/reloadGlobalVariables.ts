import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const reloadGlobalVariablesReducer = createReducer(
  Realtime.version.variable.reloadGlobal,
  (state, { versionID, variables }) => {
    const version = Normal.getOne(state, versionID);

    if (version) {
      version.variables = variables;
    }
  }
);

export default reloadGlobalVariablesReducer;
