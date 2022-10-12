import { DBWorkspace, Member, PendingMember, Workspace, WorkspaceActivationState } from '@realtime-sdk/models';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

import memberAdapter from './member';

export const INVALID_STATES = ['incomplete_expired', 'incomplete', 'unpaid'];
export const WARNING_STATES = ['past_due'];

const workspaceAdapter = createMultiAdapter<DBWorkspace, Workspace>(
  ({
    boards,
    created,
    creator_id,
    hasSource,
    image,
    name,
    projects,
    seats,
    seatLimits,
    team_id,
    stripe_status,
    members,
    plan,
    beta_flag,
    organization_id,
    organization_trial_days_left,
    variableStatesLimit,
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
      boards,
      created,
      seatLimits,
      creatorID: creator_id,
      hasSource,
      image,
      projects,
      seats,
      state,
      plan,
      members,
      betaFlag: beta_flag,
      organizationID: organization_id,
      organizationTrialDaysLeft: organization_trial_days_left,
      variableStatesLimit,
    };
  },
  notImplementedAdapter.transformer
);

export default {
  ...workspaceAdapter,
  mapFromDB: (dbWorkspaces: DBWorkspace[]) => workspaceAdapter.mapFromDB(dbWorkspaces),
};

export const workspaceWithMembersAdapter = {
  ...createMultiAdapter<{ workspace: DBWorkspace; members: Array<Member | PendingMember> }, Workspace>(
    ({ workspace, members }) => ({ ...workspaceAdapter.fromDB(workspace), members: memberAdapter.mapFromDB(members) }),
    notImplementedAdapter.transformer
  ),
  mapFromDB: notImplementedAdapter.transformer,
};
