import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const removeGlobalVariableReducer = createReducer(
  Realtime.version.variable.removeGlobal,
  (state, { versionID, variable }) => {
    const version = Normal.getOne(state, versionID);

    if (version) {
      version.variables = Utils.array.withoutValue(version.variables, variable);
    }
  }
);

export default removeGlobalVariableReducer;
