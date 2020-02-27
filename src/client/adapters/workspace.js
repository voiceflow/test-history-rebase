import { AdapterNotImplementedError, createAdapter } from './utils';

export const INVALID_STATES = ['incomplete_expired', 'incomplete', 'unpaid'];
export const WARNING_STATES = ['past_due'];

const workspaceAdapter = createAdapter(
  ({ boards, created, creator_id, hasSource, image, name, projects, seats, seatLimits, team_id, stripe_status, members, plan }) => {
    let state;
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
    };
  },
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default workspaceAdapter;
