import { WorkspaceActivationState } from '@realtime-sdk/constants';
import { DBWorkspace, Workspace } from '@realtime-sdk/models';
import { isWorkspaceMember, isWorkspacePendingMember } from '@realtime-sdk/utils/typeGuards';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';
import * as Normal from 'normal-store';

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
    settings = { aiAssist: true },
    hasSource,
    beta_flag,
    seatLimits,
    creator_id,
    stripe_status,
    organization_id,
    variableStatesLimit,
    organization_trial_days_left,
  }) => {
    let state: WorkspaceActivationState | null = null;

    if (INVALID_STATES.includes(stripe_status)) {
      state = WorkspaceActivationState.LOCKED;
    } else if (WARNING_STATES.includes(stripe_status)) {
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
      betaFlag: beta_flag,
      creatorID: creator_id,
      hasSource,
      planSeatLimits: seatLimits,
      pendingMembers: Normal.normalize(members.filter(isWorkspacePendingMember), (member) => member.email),
      organizationID: organization_id,
      variableStatesLimit,
      organizationTrialDaysLeft: organization_trial_days_left,

      // TODO: remove this when all clients are updated to latest version, typically in a few weeks after fe release
      seatLimits,
    };
  },
  notImplementedAdapter.transformer
);

export default workspaceAdapter;
