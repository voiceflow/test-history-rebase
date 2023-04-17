import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const changeSeatsReducer = createReducer(Realtime.workspace.changeSeats, (state, { seats, schedule, workspaceID }) => {
  const workspace = Normal.getOne(state, workspaceID);

  if (!workspace || schedule) return;

  workspace.seats = seats;
});

export default changeSeatsReducer;
