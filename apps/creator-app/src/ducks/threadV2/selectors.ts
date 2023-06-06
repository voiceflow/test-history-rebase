import { Thread } from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import * as Account from '@/ducks/account';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as UI from '@/ducks/ui';
import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from './constants';

export const {
  all: allThreadsSelector,
  map: threadsMapSelector,
  root: rootThreadsSelector,
  byID: threadsByIDSelector,
  byIDs: threadsByIDsSelector,
  allIDs: allThreadIDsSelector,
  getByID: getThreadByIDSelector,
} = createCRUDSelectors(STATE_KEY);

// selectors
export const allThreadIdsSelector = createSelector([allThreadsSelector, CreatorV2.activeDiagramIDSelector], (threads, diagramID) =>
  threads.filter((thread) => thread.diagramID === diagramID).map((thread) => thread.id)
);

export const allAvailableThreads = createSelector([allThreadsSelector, DiagramV2.diagramMapSelector], (threads, diagramMap) =>
  threads.filter((thread) => !thread.deleted && !!diagramMap[thread.diagramID]).reverse()
);

export const threadFilter = createSelector(
  [UI.isMentionedThreadsOnly, Account.userIDSelector],

  (isMentionedThreadsOnly, creatorID) => (thread: Thread) =>
    !isMentionedThreadsOnly || thread.comments.some((comment) => comment.mentions.includes(creatorID!))
);
export const openedThreads = createSelector([allAvailableThreads, threadFilter], (threads, filter) =>
  threads.filter((thread) => !thread.resolved && filter(thread))
);
export const resolvedThreads = createSelector([allAvailableThreads, threadFilter], (threads, filter) =>
  threads.filter((thread) => thread.resolved && filter(thread))
);

export const activeDiagramThreadsSelector = createSelector(
  [allAvailableThreads, CreatorV2.activeDiagramIDSelector, CreatorV2.allNodeIDsSelector],
  (threads, diagramID, nodeIDs) =>
    threads.filter((thread) => thread.diagramID === diagramID && !thread.resolved && (!thread.nodeID || nodeIDs.includes(thread.nodeID)))
);

export const activeDiagramThreadIDsSelector = createSelector([activeDiagramThreadsSelector], (threads) => threads.map(({ id }) => id));

export const threadIDsByNodeIDSelector = createSelector(
  [allThreadsSelector],
  (threads) => (nodeID: string) => threads.filter((thread) => thread.nodeID === nodeID).map(({ id }) => id)
);

export const hasUnreadCommentsSelector = createSelector(
  [rootThreadsSelector],
  ({ hasUnreadComments, allKeys }) => hasUnreadComments && !!allKeys.length
);

export const threadCount = createSelector(allThreadIdsSelector, (threads) => threads.length);

export const threadOrder = createSelector(allThreadIdsSelector, (threads) => (threadID: string) => threads.indexOf(threadID) + 1);
