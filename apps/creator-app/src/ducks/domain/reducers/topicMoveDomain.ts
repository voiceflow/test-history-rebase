import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const topicMoveDomainReducer = createReducer(Realtime.domain.topicMoveDomain, (state, { topicDiagramID, domainID, newDomainID }) => {
  if (!domainID) return;

  const oldDomain = Normal.getOne(state, domainID);
  const newDomain = Normal.getOne(state, newDomainID);

  if (!oldDomain || !newDomain) return;

  newDomain.topicIDs.push(topicDiagramID);
  oldDomain.topicIDs = Utils.array.withoutValue(oldDomain.topicIDs, topicDiagramID);
});

export default topicMoveDomainReducer;
