import type { ResponseCardAttachment, ResponseMediaAttachment, UtteranceText } from '@voiceflow/dtos';

import type { IIntentCreateRequiredEntityItem } from '@/components/Intent/IntentCreateRequiredEntityItem/IntentCreateRequiredEntityItem.interface';

export interface UtteranceForm {
  id: string;
  text: UtteranceText;
}

export type EntityRepromptForm = IIntentCreateRequiredEntityItem['reprompts'][number];

export type EntityRepromptAttachment =
  | Omit<ResponseCardAttachment, 'assistantID' | 'createdAt' | 'environmentID'>
  | Omit<ResponseMediaAttachment, 'assistantID' | 'createdAt' | 'environmentID'>;
