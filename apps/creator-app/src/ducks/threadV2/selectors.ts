import { createSelector } from 'reselect';

import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from './constants';

const crud = createCRUDSelectors(STATE_KEY);

/**
 * @deprecated use Designer.Thread.selectors.all instead
 */
export const allThreadsSelector = crud.all;

/**
 * @deprecated use Designer.Thread.selectors.oneByID instead
 */
export const getThreadByIDSelector = crud.getByID;

/**
 * @deprecated use Designer.Thread.selectors.hasUnreadComments instead
 */
export const hasUnreadCommentsSelector = createSelector([crud.root], ({ hasUnreadComments, allKeys }) => hasUnreadComments && !!allKeys.length);

/**
 * @deprecated use Designer.Thread.Comment.selectors.getAllByThreadID instead
 */
export const getThreadCommentsByThreadIDSelector = createSelector(
  crud.getByID,
  (getByID) =>
    ({ threadID }: { threadID: string | null }) =>
      getByID({ id: threadID })?.comments || []
);
