import { Identity, ProjectMember } from '@realtime-sdk/models';
import { getRoleStrength } from '@realtime-sdk/utils/role';
import { ProjectUserRole } from '@voiceflow/dtos';
import { createSimpleAdapter, notImplementedAdapter } from 'bidirectional-adapter';
import uniqBy from 'lodash/uniqBy';

const projectMemberSimpleAdapter = createSimpleAdapter<Identity.ProjectMember, ProjectMember>(
  ({ user, membership }) => ({
    role: membership.role as ProjectUserRole,
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
