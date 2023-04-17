import { Identity, WorkspaceMember } from '@realtime-sdk/models';
import { getRoleStrength } from '@realtime-sdk/utils/role';
import { createSimpleAdapter, notImplementedAdapter } from 'bidirectional-adapter';
import _ from 'lodash';

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
    _.uniqBy(
      members.map(workspaceMemberSimpleAdapter.fromDB).sort((a, b) => getRoleStrength(b.role) - getRoleStrength(a.role)),
      'creator_id'
    ),

  mapToDB: notImplementedAdapter.multi.mapToDB,
};

export default workspaceMemberAdapter;
