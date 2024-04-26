import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const removeManyGlobalVariablesReducer = createReducer(
  Realtime.version.variable.removeManyGlobal,
  (state, { versionID, variables }) => {
    const version = Normal.getOne(state, versionID);

    if (version) {
      version.variables = Utils.array.withoutValues(version.variables, variables);
    }
  }
);

export default removeManyGlobalVariablesReducer;
