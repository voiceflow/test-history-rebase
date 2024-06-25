import * as Realtime from '@voiceflow/realtime-sdk';
import dayjs from 'dayjs';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const updateInviteReducer = createReducer(
  [Realtime.workspace.member.updateInvite, Realtime.workspace.member.renewInvite],
  (state, { workspaceID, email, role }) => {
    const workspace = Normal.getOne(state, workspaceID);

    if (!workspace) return;

    workspace.pendingMembers = Normal.patch(workspace.pendingMembers, email, {
      role,
      expiry: dayjs().add(1, 'week').toJSON(),
    });
  }
);

export default updateInviteReducer;
