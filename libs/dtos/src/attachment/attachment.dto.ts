import { z } from 'zod';

import { CMSObjectResourceDTO, MarkupDTO } from '@/common';

import { AttachmentType } from './attachment-type.enum';
import { MediaDatatype } from './media-datatype.enum';

const BaseAttachmentDTO = CMSObjectResourceDTO.partial({
  updatedAt: true,
  updatedByID: true,
})
  .extend({
    type: z.nativeEnum(AttachmentType),
    assistantID: z.string().optional(),
    environmentID: z.string().optional(),
  })
  .strict();

export const CardAttachmentDTO = BaseAttachmentDTO.extend({
  type: z.literal(AttachmentType.CARD),
  title: MarkupDTO,
  mediaID: z.string().nullable(),
  description: MarkupDTO,
  buttonOrder: z.array(z.string()),
}).strict();

export type CardAttachment = z.infer<typeof CardAttachmentDTO>;

export const MediaAttachmentDTO = BaseAttachmentDTO.extend({
  url: MarkupDTO,
  type: z.literal(AttachmentType.MEDIA),
  name: z.string().min(1, 'Name is required.').max(255, 'Name is too long.'),
  isAsset: z.boolean(),
  datatype: z.nativeEnum(MediaDatatype),
}).strict();

export type MediaAttachment = z.infer<typeof MediaAttachmentDTO>;

export const AnyAttachmentDTO = z.union([CardAttachmentDTO, MediaAttachmentDTO]);

export type AnyAttachment = z.infer<typeof AnyAttachmentDTO>;
