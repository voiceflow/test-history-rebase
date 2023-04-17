import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const addManyGlobalVariablesReducer = createReducer(Realtime.version.variable.addManyGlobal, (state, { versionID, variables }) => {
  const version = Normal.getOne(state, versionID);

  if (version) {
    version.variables = [...version.variables, ...variables];
  }
});

export default addManyGlobalVariablesReducer;
