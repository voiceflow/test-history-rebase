import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from '../utils';

const cancelInviteReducer = createReducer(Realtime.workspace.member.cancelInvite, (state, { workspaceID, email }) => {
  const workspace = Utils.normalized.safeGetNormalizedByKey(state, workspaceID);

  if (workspace) {
    workspace.members = workspace.members.filter((member) => member.email !== email);
  }
});

export default cancelInviteReducer;
