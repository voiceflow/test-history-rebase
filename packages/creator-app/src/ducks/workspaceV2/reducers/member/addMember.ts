import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from '../utils';

const addMemberReducer = createReducer(Realtime.workspace.member.add, (state, { workspaceID, member }) => {
  const workspace = Utils.normalized.safeGetNormalizedByKey(state, workspaceID);

  workspace?.members.push(member);
});

export default addMemberReducer;
