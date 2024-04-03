import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const topicReorderReducer = createReducer(Realtime.domain.topicReorder, (state, { topicID, domainID, toIndex }) => {
  if (!domainID) return;

  const domain = Normal.getOne(state, domainID);

  if (!domain) return;

  const fromIndex = domain.topicIDs.indexOf(topicID);

  domain.topicIDs = Utils.array.reorder(domain.topicIDs, fromIndex, toIndex);
});

export default topicReorderReducer;
