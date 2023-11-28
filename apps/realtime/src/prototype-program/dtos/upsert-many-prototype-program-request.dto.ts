import { PrototypeProgramDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const UpsertManyPrototypeProgramRequest = z.array(
  PrototypeProgramDTO.extend({
    _id: z.string().optional(),
  })
);

export type UpsertManyPrototypeProgramRequest = z.infer<typeof UpsertManyPrototypeProgramRequest>;
