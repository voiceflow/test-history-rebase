import * as Realtime from '@voiceflow/realtime-sdk';

import { safeGetNormalizedByKey } from '@/utils/normalized';

import { createReducer } from '../utils';

const patchMemberReducer = createReducer(Realtime.workspace.member.patch, (state, { workspaceID, creatorID, member: patch }) => {
  const workspace = safeGetNormalizedByKey(state, workspaceID);
  const member = workspace?.members.find((member) => member.creator_id === creatorID);

  if (member) {
    Object.assign(member, patch);
  }
});

export default patchMemberReducer;
