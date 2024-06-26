import { z } from 'zod';

export const AssistantFindEnvironmentsResponse = z.array(
  z.object({
    tag: z.string(),
    environment: z.object({
      _id: z.string(),
      name: z.string(),
      creatorID: z.number(),
      updatedAt: z.string().datetime(),
    }),
  })
);

export type AssistantFindEnvironmentsResponse = z.infer<typeof AssistantFindEnvironmentsResponse>;
