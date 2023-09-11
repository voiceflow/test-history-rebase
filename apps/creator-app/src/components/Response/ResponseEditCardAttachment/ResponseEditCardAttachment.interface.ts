import type { CardAttachment } from '@voiceflow/sdk-logux-designer';

export interface IResponseEditCardAttachment {
  onRemove: VoidFunction;
  variantID: string;
  attachment: CardAttachment;
  responseAttachmentID: string;
}
