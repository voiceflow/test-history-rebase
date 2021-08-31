import { Adapters } from '@voiceflow/realtime-sdk';

import { Comment, DBComment } from '@/models';

const commentAdapter = Adapters.createAdapter<DBComment, Comment>(
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

export default commentAdapter;
