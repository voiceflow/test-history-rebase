/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from './utils';

export const addCommentReducer = createReducer(Realtime.thread.comment.add, (state, { threadID, comment }) => {
  state.byKey[threadID]?.comments.push(comment);
});

export const updateCommentReducer = createReducer(Realtime.thread.comment.update, (state, { threadID, commentID, comment }) => {
  const thread = state.byKey[threadID];
  if (!thread) return;

  const commentIndex = thread.comments.findIndex((comment) => comment.id === commentID);
  if (commentIndex === -1) return;

  thread.comments[commentIndex] = { ...thread.comments[commentIndex], ...comment };
});

export const deleteCommentReducer = createReducer(Realtime.thread.comment.delete, (state, { threadID, commentID }) => {
  const thread = state.byKey[threadID];
  if (!thread) return;

  thread.comments = thread.comments.filter((comment) => comment.id === commentID);
});

export const updateUnreadCommentsReducer = createReducer(Realtime.thread.comment.updateUnreadComments, (state, hasUnreadComments) => {
  state.hasUnreadComments = hasUnreadComments;
});
