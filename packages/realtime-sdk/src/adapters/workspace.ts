import { DBWorkspace, Workspace, WorkspaceActivationState } from '@realtime-sdk/models';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

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
      members,
      created,
      projects,
      betaFlag: beta_flag,
      creatorID: creator_id,
      hasSource,
      seatLimits,
      organizationID: organization_id,
      variableStatesLimit,
      organizationTrialDaysLeft: organization_trial_days_left,
    };
  },
  notImplementedAdapter.transformer
);

export default {
  ...workspaceAdapter,
  mapFromDB: (dbWorkspaces: DBWorkspace[]) => workspaceAdapter.mapFromDB(dbWorkspaces),
};
