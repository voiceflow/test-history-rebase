import type { MediaAttachment } from '@voiceflow/sdk-logux-designer';

export interface IResponseEditMediaAttachment {
  onRemove: VoidFunction;
  variantID: string;
  attachment: MediaAttachment;
  responseAttachmentID: string;
}
