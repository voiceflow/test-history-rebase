import { z } from 'zod';

export const AssistantViewerDTO = z
  .object({
    creatorID: z.string(),
    name: z.string(),
    image: z.string().optional(),
  })
  .strict();
