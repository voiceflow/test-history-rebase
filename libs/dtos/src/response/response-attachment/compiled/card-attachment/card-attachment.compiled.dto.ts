import { z } from 'zod';

import { AttachmentType } from '@/attachment/attachment-type.enum';

import { BaseCompiledResponseAttachmentDTO } from '../base-attachment.compiled.dto';
import { CompiledCardAttachmentDataDTO } from './card-attachment-data.compiled.dto';

export const CompiledCardAttachmentDTO = BaseCompiledResponseAttachmentDTO.extend({
  type: z.literal(AttachmentType.CARD),
  data: CompiledCardAttachmentDataDTO,
}).strict();

export type CompiledResponseCardAttachment = z.infer<typeof CompiledCardAttachmentDTO>;
