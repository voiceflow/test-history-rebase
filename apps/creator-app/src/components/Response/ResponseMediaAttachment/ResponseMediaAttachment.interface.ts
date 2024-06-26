import type { AttachmentType, MediaAttachment } from '@voiceflow/dtos';

export interface IResponseMediaAttachment {
  onRemove: VoidFunction;
  attachment: MediaAttachment;
  onAttachmentSelect: (data: { id: string; type: AttachmentType }) => void;
  onAttachmentDuplicate: (attachmentID: string) => void;
}
