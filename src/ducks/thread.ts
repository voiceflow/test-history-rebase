import { createSelector } from 'reselect';

import client from '@/client';
import commentAdapter from '@/client/adapters/comment';
import threadAdapter from '@/client/adapters/thread';
import { toast } from '@/components/Toast';
import * as Account from '@/ducks/account';
import * as Skill from '@/ducks/skill';
import createCRUDReducer, { createCRUDActionCreators, createCRUDSelectors } from '@/ducks/utils/crud';
import { Comment, DBComment, DBThread, NewThread, Thread } from '@/models';
import { SyncThunk, Thunk } from '@/store/types';
import { Pair } from '@/types';

// state

export const STATE_KEY = 'thread';

// reducers

const threadReducer = createCRUDReducer<Thread>(STATE_KEY);

export default threadReducer;

// selectors

export const {
  root: rootThreadsSelector,
  all: allThreadsSelector,
  byID: threadByIDSelector,
  findByIDs: threadsByIDsSelector,
  has: hasThreadsSelector,
} = createCRUDSelectors<Thread>(STATE_KEY);

export const openThreads = createSelector([allThreadsSelector], (threads) => threads.filter((thread) => !thread.resolved));

export const resolvedThreads = createSelector([allThreadsSelector], (threads) => threads.filter((thread) => thread.resolved));

export const hasThreads = createSelector([allThreadsSelector], (threads) => !!threads.length);

export const activeDiagramRootThreadIDsSelector = createSelector([allThreadsSelector, Skill.activeDiagramIDSelector], (threads, diagramID) =>
  threads.filter((thread) => thread.diagramID === diagramID && !thread.resolved && !thread.nodeID).map(({ id }) => id)
);

// action creators

export const { add: addThread, update: updateThread, remove: removeThread, replace: replaceThreads } = createCRUDActionCreators<Thread>(STATE_KEY);

// side effects

export const loadThreads = (projectID: string): Thunk<Thread[]> => async (dispatch) => {
  const threads: Thread[] = await client.thread.find(projectID);

  dispatch(replaceThreads(threads));

  return threads;
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
  const projectID = Skill.activeProjectIDSelector(state);
  const diagramID = Skill.activeDiagramIDSelector(state);
  const creatorID = Account.userIDSelector(state)!;

  const newComment = { ...data, creatorID };

  const generatedThread: NewThread = {
    projectID,
    diagramID,
    nodeID,
    creatorID,
    position,
    resolved: false,
    comments: [newComment],
  };

  try {
    const thread = await client.thread.create(projectID, generatedThread);

    dispatch(addThread(thread.id!, thread));

    return thread;
  } catch (e) {
    toast.error('Something went wrong. Please try again');
    throw e;
  }
};

export const updateThreadData = (threadID: string, data: Partial<Pick<Thread, 'resolved' | 'position' | 'nodeID'>>): Thunk => async (
  dispatch,
  getState
) => {
  const state = getState();
  const projectID = Skill.activeProjectIDSelector(state);
  const thread = threadByIDSelector(state)(threadID);

  try {
    await client.thread.update(projectID, threadID, { ...thread, ...data });
    dispatch(updateThread(threadID, data, true));
  } catch (e) {
    toast.error('Something went wrong. Please try again');
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

export const deleteThread = (threadID: string): Thunk => async (dispatch, getState) => {
  const projectID = Skill.activeProjectIDSelector(getState());

  try {
    await client.thread.delete(projectID, threadID);
    dispatch(removeThread(threadID));
  } catch (e) {
    toast.error('Something went wrong. Please try again');
  }
};

// Comment CRUD

export const createComment = (threadID: string, data: Partial<Pick<Comment, 'text' | 'mentions'>>): Thunk => async (dispatch, getState) => {
  const state = getState();
  const projectID = Skill.activeProjectIDSelector(state);
  const creatorID = Account.userIDSelector(state)!;
  const thread = threadByIDSelector(state)(threadID);

  try {
    const comment = await client.comment.create(projectID, threadID, { ...data, creatorID } as Comment);

    dispatch(updateThread(threadID, { comments: [...thread.comments, comment] }, true));
  } catch (e) {
    toast.error('Something went wrong. Please try again');
  }
};

export const updateComment = (threadID: string, commentID: string, data: Partial<Pick<Comment, 'text' | 'mentions'>>): Thunk => async (
  dispatch,
  getState
) => {
  const state = getState();
  const projectID = Skill.activeProjectIDSelector(state);
  const thread = threadByIDSelector(state)(threadID);

  try {
    await client.comment.update(projectID, commentID, data as Comment);
    dispatch(
      updateThread(threadID, { comments: thread.comments.map((comment) => (comment.id === commentID ? { ...comment, ...data } : comment)) }, true)
    );
  } catch (e) {
    toast.error('Something went wrong. Please try again');
  }
};

export const deleteComment = (threadID: string, commentID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const projectID = Skill.activeProjectIDSelector(state);
  const thread = threadByIDSelector(state)(threadID);

  if (thread.comments.length === 1) {
    dispatch(deleteThread(threadID));
  } else {
    try {
      await client.comment.delete(projectID, commentID);
      dispatch(updateThread(threadID, { comments: thread.comments.filter((comment) => comment.id !== commentID) }, true));
    } catch (e) {
      toast.error('Something went wrong. Please try again');
    }
  }
};

// socket event handlers

export const handleNewThread = (payload: { projectID: string; created: DBThread }): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const thread = threadAdapter.fromDB(payload.created);

  const creatorID = Account.userIDSelector(state)!;

  if (creatorID === thread.creatorID) return;

  dispatch(addThread(thread.id, thread));
};

export const handleThreadUpdate = (payload: { projectID: string; updatedThread: DBThread }): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const { comments, ...thread } = threadAdapter.fromDB({ ...payload.updatedThread, comments: [] });

  const creatorID = Account.userIDSelector(state)!;

  if (creatorID === thread.creatorID) return;

  dispatch(updateThread(thread.id, thread, true));
};

export const handleThreadDelete = (payload: { projectID: string; threadID: string }): SyncThunk => (dispatch, getState) => {
  const state = getState();

  const creatorID = Account.userIDSelector(state)!;
  const thread = threadByIDSelector(state)(payload.threadID);

  if (creatorID === thread.creatorID) return;

  dispatch(deleteThread(payload.threadID));
};

export const handleNewReply = (payload: { projectID: string; created: DBComment }): SyncThunk => (dispatch, getState) => {
  const state = getState();

  const creatorID = Account.userIDSelector(state)!;

  if (creatorID === payload.created.creator_id) return;

  const comment = commentAdapter.fromDB(payload.created);
  const thread = threadByIDSelector(state)(comment.threadID);

  dispatch(updateThread(thread.id, { comments: [...thread.comments, comment] }, true));
};

export const handleCommentUpdate = (payload: { projectID: string; updatedComment: DBComment }): SyncThunk => (dispatch, getState) => {
  const state = getState();

  const creatorID = Account.userIDSelector(state)!;
  if (creatorID === payload.updatedComment.creator_id) return;

  const comment = commentAdapter.fromDB(payload.updatedComment);
  const thread = threadByIDSelector(state)(comment.threadID);

  dispatch(
    updateThread(thread.id, { comments: thread.comments.map((item: Comment) => (item.id === comment.id ? { ...item, ...comment } : item)) }, true)
  );
};

export const handleCommentDelete = (payload: { projectID: string; commentID: string; threadID: string }): SyncThunk => (dispatch, getState) => {
  const state = getState();

  const creatorID = Account.userIDSelector(state)!;
  const thread = threadByIDSelector(state)(payload.threadID);

  if (creatorID === thread.creatorID) return;

  dispatch(updateThread(payload.threadID, { comments: thread.comments.filter((item: Comment) => item.id !== payload.commentID) }, true));
};
