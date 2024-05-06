import { KBTagDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const TagFindManyResponse = z.object({
  total: z.number(),
  data: z.array(KBTagDTO),
});

export type TagFindManyResponse = z.infer<typeof TagFindManyResponse>;

export const TagFindOneResponse = z.object({
  data: KBTagDTO.nullable().optional(),
});

export type TagFindOneResponse = z.infer<typeof TagFindOneResponse>;
