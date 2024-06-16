import type { TextResponseVariant } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';

export interface IResponseTextVariantSettings {
  disabled?: boolean;
  variant: Pick<TextResponseVariant, 'speed' | 'cardLayout'>;
  onVariantChange: (variant: Pick<Actions.ResponseVariant.PatchTextData, 'speed' | 'cardLayout'>) => void;
}
