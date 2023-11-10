import { z } from 'zod';

export const VersionNoteDTO = z
  .object({
    id: z.string(),
    type: z.string(),
    text: z.string(),
    meta: z.record(z.unknown()).optional(),
    mentions: z.array(z.number()),
  })
  .strict();

export type VersionNote = z.infer<typeof VersionNoteDTO>;
