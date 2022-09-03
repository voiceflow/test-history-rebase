import { Thread } from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import * as Account from '@/ducks/account';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Domain from '@/ducks/domain';
import * as Feature from '@/ducks/feature';
import * as ThreadV1 from '@/ducks/thread';
import * as UI from '@/ducks/ui';
import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from './constants';

export const {
  root: _rootThreadsSelector,
  all: _allThreadsSelector,
  map: threadsMapSelector,
  byID: threadsByIDSelector,
  byIDs: threadsByIDsSelector,
  allIDs: allThreadIDsSelector,
  getByID: _getThreadByIDSelector,
} = createCRUDSelectors(STATE_KEY);

export const rootThreadsSelector = Feature.createAtomicActionsCommentingSelector([ThreadV1.rootThreadsSelector, _rootThreadsSelector]);
export const allThreadsSelector = Feature.createAtomicActionsCommentingSelector([ThreadV1.allThreadsSelector, _allThreadsSelector]);

// selectors
const legacyGetThreadByIDSelector = createSelector(
  ThreadV1.threadByIDSelector,
  (threadByIDSelector) =>
    ({ id }: { id: string }): Thread | null =>
      threadByIDSelector(id)
);
export const getThreadByIDSelector = Feature.createAtomicActionsCommentingSelector([legacyGetThreadByIDSelector, _getThreadByIDSelector]);
export const allThreadIdsSelector = createSelector([allThreadsSelector, CreatorV2.activeDiagramIDSelector], (threads, diagramID) =>
  threads.filter((thread) => thread.diagramID === diagramID).map((thread) => thread.id)
);

export const allAvailableThreads = createSelector(allThreadsSelector, (threads) => threads.filter((thread) => !thread.deleted).reverse());

export const threadFilter = createSelector(
  [
    UI.isMentionedThreadsOnly,
    UI.isTopicThreadsOnly,
    UI.isDomainThreadsOnly,
    Account.userIDSelector,
    CreatorV2.activeDiagramIDSelector,
    Domain.active.domainSelector,
  ],
  // eslint-disable-next-line max-params
  (isMentionedThreadsOnly, isTopicThreadsOnly, isDomainThreadsOnly, creatorID, diagramID, activeDomain) => (thread: Thread) =>
    (!isMentionedThreadsOnly || thread.comments.some((comment) => comment.mentions.includes(creatorID!))) &&
    (!isTopicThreadsOnly || thread.diagramID === diagramID) &&
    (!isDomainThreadsOnly || !activeDomain || activeDomain.topicIDs.includes(thread.diagramID))
);
export const openedThreads = createSelector([allAvailableThreads, threadFilter], (threads, filter) =>
  threads.filter((thread) => !thread.resolved && filter(thread))
);
export const resolvedThreads = createSelector([allAvailableThreads, threadFilter], (threads, filter) =>
  threads.filter((thread) => thread.resolved && filter(thread))
);

export const hasThreads = createSelector([allThreadsSelector], (threads) => !!threads.filter((thread) => !thread.deleted).length);

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
