import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { getAlternativeColor, isColorImage } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import { userIDSelector } from '@/ducks/account/selectors';
import * as Feature from '@/ducks/feature';
import { allEditorMemberIDs as allProjectsEditorMemberIDs } from '@/ducks/projectV2/selectors/base';
import { createCurriedSelector, creatorIDParamSelector } from '@/ducks/utils';
import { idsParamSelector } from '@/ducks/utils/crudV2';
import { isAdminUserRole, isEditorUserRole } from '@/utils/role';

import { activeOrganizationSelector, activeWorkspaceSelector } from './active.organization';

export const membersSelector = createSelector([activeWorkspaceSelector], (workspace) => workspace?.members);

export const normalizedMembersSelector = createSelector([membersSelector], (members) =>
  members ? Normal.denormalize(members) : []
);

export const memberByIDSelector = createSelector([membersSelector, creatorIDParamSelector], (members, creatorID) =>
  members && creatorID !== null ? Normal.getOne(members, String(creatorID)) : null
);

export const membersByIDsSelector = createSelector([membersSelector, idsParamSelector], (members, ids) =>
  members ? Normal.getMany(members, ids) : []
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

export const normalizedPendingMembersSelector = createSelector([pendingMembersSelector], (pendingMembers) =>
  pendingMembers ? Normal.denormalize(pendingMembers) : []
);

export const allNormalizedMembersSelector = createSelector(
  [normalizedMembersSelector, normalizedPendingMembersSelector],
  (members, pendingMembers): Realtime.AnyWorkspaceMember[] => [...members, ...pendingMembers]
);

export const allNormalizedMembersCountSelector = createSelector(
  [allNormalizedMembersSelector],
  (members) => members.length
);

export const editorMemberIDsSelector = createSelector([allNormalizedMembersSelector], (members) =>
  members.filter((member) => isEditorUserRole(member.role)).map((member) => member.creator_id)
);

export const usedEditorSeatsSelector = createSelector(
  [editorMemberIDsSelector, allProjectsEditorMemberIDs],
  (workspaceEditorIDs, projectEditorIDs) => Utils.array.unique([...workspaceEditorIDs, ...projectEditorIDs]).length || 1
);

export const usedViewerSeatsSelector = createSelector(
  [allNormalizedMembersSelector],
  (members) => members.filter((member) => !isEditorUserRole(member.role)).length
);

export const userRoleSelector = createSelector([getMemberByIDSelector, userIDSelector], (getMember, creatorID) => {
  if (!creatorID) return null;

  return getMember({ creatorID })?.role ?? null;
});

export const isLastAdminSelector = createSelector(
  [allNormalizedMembersSelector],
  (members) => members.filter((member) => isAdminUserRole(member.role)).length <= 1
);

export const isCheckoutDisabledSelector = createSelector(
  [activeOrganizationSelector, activeWorkspaceSelector, Feature.isFeatureEnabledSelector],
  (organization, workspace, isFeatureEnabled) => {
    // if on chargebee, don't disable checkout
    if (organization?.subscription) return false;

    return isFeatureEnabled(Realtime.FeatureFlag.DISABLE_CHECKOUT) || workspace?.betaFlag === 1;
  }
);
