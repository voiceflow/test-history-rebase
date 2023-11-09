import type { AttachmentType, CardAttachment } from '@voiceflow/dtos';

export interface IResponseCardAttachment {
  onRemove: VoidFunction;
  attachment: CardAttachment;
  onAttachmentSelect: (data: { id: string; type: AttachmentType }) => void;
  onAttachmentDuplicate: (attachmentID: string) => void;
}
