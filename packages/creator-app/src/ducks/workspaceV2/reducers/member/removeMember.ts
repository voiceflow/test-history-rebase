import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from '../utils';

const removeMemberReducer = createReducer(Realtime.workspace.member.remove, (state, { workspaceID, creatorID }) => {
  const workspace = Utils.normalized.safeGetNormalizedByKey(state, workspaceID);

  if (workspace) {
    workspace.members = workspace.members.filter((member) => member.creator_id !== creatorID);
  }
});

export default removeMemberReducer;
