import { DBWorkspace, Workspace, WorkspaceActivationState } from '@realtime-sdk/models';
import { isWorkspaceMember, isWorkspacePendingMember } from '@realtime-sdk/utils/typeGuards';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';
import * as Normal from 'normal-store';

export const INVALID_STATES = ['incomplete_expired', 'incomplete', 'unpaid'];
export const WARNING_STATES = ['past_due'];

const workspaceAdapter = createMultiAdapter<DBWorkspace, Workspace>(
  ({
    plan,
    name,
    seats,
    image,
    boards,
    team_id,
    members,
    created,
    projects,
    hasSource,
    beta_flag,
    seatLimits,
    creator_id,
    stripe_status,
    organization_id,
    variableStatesLimit,
    organization_trial_days_left,
    settings = { aiAssist: true, dashboardKanban: false },
  }) => {
    let state: WorkspaceActivationState | null = null;
    if (INVALID_STATES.includes(stripe_status)) {
      state = 'LOCKED';
    } else if (WARNING_STATES.includes(stripe_status)) {
      state = 'WARNING';
    }

    return {
      id: team_id,
      name,
      plan,
      image,
      seats,
      state,
      boards,
      members: Normal.normalize(members.filter(isWorkspaceMember), (member) => String(member.creator_id)),
      created,
      projects,
      settings,
      betaFlag: beta_flag,
      creatorID: creator_id,
      hasSource,
      seatLimits,
      pendingMembers: Normal.normalize(members.filter(isWorkspacePendingMember), (member) => member.email),
      organizationID: organization_id,
      variableStatesLimit,
      organizationTrialDaysLeft: organization_trial_days_left,
    };
  },
  notImplementedAdapter.transformer
);

export default workspaceAdapter;
