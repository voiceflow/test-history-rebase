import { Utils } from '@voiceflow/common';
import { BillingPeriod, PlanType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { getAlternativeColor, isColorImage } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import { ENTERPRISE_PLANS, PAID_PLANS, PRO_AND_TEAM_PLANS, PROJECTS_DEFAULT_LIMIT, VIEWERS_DEFAULT_LIMIT } from '@/constants';
import { userIDSelector } from '@/ducks/account/selectors';
import * as Feature from '@/ducks/feature';
import { getOrganizationByIDSelector } from '@/ducks/organization/organization.select';
import { allEditorMemberIDs as allProjectsEditorMemberIDs } from '@/ducks/projectV2/selectors/base';
import * as Session from '@/ducks/session';
import { createCurriedSelector, creatorIDParamSelector } from '@/ducks/utils';
import { idsParamSelector } from '@/ducks/utils/crudV2';
import { ChargebeeSubscriptionStatus } from '@/models';
import { isAdminUserRole, isEditorUserRole } from '@/utils/role';

import { getWorkspaceByIDSelector } from './base';

export const workspaceSelector = createSelector([getWorkspaceByIDSelector, Session.activeWorkspaceIDSelector], (getWorkspace, workspaceID) =>
  getWorkspace({ id: workspaceID })
);

export const hasWorkspaceSelector = createSelector([workspaceSelector], (workspace) => !!workspace);

export const organizationTrialDaysLeftSelector = createSelector(
  [workspaceSelector, getOrganizationByIDSelector],
  (workspace, getOrganizationByID) => {
    // calling the organization duck selector causes a initialization error
    const organization = workspace?.organizationID ? getOrganizationByID({ id: workspace.organizationID }) : null;

    if (organization?.subscription) {
      return organization.subscription.trial?.daysLeft ?? null;
    }

    return organization?.trial?.daysLeft ?? null;
  }
);

// calling the organization duck selector causes a initilization error
export const localOrganizationSelector = createSelector([workspaceSelector, getOrganizationByIDSelector], (workspace, getOrganizationByID) => {
  if (!workspace?.organizationID) return null;

  return getOrganizationByID({ id: workspace.organizationID });
});

export const organizationTrialEndAtSelector = createSelector(
  [localOrganizationSelector, Feature.isFeatureEnabledSelector],
  (organization, isFeatureEnabled) => {
    if (isFeatureEnabled(Realtime.FeatureFlag.PRO_REVERSE_TRIAL)) {
      if (organization?.subscription) {
        return organization.subscription.trial?.endAt ?? null;
      }

      return organization?.trial?.endAt ?? null;
    }
    return null;
  }
);

// TODO: move into organization duck when migrated to new trial system
export const organizationTrialExpiredSelector = createSelector([organizationTrialDaysLeftSelector], (daysLeft) => daysLeft === 0);

export const isOnTrialSelector = createSelector([organizationTrialDaysLeftSelector], (daysLeft) => daysLeft !== null);

export const isOnProTrialSelector = createSelector(
  [workspaceSelector, isOnTrialSelector],
  (workspace, isOnTrial) => isOnTrial && workspace?.plan === PlanType.PRO
);

// FIXME: remove FF https://voiceflow.atlassian.net/browse/CV3-994
export const numberOfSeatsSelector = createSelector([workspaceSelector, localOrganizationSelector], (workspace, organization) => {
  return organization?.subscription ? organization.subscription.editorSeats : workspace?.seats ?? 1;
});

export const planSelector = createSelector(
  [workspaceSelector, localOrganizationSelector],
  (workspace, organization) => (organization?.subscription?.plan as PlanType) ?? workspace?.plan ?? null
);

export const planPeriodSelector = createSelector([localOrganizationSelector], (organization) =>
  organization?.subscription?.billingPeriodUnit === 'month' ? BillingPeriod.MONTHLY : BillingPeriod.ANNUALLY
);

export const isEnterpriseSelector = createSelector([planSelector], (plan) => plan && ENTERPRISE_PLANS.includes(plan as any));

export const isProSelector = createSelector([planSelector], (plan) => plan && plan === PlanType.PRO);

export const isProOrTeamSelector = createSelector([planSelector], (plan) => plan && PRO_AND_TEAM_PLANS.includes(plan as any));

export const isOnPaidPlanSelector = createSelector([planSelector], (plan) => plan && PAID_PLANS.includes(plan as any));

// FIXME: remove FF https://voiceflow.atlassian.net/browse/CV3-994
export const planSeatLimitsSelector = createSelector([workspaceSelector, localOrganizationSelector], (workspace, organization) =>
  organization?.subscription
    ? {
        viewer: VIEWERS_DEFAULT_LIMIT,
        editor: organization.subscription.entitlements.editorSeatsLimit,
      }
    : workspace?.planSeatLimits
);

export const nameSelector = createSelector([workspaceSelector], (workspace) => workspace?.name);

export const imageSelector = createSelector([workspaceSelector], (workspace) => workspace?.image);

export const stateSelector = createSelector([workspaceSelector], (workspace) => workspace?.state);

export const stripeStatusSelector = createSelector([workspaceSelector], (workspace) => workspace?.stripeStatus);

export const settingsSelector = createSelector([workspaceSelector], (workspace) => workspace?.settings);

export const dashboardKanbanSettingsSelector = createSelector([settingsSelector], (settings) => settings?.dashboardKanban);

export const isLockedSelector = createSelector([stateSelector, localOrganizationSelector], (state, organization) =>
  organization?.subscription
    ? organization.subscription.status === ChargebeeSubscriptionStatus.CANCELLED
    : state === Realtime.WorkspaceActivationState.LOCKED
);

export const projectsLimitSelector = createSelector(
  [workspaceSelector, localOrganizationSelector],
  (workspace, organization) => organization?.subscription?.entitlements.agentsLimit ?? workspace?.projects ?? PROJECTS_DEFAULT_LIMIT
);

export const quotasSelector = createSelector([workspaceSelector], (workspace) => workspace?.quotas);

export const viewerPlanSeatLimitsSelector = createSelector(
  [planSeatLimitsSelector],
  (planSeatLimits) => planSeatLimits?.viewer ?? VIEWERS_DEFAULT_LIMIT
);

export const editorPlanSeatLimitsSelector = createSelector([planSeatLimitsSelector], (planSeatLimits) => planSeatLimits?.editor ?? 1);

// FIXME: remove FF https://voiceflow.atlassian.net/browse/CV3-994
export const variableStatesLimitSelector = createSelector(
  [workspaceSelector, localOrganizationSelector],
  (workspace, organization) => organization?.subscription?.entitlements.personasLimit ?? workspace?.variableStatesLimit
);

export const organizationIDSelector = createSelector([workspaceSelector], (workspace) => workspace?.organizationID ?? null);

export const membersSelector = createSelector([workspaceSelector], (workspace) => workspace?.members);

export const normalizedMembersSelector = createSelector([membersSelector], (members) => (members ? Normal.denormalize(members) : []));

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
      ? { ...workspaceMember, color: isColorImage(workspaceMember.image) ? workspaceMember.image : getAlternativeColor(nodeID) }
      : null;
  }
);

export const hasMemberByIDSelector = createSelector([getMemberByIDSelector], (getMember) => (creatorID: number) => !!getMember({ creatorID }));

export const pendingMembersSelector = createSelector([workspaceSelector], (workspace) => workspace?.pendingMembers);

export const normalizedPendingMembersSelector = createSelector([pendingMembersSelector], (pendingMembers) =>
  pendingMembers ? Normal.denormalize(pendingMembers) : []
);

export const allNormalizedMembersSelector = createSelector(
  [normalizedMembersSelector, normalizedPendingMembersSelector],
  (members, pendingMembers): Realtime.AnyWorkspaceMember[] => [...members, ...pendingMembers]
);

export const allNormalizedMembersCountSelector = createSelector([allNormalizedMembersSelector], (members) => members.length);

export const editorMemberIDsSelector = createSelector([allNormalizedMembersSelector], (members) =>
  members.filter((member) => isEditorUserRole(member.role)).map((member) => member.creator_id)
);

export const usedEditorSeatsSelector = createSelector(
  [editorMemberIDsSelector, allProjectsEditorMemberIDs],
  (memberIDs, projectMemberIDs) => Utils.array.unique([...memberIDs, ...projectMemberIDs]).length || 1
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
