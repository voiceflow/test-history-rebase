import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const addGlobalVariableReducer = createReducer(Realtime.version.variable.addGlobal, (state, { versionID, variable }) => {
  const version = Normal.getOne(state, versionID);

  if (version) {
    version.variables = Utils.array.append(version.variables, variable);
  }
});

export default addGlobalVariableReducer;
