import createCRUDReducer from '@/ducks/utils/crud';
import { Thread } from '@/models';
import { RootReducer } from '@/store/types';

import { compositeReducer } from '../utils';
import { CommentingAction, UpdateUnreadComments } from './actions';
import { STATE_KEY } from './constants';

export * from './actions';
export * from './constants';
export * from './selectors';
export * from './sideEffects';
export * from './types';

// reducers

const threadCRUDReducer = createCRUDReducer<Thread>(STATE_KEY);

const updateUnreadCommentReducer: RootReducer<boolean, UpdateUnreadComments> = (state = false, action) => {
  if (action.type === CommentingAction.UPDATE_UNREAD_COMMENTS) {
    return action.payload;
  }

  return state;
};

const threadReducer = compositeReducer(threadCRUDReducer, { hasUnreadComments: updateUnreadCommentReducer });

export default threadReducer;
