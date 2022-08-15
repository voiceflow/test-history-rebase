import compositeReducer from 'composite-reducer';

import { CommentingAction, UpdateUnreadComments } from '@/ducks/thread/actions';
import { createRootCRUDReducer } from '@/ducks/utils/crudV2';
import { RootReducer } from '@/store/types';

import { INITIAL_STATE } from '../constants';
import crudReducers from './crud';

const updateUnreadCommentReducer: RootReducer<boolean, UpdateUnreadComments> = (state = false, action) => {
  if (action.type === CommentingAction.UPDATE_UNREAD_COMMENTS) {
    return action.payload;
  }

  return state;
};

const threadReducer = compositeReducer(createRootCRUDReducer(INITIAL_STATE, crudReducers).build(), { hasUnreadComments: updateUnreadCommentReducer });

export default threadReducer;
