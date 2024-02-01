import { z } from 'zod';

import { AttachmentType } from '@/attachment/attachment-type.enum';
import { CMSCreatableResourceDTO } from '@/common';

const BaseResponseAttachmentDTO = CMSCreatableResourceDTO.extend({
  type: z.nativeEnum(AttachmentType),
  variantID: z.string(),
  assistantID: z.string().optional(),
  environmentID: z.string().optional(),
}).strict();

export const ResponseCardAttachmentDRO = BaseResponseAttachmentDTO.extend({
  type: z.literal(AttachmentType.CARD),
  cardID: z.string(),
}).strict();

export type ResponseCardAttachment = z.infer<typeof ResponseCardAttachmentDRO>;

export const ResponseMediaAttachmentDRO = BaseResponseAttachmentDTO.extend({
  type: z.literal(AttachmentType.MEDIA),
  mediaID: z.string(),
}).strict();

export type ResponseMediaAttachment = z.infer<typeof ResponseMediaAttachmentDRO>;

export const AnyResponseAttachmentDTO = z.union([ResponseCardAttachmentDRO, ResponseMediaAttachmentDRO]);

export type AnyResponseAttachment = z.infer<typeof AnyResponseAttachmentDTO>;
