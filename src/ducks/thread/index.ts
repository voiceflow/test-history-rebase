import createCRUDReducer from '@/ducks/utils/crud';
import { Thread } from '@/models';

import { compositeReducer } from '../utils';
import { CommentingAction, UpdateUnreadComments } from './actions';
import { STATE_KEY } from './constants';

export * from './constants';
export * from './selectors';
export * from './actions';
export * from './sideEffects';
export * from './types';

// reducers

const threadCRUDReducer = createCRUDReducer<Thread>(STATE_KEY);

const updateUnreadCommentReducer = (state = false, action: UpdateUnreadComments) => {
  if (action.type === CommentingAction.UPDATE_UNREAD_COMMENTS) {
    return action.payload;
  }

  return state;
};

const threadReducer = compositeReducer(threadCRUDReducer, { hasUnreadComments: updateUnreadCommentReducer });

export default threadReducer;
