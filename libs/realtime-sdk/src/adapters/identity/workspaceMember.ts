import { createSimpleAdapter, notImplementedAdapter } from 'bidirectional-adapter';
import uniqBy from 'lodash/uniqBy';

import type { Identity, WorkspaceMember } from '@/models';
import { getRoleStrength } from '@/utils/role';

const workspaceMemberSimpleAdapter = createSimpleAdapter<Identity.WorkspaceMember, WorkspaceMember>(
  ({ user, membership }) => ({
    name: user.name,
    role: membership.role,
    email: user.email,
    image: user.image ?? '',
    created: user.createdAt,
    creator_id: user.id,
  }),
  notImplementedAdapter.transformer
);

const workspaceMemberAdapter = {
  ...workspaceMemberSimpleAdapter,

  mapFromDB: (members: Identity.WorkspaceMember[]): WorkspaceMember[] =>
    uniqBy(
      members
        .map(workspaceMemberSimpleAdapter.fromDB)
        .sort((a, b) => getRoleStrength(b.role) - getRoleStrength(a.role)),
      (member) => member.creator_id
    ),

  mapToDB: notImplementedAdapter.multi.mapToDB,
};

export default workspaceMemberAdapter;
