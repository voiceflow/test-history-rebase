import { z } from 'zod';

export const AssistantViewerDTO = z
  .object({
    name: z.string(),
    image: z.string().optional(),
    creatorID: z.string(),
  })
  .strict();
