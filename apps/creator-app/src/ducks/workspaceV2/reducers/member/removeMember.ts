import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const removeMemberReducer = createReducer(Realtime.workspace.member.remove, (state, { workspaceID, creatorID }) => {
  const workspace = Normal.getOne(state, workspaceID);

  if (!workspace) return;

  workspace.members = Normal.removeOne(workspace.members, String(creatorID));
});

export default removeMemberReducer;
