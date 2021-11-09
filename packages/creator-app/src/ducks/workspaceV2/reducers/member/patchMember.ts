import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from '../utils';

const patchMemberReducer = createReducer(Realtime.workspace.member.patch, (state, { workspaceID, creatorID, member: patch }) => {
  const workspace = Utils.normalized.safeGetNormalizedByKey(state, workspaceID);
  const member = workspace?.members.find((member) => member.creator_id === creatorID);

  if (member) {
    Object.assign(member, patch);
  }
});

export default patchMemberReducer;
