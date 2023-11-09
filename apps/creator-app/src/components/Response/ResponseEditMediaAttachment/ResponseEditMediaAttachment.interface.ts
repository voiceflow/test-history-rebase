import type { MediaAttachment } from '@voiceflow/dtos';

export interface IResponseEditMediaAttachment {
  onRemove: VoidFunction;
  variantID: string;
  attachment: MediaAttachment;
  responseAttachmentID: string;
}
