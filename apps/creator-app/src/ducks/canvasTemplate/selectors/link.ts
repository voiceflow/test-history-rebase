import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import { idParamSelector } from '@/ducks/utils/crudV2';

import { creatorStateSelector } from './base';

export const linkIDsByNodeIDSelector = createSelector(
  [creatorStateSelector, idParamSelector],
  ({ linkIDsByNodeID }, nodeID) => (nodeID ? linkIDsByNodeID[nodeID] ?? [] : [])
);

export const linksByNodeIDSelector = createSelector(
  [creatorStateSelector, linkIDsByNodeIDSelector],
  ({ links }, linkIDs) => Normal.getMany(links, linkIDs)
);

export const linkIDsByPortIDSelector = createSelector(
  [creatorStateSelector, idParamSelector],
  ({ linkIDsByPortID }, portID) => (portID ? linkIDsByPortID[portID] ?? [] : [])
);

export const linksByPortIDSelector = createSelector(
  [creatorStateSelector, linkIDsByPortIDSelector],
  ({ links }, linkIDs) => Normal.getMany(links, linkIDs)
);
