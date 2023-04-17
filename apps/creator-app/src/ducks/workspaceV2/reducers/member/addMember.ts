import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const addMemberReducer = createReducer(Realtime.workspace.member.add, (state, { workspaceID, member }) => {
  const workspace = Normal.getOne(state, workspaceID);

  if (!workspace) return;

  if (Realtime.Utils.typeGuards.isWorkspaceMember(member)) {
    workspace.members = Normal.append(workspace.members, String(member.creator_id), member);

    return;
  }

  workspace.pendingMembers = Normal.append(workspace.pendingMembers, String(member.email), member);
});

export default addMemberReducer;
