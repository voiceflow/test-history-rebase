import type { TextResponseVariant } from '@voiceflow/sdk-logux-designer';

import { IResponseTextVariantSettings } from '../ResponseTextVariantSettings/ResponseTextVariantSettings.interface';

export interface IResponseEditTextVariantSettings extends Omit<IResponseTextVariantSettings, 'attachments'> {
  variant: TextResponseVariant;
}
