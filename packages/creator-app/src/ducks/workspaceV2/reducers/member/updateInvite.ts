import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from '../utils';

const updateInviteReducer = createReducer(Realtime.workspace.member.updateInvite, (state, { workspaceID, email, role }) => {
  const workspace = Utils.normalized.safeGetNormalizedByKey(state, workspaceID);
  const member = workspace?.members.find((member) => member.email === email);

  if (member) {
    member.role = role;
  }
});

export default updateInviteReducer;
