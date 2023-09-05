import type { ResponseCardAttachment, ResponseMediaAttachment, UtteranceText } from '@voiceflow/sdk-logux-designer';

import type { IIntentCreateRequiredEntityItem } from '@/components/Intent/IntentCreateRequiredEntityItem/IntentCreateRequiredEntityItem.interface';

export interface UtteranceForm {
  id: string;
  text: UtteranceText;
}

export type EntityRepromptForm = IIntentCreateRequiredEntityItem['reprompts'][number];

export type EntityRepromptAttachment =
  | Omit<ResponseCardAttachment, 'assistantID' | 'createdAt' | 'deletedAt'>
  | Omit<ResponseMediaAttachment, 'assistantID' | 'createdAt' | 'deletedAt'>;
