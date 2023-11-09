import type { AnyAttachment, AnyResponseAttachment, AttachmentType } from '@voiceflow/dtos';

export interface IResponseAttachmentList {
  onRemove: (responseAttachmentID: string) => void;
  attachments: Array<Omit<AnyResponseAttachment, 'assistantID' | 'createdAt' | 'environmentID'> & { attachment: AnyAttachment }>;
  onAttachmentSelect: (data: { id: string; type: AttachmentType }) => void;
  onAttachmentDuplicate: (attachmentID: string) => void;
}
