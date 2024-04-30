import { createSimpleAdapter, notImplementedAdapter } from 'bidirectional-adapter';
import uniqBy from 'lodash/uniqBy';

import type { Identity, ProjectMember } from '@/models';
import { getRoleStrength } from '@/utils/role';

const projectMemberSimpleAdapter = createSimpleAdapter<Identity.ProjectMember, ProjectMember>(
  ({ user, membership }) => ({
    role: membership.role,
    creatorID: user.id,
  }),
  notImplementedAdapter.transformer
);

const projectMemberAdapter = {
  ...projectMemberSimpleAdapter,

  mapFromDB: (members: Identity.ProjectMember[]): ProjectMember[] =>
    uniqBy(
      members.map(projectMemberSimpleAdapter.fromDB).sort((a, b) => getRoleStrength(b.role) - getRoleStrength(a.role)),
      (member) => member.creatorID
    ),

  mapToDB: notImplementedAdapter.multi.mapToDB,
};

export default projectMemberAdapter;
