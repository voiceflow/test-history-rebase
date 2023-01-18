import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const removeMemberReducer = createReducer(Realtime.workspace.member.remove, (state, { workspaceID, creatorID }) => {
  const workspace = Normal.getOne(state, workspaceID);

  if (workspace) {
    workspace.members = workspace.members.filter((member) => member.creator_id !== creatorID);
  }
});

export default removeMemberReducer;
