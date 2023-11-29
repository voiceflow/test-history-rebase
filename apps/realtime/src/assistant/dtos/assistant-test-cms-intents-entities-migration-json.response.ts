import { z } from 'zod';

export const AssistantTestCMSIntentsEntitiesMigrationResponse = z
  .object({
    success: z.boolean(),
    diff: z.object({
      slots: z.any(),
      intents: z.any(),
    }),
  })
  .strict();

export type AssistantTestCMSIntentsEntitiesMigrationResponse = z.infer<typeof AssistantTestCMSIntentsEntitiesMigrationResponse>;
