import { THREAD_KEY } from '@realtime-sdk/constants';
import { Comment, NewComment, NewThread, Thread } from '@realtime-sdk/models';
import { BaseProjectPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

import { createCRUDActions } from './utils';

const threadType = Utils.protocol.typeFactory(THREAD_KEY);

// Other

export const crud = createCRUDActions<Thread, BaseProjectPayload>(threadType);

// async actions
export interface CreateThreadPayload extends BaseProjectPayload {
  thread: NewThread;
}

export interface RemoveManyByDiagramIDsPayload extends BaseProjectPayload {
  diagramIDs: string[];
}

export const create = Utils.protocol.createAsyncAction<CreateThreadPayload, Thread>(threadType('CREATE'));

export const removeManyByDiagramIDs = Utils.protocol.createAction<RemoveManyByDiagramIDsPayload>(threadType('REMOVE_BY_DIAGRAM_IDS'));

export interface CreateCommentPayload extends BaseProjectPayload {
  threadID: string;
  comment: NewComment;
}

// comment crud actions
export interface AddCommentPayload extends BaseProjectPayload {
  threadID: string;
  comment: Comment;
}

export interface UpdateCommentPayload extends BaseProjectPayload {
  threadID: string;
  commentID: string;
  comment: NewComment;
}

export interface DeleteCommentPayload extends BaseProjectPayload {
  threadID: string;
  commentID: string;
}

export const comment = {
  add: Utils.protocol.createAction<AddCommentPayload>(threadType('ADD_COMMENT')),
  create: Utils.protocol.createAsyncAction<CreateCommentPayload, Comment>(threadType('CREATE_COMMENT')),
  update: Utils.protocol.createAction<UpdateCommentPayload>(threadType('UPDATE_COMMENT')),
  delete: Utils.protocol.createAction<DeleteCommentPayload>(threadType('DELETE_COMMENT')),
  updateUnreadComments: Utils.protocol.createAction<boolean>(threadType('HAS_UNREAD_COMMENTS')),
};
