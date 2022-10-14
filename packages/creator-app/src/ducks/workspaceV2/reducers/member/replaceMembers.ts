import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const replaceMembersReducer = createReducer(Realtime.workspace.member.replace, (state, { workspaceID, members }) => {
  const workspace = Normal.getOne(state, workspaceID);

  if (!workspace) return;

  workspace.members = members;
});

export default replaceMembersReducer;
