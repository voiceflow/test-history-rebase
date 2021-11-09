import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from './utils';

const removeGlobalVariableReducer = createReducer(Realtime.version.removeGlobalVariable, (state, { versionID, variable }) => {
  const version = Utils.normalized.safeGetNormalizedByKey(state, versionID);

  if (version) {
    version.variables = Utils.array.withoutValue(version.variables, variable);
  }
});

export default removeGlobalVariableReducer;
