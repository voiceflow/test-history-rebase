import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { ProjectMemberControllerFindAllForWorkspace200Item } from '@voiceflow/sdk-identity/generated';
import { createSimpleAdapter, notImplementedAdapter } from 'bidirectional-adapter';
import uniqBy from 'lodash/uniqBy';

const projectMemberSimpleAdapter = createSimpleAdapter<ProjectMemberControllerFindAllForWorkspace200Item, Realtime.ProjectMember>(
  ({ membership, user }) => ({ creatorID: user.id, role: membership.role as Realtime.ProjectMember['role'] }),
  notImplementedAdapter.transformer
);

export const projectMemberAdapter = {
  ...projectMemberSimpleAdapter,

  mapFromDB: (members: ProjectMemberControllerFindAllForWorkspace200Item[]): Realtime.ProjectMember[] =>
    uniqBy(
      members
        .map(projectMemberSimpleAdapter.fromDB)
        .sort((a, b) => Realtime.Utils.role.getRoleStrength(b.role) - Realtime.Utils.role.getRoleStrength(a.role)),
      (member) => member.creatorID
    ),

  mapToDB: notImplementedAdapter.multi.mapToDB,
};
