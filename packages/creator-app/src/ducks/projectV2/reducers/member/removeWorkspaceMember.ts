import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const removeWorkspaceMember = createReducer(Realtime.workspace.member.remove, (state, { creatorID }) => {
  Object.values(state.byKey).forEach((project) => {
    project.members = Normal.remove(project.members, String(creatorID));
  });
});

export default removeWorkspaceMember;
