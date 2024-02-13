import { Utils } from '@voiceflow/common';
import type { Thread } from '@voiceflow/dtos';
import { createSelector } from 'reselect';

import * as Account from '@/ducks/account';
import * as CreatorV2 from '@/ducks/creatorV2';
import { diagramMapSelector } from '@/ducks/diagramV2/selectors/base';
import { domainSelector as activeDomainSelector } from '@/ducks/domain/selectors/active';
import * as UI from '@/ducks/ui';

import { getAllByThreadID as getAllCommentsByThreadID } from '../thread-comment/selectors/other.select';
import { all } from './crud.select';
import { root } from './root.select';

export const allForActiveDiagram = createSelector([all, CreatorV2.activeDiagramIDSelector], (threads, diagramID) =>
  threads.filter((thread) => thread.diagramID === diagramID)
);

export const idsForActiveDiagram = createSelector(allForActiveDiagram, (threads) => threads.map((thread) => thread.id));

export const countForActiveDiagram = createSelector(allForActiveDiagram, (threads) => threads.length);

export const getOrderForActiveDiagram = createSelector(idsForActiveDiagram, (threads) => (threadID: string) => threads.indexOf(threadID) + 1);

export const allAvailable = createSelector([all, diagramMapSelector], (threads, diagramMap) =>
  threads.filter((thread) => !!diagramMap[thread.diagramID]).reverse()
);

const threadFilter = createSelector(
  [
    UI.isTopicThreadsOnly,
    UI.isDomainThreadsOnly,
    UI.isMentionedThreadsOnly,
    Account.userIDSelector,
    activeDomainSelector,
    CreatorV2.activeDiagramIDSelector,
    getAllCommentsByThreadID,
  ],
  // eslint-disable-next-line max-params
  (isTopicThreadsOnly, isDomainThreadsOnly, isMentionedThreadsOnly, creatorID, activeDomain, diagramID, getComments) => (thread: Thread) =>
    (!isMentionedThreadsOnly || !creatorID || getComments({ threadID: thread.id }).some((comment) => comment.mentions.includes(creatorID))) &&
    (!isTopicThreadsOnly || thread.diagramID === diagramID) &&
    (!isDomainThreadsOnly || !activeDomain || activeDomain.topicIDs.includes(thread.diagramID))
);

export const allOpened = createSelector([allAvailable, threadFilter], (threads, filter) =>
  Utils.array.inferUnion(threads).filter((thread) => !thread.resolved && filter(thread))
);

export const allOpenedCount = createSelector(allOpened, (threads) => threads.length);

export const allResolved = createSelector([allAvailable, threadFilter], (threads, filter) =>
  Utils.array.inferUnion(threads).filter((thread) => thread.resolved && filter(thread))
);

export const allResolvedCount = createSelector(allResolved, (threads) => threads.length);

export const allOpenedForActiveDiagram = createSelector([allForActiveDiagram, CreatorV2.allNodeIDsSelector], (threads, nodeIDs) =>
  threads.filter((thread) => !thread.resolved && (!thread.nodeID || nodeIDs.includes(thread.nodeID)))
);

export const allOpenedIDsForActiveDiagram = createSelector(allOpenedForActiveDiagram, (threads) => threads.map(({ id }) => id));

export const getIDsByNodeID = createSelector(
  all,
  (threads) => (nodeID: string) => threads.filter((thread) => thread.nodeID === nodeID).map(({ id }) => id)
);

export const hasUnreadComments = createSelector([root], ({ hasUnreadComments, allKeys }) => hasUnreadComments && !!allKeys.length);
