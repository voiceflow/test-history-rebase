import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const addMemberReducer = createReducer(Realtime.workspace.member.add, (state, { workspaceID, member }) => {
  const workspace = Normal.getOne(state, workspaceID);

  workspace?.members.push(member);
});

export default addMemberReducer;
