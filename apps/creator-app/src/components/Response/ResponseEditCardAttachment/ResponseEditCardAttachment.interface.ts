import type { CardAttachment } from '@voiceflow/dtos';

export interface IResponseEditCardAttachment {
  onRemove: VoidFunction;
  variantID: string;
  attachment: CardAttachment;
  responseAttachmentID: string;
}
