import { z } from 'zod';

export const GetNLUTrainingDiffResponse = z
  .object({
    status: z.union([z.literal('trained'), z.literal('untrained')]),
    data: z
      .object({
        trainedCount: z.number(),
        untrainedCount: z.number(),
        lastTrainedTime: z.number().nullable(),
        trainedSlotsCount: z.number(),
        trainedIntentsCount: z.number(),
        untrainedSlotsCount: z.number(),
        untrainedIntentsCount: z.number(),
      })
      .nullable(),
  })
  .strict();

export type GetNLUTrainingDiffResponse = z.infer<typeof GetNLUTrainingDiffResponse>;
