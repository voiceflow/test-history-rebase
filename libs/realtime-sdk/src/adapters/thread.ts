import { createMultiAdapter } from 'bidirectional-adapter';

import type { Comment, DBComment, DBThread, Thread } from '../models';

export const commentAdapter = createMultiAdapter<DBComment, Comment>(
  ({ comment_id, thread_id, creator_id, created_at, ...comment }: DBComment) => ({
    ...comment,
    id: comment_id,
    threadID: thread_id,
    creatorID: creator_id,
    created: created_at,
  }),
  ({ id, threadID, creatorID, created, ...comment }: Comment) => ({
    ...comment,
    creator_id: creatorID,
    comment_id: id,
    thread_id: threadID,
    created_at: created,
  })
);

export const threadAdapter = createMultiAdapter<DBThread, Thread>(
  ({ thread_id, project_id, diagram_id, node_id, creator_id, comments, ...thread }: DBThread) => ({
    ...thread,
    id: thread_id,
    projectID: project_id,
    diagramID: diagram_id,
    nodeID: node_id,
    creatorID: creator_id,
    comments: commentAdapter.mapFromDB(comments),
  }),
  ({ id, projectID, diagramID, nodeID, creatorID, comments, ...thread }: Thread) => ({
    ...thread,
    thread_id: id,
    project_id: projectID,
    diagram_id: diagramID,
    node_id: nodeID,
    creator_id: creatorID,
    comments: commentAdapter.mapToDB(comments),
  })
);
