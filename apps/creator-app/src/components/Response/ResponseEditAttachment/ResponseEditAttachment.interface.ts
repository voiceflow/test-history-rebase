import type { AnyAttachment } from '@voiceflow/sdk-logux-designer';

export interface IResponseEditAttachment {
  onRemove: VoidFunction;
  variantID: string;
  attachment: AnyAttachment;
  responseAttachmentID: string;
}
