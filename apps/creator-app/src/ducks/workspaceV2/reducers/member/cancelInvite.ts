import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const cancelInviteReducer = createReducer(Realtime.workspace.member.cancelInvite, (state, { workspaceID, email }) => {
  const workspace = Normal.getOne(state, workspaceID);

  if (!workspace) return;

  workspace.pendingMembers = Normal.removeOne(workspace.pendingMembers, email);
});

export default cancelInviteReducer;
