import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const updateInviteReducer = createReducer(Realtime.workspace.member.updateInvite, (state, { workspaceID, email, role }) => {
  const workspace = Normal.getOne(state, workspaceID);

  if (!workspace) return;

  workspace.pendingMembers = Normal.patch(workspace.pendingMembers, email, { role });
});

export default updateInviteReducer;
