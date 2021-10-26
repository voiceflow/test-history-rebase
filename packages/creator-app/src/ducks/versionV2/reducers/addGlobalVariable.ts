import * as Realtime from '@voiceflow/realtime-sdk';

import { append } from '@/utils/array';
import { safeGetNormalizedByKey } from '@/utils/normalized';

import { createReducer } from './utils';

const addGlobalVariableReducer = createReducer(Realtime.version.addGlobalVariable, (state, { versionID, variable }) => {
  const version = safeGetNormalizedByKey(state, versionID);

  if (version) {
    version.variables = append(version.variables, variable);
  }
});

export default addGlobalVariableReducer;
