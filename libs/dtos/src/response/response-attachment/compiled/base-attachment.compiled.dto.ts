import { z } from 'zod';

import { AttachmentType } from '@/attachment/attachment-type.enum';
import { CMSBaseResourceDTO } from '@/common';

import { CompiledCardAttachmentDataDTO } from './card-attachment/card-attachment-data.compiled.dto';
import { CompiledMediaAttachmentDataDTO } from './media-attachment/media-attachment-data.compiled.dto';

export const BaseCompiledResponseAttachmentDTO = CMSBaseResourceDTO.extend({
  type: z.nativeEnum(AttachmentType),
  data: z.union([CompiledCardAttachmentDataDTO, CompiledMediaAttachmentDataDTO]),
}).strict();
