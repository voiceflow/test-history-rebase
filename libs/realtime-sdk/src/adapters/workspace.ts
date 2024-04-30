import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';
import * as Normal from 'normal-store';

import { WorkspaceActivationState } from '@/constants';
import type { DBWorkspace, Workspace } from '@/models';
import { isWorkspaceMember, isWorkspacePendingMember } from '@/utils/typeGuards';

export const INVALID_STATES = ['incomplete_expired', 'incomplete', 'unpaid', 'canceled'];
export const WARNING_STATES = ['past_due'];

const workspaceAdapter = createMultiAdapter<DBWorkspace, Workspace>(
  ({
    plan,
    name,
    seats,
    image,
    team_id,
    members,
    created,
    projects,
    settings = { aiAssist: true, dashboardKanban: false },
    seatLimits,
    creator_id,
    stripe_status,
    organization_id,
    variableStatesLimit,
    organization_trial_days_left,
  }) => {
    let state: WorkspaceActivationState | null = null;

    if (stripe_status && INVALID_STATES.includes(stripe_status)) {
      state = WorkspaceActivationState.LOCKED;
    } else if (stripe_status && WARNING_STATES.includes(stripe_status)) {
      state = WorkspaceActivationState.WARNING;
    }

    return {
      id: team_id,
      name,
      plan,
      image,
      seats,
      state,
      members: Normal.normalize(members.filter(isWorkspaceMember), (member) => String(member.creator_id)),
      created,
      projects,
      settings,
      creatorID: creator_id,
      planSeatLimits: seatLimits,
      pendingMembers: Normal.normalize(members.filter(isWorkspacePendingMember), (member) => member.email),
      organizationID: organization_id,
      variableStatesLimit,
      organizationTrialDaysLeft: organization_trial_days_left,
      stripeStatus: stripe_status,

      // TODO: remove this when all clients are updated to latest version, typically in a few weeks after fe release
      seatLimits,
    };
  },
  notImplementedAdapter.transformer
);

export default workspaceAdapter;
