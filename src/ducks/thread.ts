import { createSelector } from 'reselect';

import client from '@/client';
import * as Account from '@/ducks/account';
import * as Skill from '@/ducks/skill';
import createCRUDReducer, { createCRUDActionCreators, createCRUDSelectors } from '@/ducks/utils/crud';
import { Comment, Thread } from '@/models';
import { Thunk } from '@/store/types';
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

export const filterByOpenThreads = createSelector([allThreadsSelector], (threads) => threads.map((thread) => !thread.resolved));

export const filterByResolvedThreads = createSelector([allThreadsSelector], (threads) => threads.map((thread) => thread.resolved));

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
  data: Partial<Pick<Comment, 'text' | 'mentions'>>;
  nodeID: string;
  position: Pair<number>;
}): Thunk => async (dispatch, getState) => {
  const state = getState();
  const projectID = Skill.activeProjectIDSelector(state);
  const diagramID = Skill.activeDiagramIDSelector(state);
  const creatorID = Account.userIDSelector(state)!;

  const newComment = { ...data, creatorID };

  const generatedThread = {
    projectID,
    diagramID,
    nodeID,
    creatorID,
    position,
    resolved: false,
    comments: [newComment],
  };

  const thread: Thread = await client.thread.create(projectID, generatedThread as Thread);

  dispatch(addThread(thread.id!, thread));
};

export const updateThreadData = (threadID: string, data: Partial<Pick<Thread, 'resolved' | 'position' | 'nodeID'>>): Thunk => async (
  dispatch,
  getState
) => {
  const projectID = Skill.activeProjectIDSelector(getState());

  client.thread.update(projectID, threadID, data as Thread);
  dispatch(updateThread(threadID, data));
};

export const deleteThread = (threadID: string): Thunk => async (dispatch, getState) => {
  const projectID = Skill.activeProjectIDSelector(getState());

  await client.thread.delete(projectID, threadID);
  dispatch(removeThread(threadID));
};

// Comment CRUD

export const createComment = (threadID: string, data: Partial<Pick<Comment, 'text' | 'mentions'>>): Thunk => async (dispatch, getState) => {
  const state = getState();
  const projectID = Skill.activeProjectIDSelector(state);
  const creatorID = Account.userIDSelector(state)!;
  const thread = threadByIDSelector(state)(threadID);

  const comment = await client.comment.create(projectID, threadID, { ...data, creatorID } as Comment);

  dispatch(updateThread(threadID, { comments: [...thread.comments, comment] }));
};

export const updateComment = (threadID: string, commentID: string, data: Partial<Pick<Comment, 'text' | 'mentions'>>): Thunk => async (
  dispatch,
  getState
) => {
  const state = getState();
  const projectID = Skill.activeProjectIDSelector(state);
  const thread = threadByIDSelector(state)(threadID);

  await client.comment.update(projectID, commentID, data as Comment);
  dispatch(updateThread(threadID, { comments: thread.comments.map((comment) => (comment.id === commentID ? { ...comment, ...data } : comment)) }));
};

export const deleteComment = (threadID: string, commentID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const projectID = Skill.activeProjectIDSelector(state);
  const thread = threadByIDSelector(state)(threadID);

  await client.comment.delete(projectID, commentID);
  dispatch(updateThread(threadID, { comments: thread.comments.filter((comment) => comment.id !== commentID) }));
};
