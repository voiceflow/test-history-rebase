import { Utils } from '@voiceflow/common';
import { OrganizationMember, RoleScope } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { WorkspaceMember } from '@voiceflow/realtime-sdk';
import { getAlternativeColor, isColorImage } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import { Normalized } from 'normal-store';
import { createSelector } from 'reselect';

import { userIDSelector } from '@/ducks/account/selectors';
import * as Feature from '@/ducks/feature';
import { allEditorMemberIDs as allProjectsEditorMemberIDs } from '@/ducks/projectV2/selectors/base';
import { createCurriedSelector, creatorIDParamSelector } from '@/ducks/utils';
import { isAdminUserRole, isEditorUserRole } from '@/utils/role';

import { activeOrganizationSelector, activeWorkspaceSelector } from './active.organization';

const toWorkspaceMember = ({ creatorID, name, image, createdAt, role, email }: OrganizationMember): WorkspaceMember => {
  return {
    name,
    image,
    role,
    email,
    creator_id: creatorID,
    created: createdAt,
  };
};

export const membersSelector = createSelector(
  [activeWorkspaceSelector, activeOrganizationSelector, Feature.isFeatureEnabledSelector],
  (workspace, organization, isFeatureEnabled): Normalized<WorkspaceMember> | undefined => {
    if (
      !isFeatureEnabled(Realtime.FeatureFlag.NEW_WORKSPACE_MEMBERS) ||
      !isFeatureEnabled(Realtime.FeatureFlag.NEW_ORGANIZATION_MEMBERS)
    ) {
      return workspace?.members;
    }

    const workspaceMembers =
      organization?.members?.filter(
        (member) => member.workspaceID === workspace?.id && member.scope === RoleScope.WORKSPACE
      ) ?? [];

    return Normal.normalize(workspaceMembers.map(toWorkspaceMember), ({ creator_id }) => creator_id.toString());
  }
);

export const membersListSelector = createSelector([membersSelector], (members) =>
  members ? Normal.denormalize(members) : []
);

export const memberByIDSelector = createSelector([membersSelector, creatorIDParamSelector], (members, creatorID) =>
  members && creatorID !== null ? Normal.getOne(members, String(creatorID)) : null
);

export const getMemberByIDSelector = createCurriedSelector(memberByIDSelector);

export const getDistinctMemberByCreatorIDSelector = createSelector(
  [getMemberByIDSelector],
  (getWorkspaceMember) => (creatorID: number, nodeID: string) => {
    const workspaceMember = getWorkspaceMember({ creatorID });

    return workspaceMember
      ? {
          ...workspaceMember,
          color: isColorImage(workspaceMember.image) ? workspaceMember.image : getAlternativeColor(nodeID),
        }
      : null;
  }
);

export const hasMemberByIDSelector = createSelector(
  [getMemberByIDSelector],
  (getMember) => (creatorID: number) => !!getMember({ creatorID })
);

export const pendingMembersSelector = createSelector(
  [activeWorkspaceSelector],
  (workspace) => workspace?.pendingMembers
);

const pendingMembersListSelector = createSelector([pendingMembersSelector], (pendingMembers) =>
  pendingMembers ? Normal.denormalize(pendingMembers) : []
);

export const allMembersListSelector = createSelector(
  [membersListSelector, pendingMembersListSelector],
  (members, pendingMembers): Realtime.AnyWorkspaceMember[] => [...members, ...pendingMembers]
);

export const allMembersCountSelector = createSelector([allMembersListSelector], (members) => members.length);

export const editorMemberIDsSelector = createSelector([allMembersListSelector], (members) =>
  members.filter((member) => isEditorUserRole(member.role)).map((member) => member.creator_id)
);

export const usedEditorSeatsSelector = createSelector(
  [editorMemberIDsSelector, allProjectsEditorMemberIDs],
  (workspaceEditorIDs, projectEditorIDs) => Utils.array.unique([...workspaceEditorIDs, ...projectEditorIDs]).length || 1
);

export const usedViewerSeatsSelector = createSelector(
  [allMembersListSelector],
  (members) => members.filter((member) => !isEditorUserRole(member.role)).length
);

export const userRoleSelector = createSelector([getMemberByIDSelector, userIDSelector], (getMember, creatorID) => {
  if (!creatorID) return null;

  return getMember({ creatorID })?.role ?? null;
});

export const isLastAdminSelector = createSelector(
  [allMembersListSelector],
  (members) => members.filter((member) => isAdminUserRole(member.role)).length <= 1
);
