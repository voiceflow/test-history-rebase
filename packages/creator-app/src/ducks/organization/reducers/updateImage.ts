import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const updateImageReducer = createReducer(Realtime.organization.updateImage, (state, { organizationID, image }) => {
  const organization = Normal.getOne(state, organizationID);

  if (organization) {
    organization.image = image;
  }
});

export default updateImageReducer;
