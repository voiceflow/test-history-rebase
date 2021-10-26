import * as Realtime from '@voiceflow/realtime-sdk';

import { safeGetNormalizedByKey } from '@/utils/normalized';

import { createReducer } from './utils';

const updateaNameReducer = createReducer(Realtime.workspace.updateName, (state, { workspaceID, name }) => {
  const workspace = safeGetNormalizedByKey(state, workspaceID);

  if (workspace) {
    workspace.name = name;
  }
});

export default updateaNameReducer;
