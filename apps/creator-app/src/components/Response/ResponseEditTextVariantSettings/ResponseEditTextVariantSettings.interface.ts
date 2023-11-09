import type { TextResponseVariant } from '@voiceflow/dtos';

import { IResponseTextVariantSettings } from '../ResponseTextVariantSettings/ResponseTextVariantSettings.interface';

export interface IResponseEditTextVariantSettings extends Omit<IResponseTextVariantSettings, 'attachments'> {
  variant: TextResponseVariant;
}
