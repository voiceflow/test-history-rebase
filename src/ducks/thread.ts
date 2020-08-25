import { createSelector } from 'reselect';

import client from '@/client';
import commentAdapter from '@/client/adapters/comment';
import threadAdapter from '@/client/adapters/thread';
import { toast } from '@/components/Toast';
import * as Account from '@/ducks/account';
import * as Creator from '@/ducks/creator';
import * as Skill from '@/ducks/skill';
import { createAction, createRootSelector } from '@/ducks/utils';
import createCRUDReducer, * as CRUD from '@/ducks/utils/crud';
import { Comment, DBComment, DBThread, NewThread, Thread } from '@/models';
import { Action, Reducer, RootReducer, SyncThunk, Thunk } from '@/store/types';
import { Pair } from '@/types';

// state

export type CommentingState = CRUD.CRUDState<Thread> & {
  hasUnreadComments: boolean;
};

export const STATE_KEY = 'thread';

export const INITIAL_STATE: CommentingState = {
  ...CRUD.INITIAL_STATE,
  hasUnreadComments: false,
};

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
  update: updateThread,
  remove: removeThread,
  removeMany: removeManyThreads,
  replace: replaceThreads,
} = CRUD.createCRUDActionCreators<Thread>(STATE_KEY);

// reducers

const threadCRUDReducer = createCRUDReducer<Thread>(STATE_KEY);

const updateUnreadCommentReducer: Reducer<CommentingState, UpdateUnreadComments> = (state, { payload: hasUnreadComments }) => ({
  ...state,
  hasUnreadComments,
});

const threadReducer: RootReducer<CommentingState, AnyCommentingAction> = (state = INITIAL_STATE, action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case CommentingAction.UPDATE_UNREAD_COMMENTS:
      return updateUnreadCommentReducer(state, action);
    default:
      return {
        ...state,
        ...threadCRUDReducer(state, action),
      };
  }
};

export default threadReducer;

// selectors

const rootSelector = createRootSelector(STATE_KEY);

export const {
  root: rootThreadsSelector,
  all: allThreadsSelector,
  byID: threadByIDSelector,
  findByIDs: threadsByIDsSelector,
  has: hasThreadsSelector,
} = CRUD.createCRUDSelectors<Thread>(STATE_KEY);

export const openThreads = createSelector([allThreadsSelector], (threads) => threads.filter((thread) => !thread.resolved));

export const resolvedThreads = createSelector([allThreadsSelector], (threads) => threads.filter((thread) => thread.resolved));

export const hasThreads = createSelector([allThreadsSelector], (threads) => !!threads.length);

export const activeDiagramThreadsSelector = createSelector(
  [allThreadsSelector, Skill.activeDiagramIDSelector, Creator.allNodeIDsSelector],
  (threads, diagramID, nodeIDs) =>
    threads.filter((thread) => thread.diagramID === diagramID && !thread.resolved && (!thread.nodeID || nodeIDs.includes(thread.nodeID)))
);

export const activeDiagramThreadIDsSelector = createSelector([activeDiagramThreadsSelector], (threads) => threads.map(({ id }) => id));

export const threadIDsByNodeIDSelector = createSelector([allThreadsSelector], (threads) => (nodeID: string) =>
  threads.filter((thread) => thread.nodeID === nodeID).map(({ id }) => id)
);

export const hasUnreadCommentsSelector = createSelector([rootSelector], ({ hasUnreadComments, allKeys }) => hasUnreadComments && !!allKeys.length);

// side effects

export const loadThreads = (projectID: string): Thunk<Thread[]> => async (dispatch) => {
  const threads: Thread[] = await client.thread.find(projectID);

  dispatch(replaceThreads(threads));

  return threads;
};

export const loadThread = (projectID: string, threadID: string): Thunk<Thread> => async (dispatch) => {
  const thread: Thread = await client.thread.fetchThread(projectID, threadID);

  dispatch(updateThread(thread.id, thread));

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

    dispatch(prependThread(thread.id!, thread));

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

export const deleteThreadsByNodeIDs = (nodeIDs: string[]): Thunk => async (dispatch, getState) => {
  const state = getState();
  const diagramID = Skill.activeDiagramIDSelector(state);
  const projectID = Skill.activeProjectIDSelector(state);
  const threadIDs = nodeIDs.flatMap(threadIDsByNodeIDSelector(state));

  try {
    await client.thread.deleteThreadsByNodeIDs(projectID, diagramID, nodeIDs);
    dispatch(removeManyThreads(threadIDs));
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
    await client.comment.update(projectID, commentID, { text: data.text, mentions: data.mentions } as Comment);
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

  dispatch(prependThread(thread.id, thread));
  dispatch(updateUnreadComments(true));
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
  dispatch(updateUnreadComments(true));
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
