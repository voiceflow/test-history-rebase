import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const patchMemberReducer = createReducer(
  Realtime.workspace.member.patch,
  (state, { workspaceID, creatorID, member: patch }) => {
    const workspace = Normal.getOne(state, workspaceID);

    if (!workspace) return;

    workspace.members = Normal.patch(workspace.members, String(creatorID), patch);
  }
);

export default patchMemberReducer;
