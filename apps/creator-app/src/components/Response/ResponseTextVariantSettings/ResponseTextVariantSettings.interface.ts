import type { Actions, AnyResponseAttachment, TextResponseVariant } from '@voiceflow/sdk-logux-designer';

export interface IResponseTextVariantSettings {
  variant: Pick<TextResponseVariant, 'speed' | 'cardLayout'>;
  attachments: Omit<AnyResponseAttachment, 'assistantID' | 'createdAt' | 'deletedAt'>[];
  onVariantChange: (variant: Pick<Actions.ResponseVariant.PatchTextData, 'speed' | 'cardLayout'>) => void;
}
