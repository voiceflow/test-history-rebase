import { Thread } from '@voiceflow/realtime-sdk';

import { createAction } from '@/ducks/utils';
import * as CRUD from '@/ducks/utils/crud';
import { Action } from '@/store/types';

import { STATE_KEY } from './constants';

// actions

export enum CommentingAction {
  UPDATE_UNREAD_COMMENTS = 'UPDATE_UNREAD_COMMENTS',
}

// action types

export type UpdateUnreadComments = Action<CommentingAction.UPDATE_UNREAD_COMMENTS, boolean>;

export type AnyCommentingAction = UpdateUnreadComments | CRUD.AnyCRUDAction<Thread>;

// action creators

export const updateUnreadComments = (hasUnreadComments: boolean): UpdateUnreadComments =>
  createAction(CommentingAction.UPDATE_UNREAD_COMMENTS, hasUnreadComments);

export const {
  prepend: prependThread,
  add: addThread,
  update: updateThread,
  remove: removeThread,
  removeMany: removeManyThreads,
  replace: replaceThreads,
} = CRUD.createCRUDActionCreators(STATE_KEY);
