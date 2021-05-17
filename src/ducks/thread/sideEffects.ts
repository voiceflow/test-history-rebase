import client from '@/client';
import commentAdapter from '@/client/adapters/comment';
import threadAdapter from '@/client/adapters/thread';
import { toast } from '@/components/Toast';
import * as Errors from '@/config/errors';
import * as Account from '@/ducks/account';
import * as Session from '@/ducks/session';
import { Comment, DBComment, DBThread, NewThread, Thread } from '@/models';
import { SyncThunk, Thunk } from '@/store/types';
import { Pair } from '@/types';

import * as ThreadActions from './actions';
import * as ThreadSelectors from './selectors';

// side effects

export const loadThreads = (projectID: string): Thunk<Thread[]> => async (dispatch) => {
  const threads: Thread[] = await client.thread.find(projectID);

  dispatch(ThreadActions.replaceThreads(threads));

  return threads;
};

export const loadThread = (projectID: string, threadID: string): Thunk<Thread> => async (dispatch) => {
  const thread: Thread = await client.thread.get(projectID, threadID);

  dispatch(ThreadActions.updateThread(thread.id, thread));

  return thread;
};

// Thread CRUD

export const createThread = ({
  nodeID,
  position,
  data,
}: {
  data: Pick<Comment, 'text' | 'mentions'>;
  nodeID: string | null;
  position: Pair<number>;
}): Thunk<Thread> => async (dispatch, getState) => {
  const state = getState();
  const projectID = Session.activeProjectIDSelector(state);
  const diagramID = Session.activeDiagramIDSelector(state);
  const creatorID = Account.userIDSelector(state);

  Errors.assertCreatorID(creatorID);
  Errors.assertDiagramID(diagramID);
  Errors.assertProjectID(projectID);

  const newComment = { ...data, creatorID };

  const generatedThread: NewThread = {
    projectID,
    diagramID,
    nodeID,
    creatorID,
    position,
    resolved: false,
    comments: [newComment],
    deleted: false,
  };

  try {
    const thread = await client.thread.create(projectID, generatedThread);

    dispatch(ThreadActions.addThread(thread.id, thread));

    return thread;
  } catch (e) {
    toast.genericError();
    throw e;
  }
};

export const updateThreadData = (threadID: string, data: Partial<Pick<Thread, 'resolved' | 'position' | 'nodeID' | 'deleted'>>): Thunk => async (
  dispatch,
  getState
) => {
  const state = getState();
  const projectID = Session.activeProjectIDSelector(state);
  const thread = ThreadSelectors.threadByIDSelector(state)(threadID);

  Errors.assertProjectID(projectID);

  try {
    await client.thread.update(projectID, threadID, { ...thread, ...data });
    dispatch(ThreadActions.updateThread(threadID, data, true));
  } catch (e) {
    toast.genericError();
  }
};

export const resolveThread = (id: string): SyncThunk => (dispatch) => {
  dispatch(updateThreadData(id, { resolved: true }));
  toast.success('Thread has been resolved');
};

export const unresolveThread = (id: string): SyncThunk => (dispatch) => {
  dispatch(updateThreadData(id, { resolved: false }));
  toast.success('Thread has been unresolved');
};

export const deleteThread = (threadID: string): Thunk => async (dispatch) => {
  dispatch(updateThreadData(threadID, { deleted: true }));
};

// Comment CRUD

export const createComment = (threadID: string, data: Partial<Pick<Comment, 'text' | 'mentions'>>): Thunk => async (dispatch, getState) => {
  const state = getState();
  const projectID = Session.activeProjectIDSelector(state);
  const creatorID = Account.userIDSelector(state);
  const thread = ThreadSelectors.threadByIDSelector(state)(threadID);

  Errors.assertCreatorID(creatorID);
  Errors.assertProjectID(projectID);

  try {
    const comment = await client.comment.create(projectID, threadID, { ...data, creatorID } as Comment);

    dispatch(ThreadActions.updateThread(threadID, { comments: [...thread.comments, comment] }, true));
  } catch (e) {
    toast.genericError();
  }
};

export const updateComment = (threadID: string, commentID: string, data: Pick<Comment, 'text' | 'mentions'>): Thunk => async (dispatch, getState) => {
  const state = getState();
  const projectID = Session.activeProjectIDSelector(state);
  const thread = ThreadSelectors.threadByIDSelector(state)(threadID);

  Errors.assertProjectID(projectID);

  try {
    await client.comment.update(projectID, commentID, { text: data.text, mentions: data.mentions } as Comment);
    dispatch(
      ThreadActions.updateThread(
        threadID,
        { comments: thread.comments.map((comment) => (comment.id === commentID ? { ...comment, ...data } : comment)) },
        true
      )
    );
  } catch (e) {
    toast.genericError();
  }
};

export const deleteComment = (threadID: string, commentID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const projectID = Session.activeProjectIDSelector(state);
  const thread = ThreadSelectors.threadByIDSelector(state)(threadID);

  Errors.assertProjectID(projectID);

  if (thread.comments.length === 1) {
    dispatch(deleteThread(threadID));
  } else {
    try {
      await client.comment.delete(projectID, commentID);
      dispatch(ThreadActions.updateThread(threadID, { comments: thread.comments.filter((comment) => comment.id !== commentID) }, true));
    } catch (e) {
      toast.genericError();
    }
  }
};

// socket event handlers

export const handleNewThread = (payload: { projectID: string; created: DBThread }): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const thread = threadAdapter.fromDB(payload.created);

  const creatorID = Account.userIDSelector(state);

  Errors.assertCreatorID(creatorID);
  if (creatorID === thread.creatorID) return;

  dispatch(ThreadActions.addThread(thread.id, thread));
  dispatch(ThreadActions.updateUnreadComments(true));
};

export const handleThreadUpdate = (payload: { projectID: string; updatedThread: DBThread }): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const { comments, ...thread } = threadAdapter.fromDB({ ...payload.updatedThread, comments: [] });

  const creatorID = Account.userIDSelector(state);

  Errors.assertCreatorID(creatorID);
  if (creatorID === thread.creatorID) return;

  dispatch(ThreadActions.updateThread(thread.id, thread, true));
};

export const handleNewReply = (payload: { projectID: string; created: DBComment }): SyncThunk => (dispatch, getState) => {
  const state = getState();

  const creatorID = Account.userIDSelector(state);

  Errors.assertCreatorID(creatorID);
  if (creatorID === payload.created.creator_id) return;

  const comment = commentAdapter.fromDB(payload.created);
  const thread = ThreadSelectors.threadByIDSelector(state)(comment.threadID);

  dispatch(ThreadActions.updateThread(thread.id, { comments: [...thread.comments, comment] }, true));
  dispatch(ThreadActions.updateUnreadComments(true));
};

export const handleCommentUpdate = (payload: { projectID: string; updatedComment: DBComment }): SyncThunk => (dispatch, getState) => {
  const state = getState();

  const creatorID = Account.userIDSelector(state);

  Errors.assertCreatorID(creatorID);
  if (creatorID === payload.updatedComment.creator_id) return;

  const comment = commentAdapter.fromDB(payload.updatedComment);
  const thread = ThreadSelectors.threadByIDSelector(state)(comment.threadID);

  dispatch(
    ThreadActions.updateThread(
      thread.id,
      { comments: thread.comments.map((item: Comment) => (item.id === comment.id ? { ...item, ...comment } : item)) },
      true
    )
  );
};

export const handleCommentDelete = (payload: { projectID: string; commentID: string; threadID: string }): SyncThunk => (dispatch, getState) => {
  const state = getState();

  const creatorID = Account.userIDSelector(state);
  const thread = ThreadSelectors.threadByIDSelector(state)(payload.threadID);

  Errors.assertCreatorID(creatorID);
  if (creatorID === thread.creatorID) return;

  dispatch(
    ThreadActions.updateThread(payload.threadID, { comments: thread.comments.filter((item: Comment) => item.id !== payload.commentID) }, true)
  );
};
