import type { AnyAttachment, AnyResponseAttachment, AttachmentType, ResponseVariantType } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { IIntentRequiredEntityAutomaticRepromptPopper } from '../IntentRequiredEntityAutomaticRepromptPopper/IntentRequiredEntityAutomaticRepromptPopper.interface';
import { IIntentRequiredEntityRepromptsPopper } from '../IntentRequiredEntityRepromptsPopper/IntentRequiredEntityRepromptsPopper.interface';

export interface IIntentCreateRequiredEntityItem
  extends IIntentRequiredEntityAutomaticRepromptPopper,
    Pick<IIntentRequiredEntityRepromptsPopper, 'reprompts' | 'onRepromptAdd' | 'utterances' | 'intentName' | 'onRepromptsGenerated'> {
  attachments: Record<string, Array<Omit<AnyResponseAttachment, 'assistantID' | 'createdAt' | 'environmentID'> & { attachment: AnyAttachment }>>;
  onRepromptDelete: (repromptID: string) => void;
  onRepromptChange: (repromptID: string, variant: Actions.ResponseVariant.PatchTextData) => void;
  automaticReprompt: boolean;
  onRepromptAttachmentSelect: (repromptID: string, data: { id: string; type: AttachmentType }) => void;
  onRepromptVariantTypeChange: (repromptID: string, type: ResponseVariantType) => void;
  onRepromptsAttachmentRemove: (repromptID: string, responseAttachmentID: string) => void;
  onRepromptAttachmentDuplicate: (repromptID: string, attachmentID: string) => void;
}
