import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const addMemberReducer = createReducer(Realtime.project.member.add, (state, { projectID, member }) => {
  const project = Normal.getOne(state, projectID);

  if (!project) return;

  project.members = Normal.append(project.members, String(member.creatorID), member);
});

export default addMemberReducer;
