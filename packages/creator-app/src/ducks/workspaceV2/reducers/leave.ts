import * as Realtime from '@voiceflow/realtime-sdk';

import { safeGetNormalizedByKey } from '@/utils/normalized';

import { createReducer } from './utils';

const leaveWorkspaceReducer = createReducer(Realtime.workspace.leave, (state, { workspaceID, creatorID }) => {
  const workspace = safeGetNormalizedByKey(state, workspaceID);

  if (workspace) {
    workspace.members = workspace.members.filter((member) => member.creator_id !== creatorID);
  }
});

export default leaveWorkspaceReducer;
