import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const removeMemberReducer = createReducer(Realtime.organization.member.remove, (state, { organizationID, creatorID }) => {
  const organization = Normal.getOne(state, organizationID);

  if (!organization) return;

  organization.members = Normal.removeOne(organization.members, String(creatorID));
});

export default removeMemberReducer;
