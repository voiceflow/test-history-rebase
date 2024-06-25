import type { AnyAttachment, CardAttachment, MediaAttachment } from '@voiceflow/dtos';
import { AttachmentType } from '@voiceflow/dtos';

export const isMediaAttachment = (attachment: AnyAttachment): attachment is MediaAttachment =>
  attachment.type === AttachmentType.MEDIA;

export const isCardAttachment = (attachment: AnyAttachment): attachment is CardAttachment =>
  attachment.type === AttachmentType.CARD;
