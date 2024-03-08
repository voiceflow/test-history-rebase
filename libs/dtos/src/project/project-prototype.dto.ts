import { z } from 'zod';

import { PrototypeModelDTO } from '@/common';

export const ProjectPrototypeDTO = z
  .object({
    nlp: z.discriminatedUnion('type', [
      z.object({ type: z.literal('LUIS'), appID: z.string(), resourceID: z.string().optional() }).strict(),
      z.object({ type: z.literal('VFNLU') }).strict(),
    ]),
    data: z.unknown(),
    trainedModel: z.optional(PrototypeModelDTO),
    lastTrainedTime: z.number().optional(),
  })
  .strict();

export type ProjectPrototype = z.infer<typeof ProjectPrototypeDTO>;
