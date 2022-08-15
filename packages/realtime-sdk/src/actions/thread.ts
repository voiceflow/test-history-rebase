import { THREAD_KEY } from '@realtime-sdk/constants';
import { Comment, NewThread, Thread } from '@realtime-sdk/models';
import { BaseProjectPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

import { createCRUDActions } from './utils';

const threadType = Utils.protocol.typeFactory(THREAD_KEY);

// Other

export const crud = createCRUDActions<Thread, BaseProjectPayload>(threadType);

export interface CreateThreadPayload extends BaseProjectPayload {
  thread: NewThread;
}
export const create = Utils.protocol.createAsyncAction<CreateThreadPayload, Thread>(threadType('CREATE'));

export interface AddCommentPayload extends BaseProjectPayload {
  threadID: string;
  comment: Comment;
}

export interface UpdateCommentPayload extends BaseProjectPayload {
  commendID: string;
  comment: Comment;
}

export interface DeleteCommentPayload extends BaseProjectPayload {
  commendID: string;
}

export const addComment = Utils.protocol.createAction<AddCommentPayload>(threadType('ADD_COMMENT'));
export const updateComment = Utils.protocol.createAction<UpdateCommentPayload>(threadType('UPDATE_COMMENT'));
export const deleteComment = Utils.protocol.createAction<DeleteCommentPayload>(threadType('DELETE_COMMENT'));
