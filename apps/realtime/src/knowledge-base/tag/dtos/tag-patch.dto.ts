import { KBTagDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const TagPatchOneResponse = z.object({
  data: KBTagDTO.nullable().optional(),
});

export type TagPatchOneResponse = z.infer<typeof TagPatchOneResponse>;

export const TagPatchOneRequest = z.object({
  data: KBTagDTO.partial(),
});

export type TagPatchOneRequest = z.infer<typeof TagPatchOneRequest>;
