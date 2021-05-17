import { createSelector } from 'reselect';

import * as Creator from '@/ducks/creator';
import * as Session from '@/ducks/session';
import * as CRUD from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

// selectors

export const {
  root: rootThreadsSelector,
  all: allThreadsSelector,
  byID: threadByIDSelector,
  findByIDs: threadsByIDsSelector,
  has: hasThreadsSelector,
} = CRUD.createCRUDSelectors(STATE_KEY);

export const allThreadIdsSelector = createSelector([allThreadsSelector, Session.activeDiagramIDSelector], (threads, diagramID) =>
  threads.filter((thread) => thread.diagramID === diagramID).map((thread) => thread.id)
);

export const allUndeletedTheads = createSelector(allThreadsSelector, (threads) => threads.filter((thread) => !thread.deleted));

export const openThreads = createSelector([allUndeletedTheads], (threads) => threads.filter((thread) => !thread.resolved).reverse());

export const resolvedThreads = createSelector([allUndeletedTheads], (threads) => threads.filter((thread) => thread.resolved).reverse());

export const hasThreads = createSelector([allThreadsSelector], (threads) => !!threads.filter((thread) => !thread.deleted).length);

export const activeDiagramThreadsSelector = createSelector(
  [allUndeletedTheads, Session.activeDiagramIDSelector, Creator.allNodeIDsSelector],
  (threads, diagramID, nodeIDs) =>
    threads.filter((thread) => thread.diagramID === diagramID && !thread.resolved && (!thread.nodeID || nodeIDs.includes(thread.nodeID)))
);

export const activeDiagramThreadIDsSelector = createSelector([activeDiagramThreadsSelector], (threads) => threads.map(({ id }) => id));

export const threadIDsByNodeIDSelector = createSelector([allThreadsSelector], (threads) => (nodeID: string) =>
  threads.filter((thread) => thread.nodeID === nodeID).map(({ id }) => id)
);

export const hasUnreadCommentsSelector = createSelector(
  [rootThreadsSelector],
  ({ hasUnreadComments, allKeys }) => hasUnreadComments && !!allKeys.length
);

export const threadCount = createSelector(allThreadIdsSelector, (threads) => threads.length);

export const threadOrder = createSelector(allThreadIdsSelector, (threads) => (threadID: string) => threads.indexOf(threadID) + 1);
