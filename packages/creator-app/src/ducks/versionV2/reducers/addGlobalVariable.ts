import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from './utils';

const addGlobalVariableReducer = createReducer(Realtime.version.addGlobalVariable, (state, { versionID, variable }) => {
  const version = Utils.normalized.safeGetNormalizedByKey(state, versionID);

  if (version) {
    version.variables = Utils.array.append(version.variables, variable);
  }
});

export default addGlobalVariableReducer;
