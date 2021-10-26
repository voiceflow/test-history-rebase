import * as Realtime from '@voiceflow/realtime-sdk';

import { withoutValue } from '@/utils/array';
import { safeGetNormalizedByKey } from '@/utils/normalized';

import { createReducer } from './utils';

const removeGlobalVariableReducer = createReducer(Realtime.version.removeGlobalVariable, (state, { versionID, variable }) => {
  const version = safeGetNormalizedByKey(state, versionID);

  if (version) {
    version.variables = withoutValue(version.variables, variable);
  }
});

export default removeGlobalVariableReducer;
