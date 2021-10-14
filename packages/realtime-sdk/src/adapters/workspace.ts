/* eslint-disable camelcase */
import { DBWorkspace, Workspace, WorkspaceActivationState } from '../models';
import { sortWorkspaces } from '../utils/workspace';
import { AdapterNotImplementedError, createAdapter } from './utils';

export const INVALID_STATES = ['incomplete_expired', 'incomplete', 'unpaid'];
export const WARNING_STATES = ['past_due'];

const workspaceAdapter = createAdapter<DBWorkspace, Workspace>(
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
    templates,
    organization_id,
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
      templates,
      betaFlag: beta_flag,
      organizationID: organization_id,
    };
  },
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default {
  ...workspaceAdapter,
  mapFromDB: (dbWorkspaces: DBWorkspace[]) => sortWorkspaces(workspaceAdapter.mapFromDB(dbWorkspaces)),
};
