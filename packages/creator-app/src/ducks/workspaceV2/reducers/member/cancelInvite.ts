import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const cancelInviteReducer = createReducer(Realtime.workspace.member.cancelInvite, (state, { workspaceID, email }) => {
  const workspace = Normal.getOne(state, workspaceID);

  if (workspace) {
    workspace.members = workspace.members.filter((member) => member.email !== email);
  }
});

export default cancelInviteReducer;
