import type { AnyResponseAttachment, TextResponseVariant } from '@voiceflow/dtos';
import type { Actions } from '@voiceflow/sdk-logux-designer';

export interface IResponseTextVariantSettings {
  variant: Pick<TextResponseVariant, 'speed' | 'cardLayout'>;
  attachments: Omit<AnyResponseAttachment, 'assistantID' | 'createdAt' | 'environmentID'>[];
  onVariantChange: (variant: Pick<Actions.ResponseVariant.PatchTextData, 'speed' | 'cardLayout'>) => void;
}
