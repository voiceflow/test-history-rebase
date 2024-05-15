import { z } from 'zod';

import { AttachmentType } from '@/attachment/attachment-type.enum';

import { BaseCompiledResponseAttachmentDTO } from '../base-attachment.compiled.dto';
import { CompiledMediaAttachmentDataDTO } from './media-attachment-data.compiled.dto';

export const CompiledMediaAttachmentDTO = BaseCompiledResponseAttachmentDTO.extend({
  type: z.literal(AttachmentType.MEDIA),
  data: CompiledMediaAttachmentDataDTO,
}).strict();

export type CompiledResponseMediaAttachment = z.infer<typeof CompiledMediaAttachmentDTO>;
