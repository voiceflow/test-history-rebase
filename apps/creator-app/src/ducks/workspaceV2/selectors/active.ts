import { BillingPeriod, PlanType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import dayjs from 'dayjs';
import { createSelector } from 'reselect';

import {
  ENTERPRISE_PLANS,
  PAID_PLANS,
  PRO_AND_TEAM_PLANS,
  PROJECTS_DEFAULT_LIMIT,
  VIEWERS_DEFAULT_LIMIT,
} from '@/constants';
import * as Feature from '@/ducks/feature';
import { getOrganizationByIDSelector } from '@/ducks/organization/organization.select';
import { getSubscriptionEntitlements } from '@/ducks/organization/subscription/subscription.utils';
import * as Session from '@/ducks/session';
import { ChargebeeSubscriptionStatus } from '@/models';

import { activeOrganizationSelector } from './active.organization';
import { allWorkspacesSelector, getWorkspaceByIDSelector } from './base';

export * as members from './active.members';

export const workspaceSelector = createSelector(
  [getWorkspaceByIDSelector, Session.activeWorkspaceIDSelector],
  (getWorkspace, workspaceID) => getWorkspace({ id: workspaceID })
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

export const organizationTrialEndAtSelector = createSelector(
  [activeOrganizationSelector, Feature.isFeatureEnabledSelector],
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
export const organizationTrialExpiredSelector = createSelector(
  [organizationTrialDaysLeftSelector],
  (daysLeft) => daysLeft === 0
);

export const isOnTrialSelector = createSelector([organizationTrialDaysLeftSelector], (daysLeft) => daysLeft !== null);

export const planSelector = createSelector(
  [workspaceSelector, activeOrganizationSelector],
  (workspace, organization) => (organization?.subscription?.plan as PlanType) ?? workspace?.plan ?? null
);

export const isOnProTrialSelector = createSelector(
  [planSelector, isOnTrialSelector],
  (plan, isOnTrial) => isOnTrial && plan === PlanType.PRO
);

// FIXME: remove FF https://voiceflow.atlassian.net/browse/CV3-994
export const numberOfSeatsSelector = createSelector(
  [workspaceSelector, activeOrganizationSelector],
  (workspace, organization) => {
    return organization?.subscription ? organization.subscription.editorSeats : workspace?.seats ?? 1;
  }
);

export const planPeriodSelector = createSelector([activeOrganizationSelector], (organization) =>
  organization?.subscription?.billingPeriodUnit === 'month' ? BillingPeriod.MONTHLY : BillingPeriod.ANNUALLY
);

export const isEnterpriseSelector = createSelector(
  [planSelector],
  (plan) => plan && ENTERPRISE_PLANS.includes(plan as any)
);

export const isProSelector = createSelector([planSelector], (plan) => plan && plan === PlanType.PRO);

export const isProOrTeamSelector = createSelector(
  [planSelector],
  (plan) => plan && PRO_AND_TEAM_PLANS.includes(plan as any)
);

export const isOnPaidPlanSelector = createSelector([planSelector], (plan) => plan && PAID_PLANS.includes(plan as any));

// FIXME: remove FF https://voiceflow.atlassian.net/browse/CV3-994
export const planSeatLimitsSelector = createSelector(
  [workspaceSelector, activeOrganizationSelector],
  (workspace, organization) =>
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

export const dashboardKanbanSettingsSelector = createSelector(
  [settingsSelector],
  (settings) => settings?.dashboardKanban
);

export const activeOrganizationWorkspacesSelector = createSelector(
  [allWorkspacesSelector, workspaceSelector],
  (workspaces, activeWorkspace) => {
    return workspaces.filter((workspace) => workspace.organizationID === activeWorkspace?.organizationID);
  }
);

export const getActiveOrganizationWorkspacesSortedByCreatedAtSelector = createSelector(
  [activeOrganizationWorkspacesSelector],
  (workspaces) => {
    return () => workspaces.sort((a, b) => (dayjs(a.created).isAfter(b.created) ? 1 : -1));
  }
);

export const isLockedSelector = createSelector([stateSelector, activeOrganizationSelector], (state, organization) => {
  return organization?.subscription
    ? organization.subscription.status === ChargebeeSubscriptionStatus.CANCELLED
    : state === Realtime.WorkspaceActivationState.LOCKED;
});

export const isLockedByBeyondLimitSelector = createSelector(
  [activeOrganizationSelector, workspaceSelector, getActiveOrganizationWorkspacesSortedByCreatedAtSelector],
  (organization, activeWorkspace, getActiveOrganizationWorkspacesSortedByCreatedAt) => {
    if (!organization?.subscription) return false;

    const subscriptionEntitlements = getSubscriptionEntitlements(organization.subscription);

    const workspaces = getActiveOrganizationWorkspacesSortedByCreatedAt();
    const index = workspaces.findIndex((workspace) => workspace.id === activeWorkspace?.id);

    const { workspacesLimit } = subscriptionEntitlements;

    return workspacesLimit && index >= workspacesLimit;
  }
);

export const projectsLimitSelector = createSelector(
  [workspaceSelector, activeOrganizationSelector],
  (workspace, organization) =>
    organization?.subscription?.entitlements.agentsLimit ?? workspace?.projects ?? PROJECTS_DEFAULT_LIMIT
);

export const quotasSelector = createSelector([workspaceSelector], (workspace) => workspace?.quotas);

export const viewerPlanSeatLimitsSelector = createSelector(
  [planSeatLimitsSelector],
  (planSeatLimits) => planSeatLimits?.viewer ?? VIEWERS_DEFAULT_LIMIT
);

export const editorPlanSeatLimitsSelector = createSelector(
  [planSeatLimitsSelector],
  (planSeatLimits) => planSeatLimits?.editor ?? 1
);

// FIXME: remove FF https://voiceflow.atlassian.net/browse/CV3-994
export const variableStatesLimitSelector = createSelector(
  [workspaceSelector, activeOrganizationSelector],
  (workspace, organization) => organization?.subscription?.entitlements.personasLimit ?? workspace?.variableStatesLimit
);

export const organizationIDSelector = createSelector(
  [workspaceSelector],
  (workspace) => workspace?.organizationID ?? null
);
