import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from './utils';

const updateaNameReducer = createReducer(Realtime.workspace.updateName, (state, { workspaceID, name }) => {
  const workspace = Utils.normalized.safeGetNormalizedByKey(state, workspaceID);

  if (workspace) {
    workspace.name = name;
  }
});

export default updateaNameReducer;
