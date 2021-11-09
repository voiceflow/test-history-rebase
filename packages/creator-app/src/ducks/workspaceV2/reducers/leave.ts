import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from './utils';

const leaveWorkspaceReducer = createReducer(Realtime.workspace.leave, (state, { workspaceID, creatorID }) => {
  const workspace = Utils.normalized.safeGetNormalizedByKey(state, workspaceID);

  if (workspace) {
    workspace.members = workspace.members.filter((member) => member.creator_id !== creatorID);
  }
});

export default leaveWorkspaceReducer;
