import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const updateInviteReducer = createReducer(Realtime.workspace.member.updateInvite, (state, { workspaceID, email, role }) => {
  const workspace = Normal.getOne(state, workspaceID);
  const member = workspace?.members.find((member) => member.email === email);

  if (member) {
    member.role = role;
  }
});

export default updateInviteReducer;
