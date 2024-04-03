import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const topicRemoveReducer = createReducer(Realtime.domain.topicRemove, (state, { topicID, domainID }) => {
  if (!domainID) return;

  const domain = Normal.getOne(state, domainID);

  if (!domain) return;

  domain.topicIDs = Utils.array.withoutValue(domain.topicIDs, topicID);
});

export default topicRemoveReducer;
