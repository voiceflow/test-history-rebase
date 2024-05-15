import { z } from 'zod';

import { CompiledCardButtonDTO } from '@/attachment/card-button/card-button.compiled.dto';

import { CompiledMediaAttachmentDataDTO } from '../media-attachment/media-attachment-data.compiled.dto';

export const CompiledCardAttachmentDataDTO = z.object({
  title: z.string(),
  media: CompiledMediaAttachmentDataDTO.nullable(),
  description: z.string(),
  buttons: z.array(CompiledCardButtonDTO),
});

export type CompiledCardAttachmentData = z.infer<typeof CompiledCardAttachmentDataDTO>;
