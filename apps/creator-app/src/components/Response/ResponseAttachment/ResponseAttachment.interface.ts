import type { AnyAttachment, AttachmentType } from '@voiceflow/dtos';

export interface IResponseAttachment {
  onRemove: VoidFunction;
  attachment: AnyAttachment;
  onAttachmentSelect: (data: { id: string; type: AttachmentType }) => void;
  onAttachmentDuplicate: (attachmentID: string) => void;
}
