import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const patchMemberReducer = createReducer(
  Realtime.project.member.patch,
  (state, { projectID, creatorID, member: patch }) => {
    const project = Normal.getOne(state, projectID);

    if (!project) return;

    project.members = Normal.patch(project.members, String(creatorID), patch);
  }
);

export default patchMemberReducer;
