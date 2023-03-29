import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const updateNameReducer = createReducer(Realtime.organization.updateName, (state, { organizationID, name }) => {
  const organization = Normal.getOne(state, organizationID);

  if (organization) {
    organization.name = name;
  }
});

export default updateNameReducer;
