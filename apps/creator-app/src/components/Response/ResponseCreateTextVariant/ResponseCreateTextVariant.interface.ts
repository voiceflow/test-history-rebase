import type { Actions, AnyAttachment, AnyResponseAttachment, AttachmentType, TextResponseVariant } from '@voiceflow/sdk-logux-designer';

import type { IResponseTextVariantLayout } from '../ResponseTextVariantLayout/ResponseTextVariantLayout.interface';

export interface IResponseCreateTextVariant
  extends Omit<IResponseTextVariantLayout, 'value' | 'onValueChange' | 'settingsButton' | 'attachmentsList' | 'attachmentButton'> {
  variant: Pick<TextResponseVariant, 'text' | 'speed' | 'cardLayout'>;
  attachments: Array<Omit<AnyResponseAttachment, 'assistantID' | 'createdAt' | 'deletedAt'> & { attachment: AnyAttachment }>;
  onVariantChange: (variant: Actions.ResponseVariant.PatchTextData) => void;
  onAttachmentSelect: (data: { id: string; type: AttachmentType }) => void;
  onAttachmentDuplicate: (attachmentID: string) => void;
  onResponseAttachmentRemove: (responseAttachmentID: string) => void;
}
