import { z } from 'zod';

export const ProjectStickerDTO = z
  .object({
    id: z.string(),
    url: z.string(),
  })
  .strict();

export type ProjectSticker = z.infer<typeof ProjectStickerDTO>;
