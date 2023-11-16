import { z } from 'zod';

export const ThreadCommentDTO = z
  .object({
    id: z.string(),
    text: z.string(),
    created: z.string(),
    mentions: z.array(z.number()),
    threadID: z.string(),
    authorID: z.number(),
  })
  .strict();

export type ThreadComment = z.infer<typeof ThreadCommentDTO>;
