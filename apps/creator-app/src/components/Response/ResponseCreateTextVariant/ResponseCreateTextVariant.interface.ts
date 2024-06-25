import type { AnyAttachment, AnyResponseAttachment, AttachmentType, TextResponseVariant } from '@voiceflow/dtos';
import type { Actions } from '@voiceflow/sdk-logux-designer';

import type { IResponseTextVariantLayout } from '../ResponseTextVariantLayout/ResponseTextVariantLayout.interface';

export interface IResponseCreateTextVariant
  extends Omit<
    IResponseTextVariantLayout,
    'value' | 'onValueChange' | 'settingsButton' | 'attachmentsList' | 'attachmentButton'
  > {
  textResponseVariant: Pick<TextResponseVariant, 'text' | 'speed' | 'cardLayout'>;
  attachments: Array<
    Omit<AnyResponseAttachment, 'assistantID' | 'createdAt' | 'environmentID'> & { attachment: AnyAttachment }
  >;
  onVariantChange: (variant: Actions.ResponseVariant.PatchTextData) => void;
  onAttachmentSelect: (data: { id: string; type: AttachmentType }) => void;
  onAttachmentDuplicate: (attachmentID: string) => void;
  onResponseAttachmentRemove: (responseAttachmentID: string) => void;
}
