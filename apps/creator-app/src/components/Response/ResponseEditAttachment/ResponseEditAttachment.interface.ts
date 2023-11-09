import type { AnyAttachment } from '@voiceflow/dtos';

export interface IResponseEditAttachment {
  onRemove: VoidFunction;
  variantID: string;
  attachment: AnyAttachment;
  responseAttachmentID: string;
}
