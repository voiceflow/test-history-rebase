import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const removeMemberReducer = createReducer(Realtime.project.member.remove, (state, { projectID, creatorID }) => {
  const project = Normal.getOne(state, projectID);

  if (!project) return;

  project.members = Normal.removeOne(project.members, String(creatorID));
});

export default removeMemberReducer;
