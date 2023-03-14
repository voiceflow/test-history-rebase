import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { isEditorUserRole } from '@/utils/role';

import { createReducer } from '../utils';

const patchWorkspaceMemberReducer = createReducer(Realtime.workspace.member.patch, (state, { creatorID, member: patch }) => {
  Object.values(state.byKey).forEach((project) => {
    const member = Normal.getOne(project.members, String(creatorID));

    if (!member) return;

    // do nothing if the member is not an editor and the workspace patch is an editor
    if (!isEditorUserRole(member.role) || isEditorUserRole(patch.role)) return;

    member.role = UserRole.VIEWER;
  });
});

export default patchWorkspaceMemberReducer;
