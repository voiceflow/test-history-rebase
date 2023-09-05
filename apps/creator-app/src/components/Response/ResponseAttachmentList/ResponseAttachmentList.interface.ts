import type { AnyAttachment, AnyResponseAttachment, AttachmentType } from '@voiceflow/sdk-logux-designer';

export interface IResponseAttachmentList {
  onRemove: (responseAttachmentID: string) => void;
  attachments: Array<Omit<AnyResponseAttachment, 'assistantID' | 'createdAt' | 'deletedAt'> & { attachment: AnyAttachment }>;
  onAttachmentSelect: (data: { id: string; type: AttachmentType }) => void;
  onAttachmentDuplicate: (attachmentID: string) => void;
}
