import * as Realtime from '@voiceflow/realtime-sdk';

import { safeGetNormalizedByKey } from '@/utils/normalized';

import { createReducer } from '../utils';

const addMemberReducer = createReducer(Realtime.workspace.member.add, (state, { workspaceID, member }) => {
  const workspace = safeGetNormalizedByKey(state, workspaceID);

  workspace?.members.push(member);
});

export default addMemberReducer;
