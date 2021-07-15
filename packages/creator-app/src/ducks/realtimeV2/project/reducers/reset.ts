import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from './utils';

const resetReducer = createReducer(Realtime.project.local.reset, (state, { projectID }) => {
  delete state[projectID];
});

export default resetReducer;
