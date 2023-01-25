import { Identity, ProjectMember } from '@realtime-sdk/models';
import { getRoleStrength } from '@realtime-sdk/utils/role';
import { createSimpleAdapter, notImplementedAdapter } from 'bidirectional-adapter';
import _ from 'lodash';

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
    _.uniqBy(
      members.map(projectMemberSimpleAdapter.fromDB).sort((a, b) => getRoleStrength(b.role) - getRoleStrength(a.role)),
      'creatorID'
    ),

  mapToDB: notImplementedAdapter.multi.mapToDB,
};

export default projectMemberAdapter;
