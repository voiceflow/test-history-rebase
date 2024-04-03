import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const topicAddReducer = createReducer(Realtime.domain.topicAdd, (state, { topicID, domainID }) => {
  if (!domainID) return;

  const domain = Normal.getOne(state, domainID);

  if (!domain) return;

  domain.topicIDs.push(topicID);
});

export default topicAddReducer;
