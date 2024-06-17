import type { TextResponseVariantCreate } from '@voiceflow/dtos';

import { IResponseTextVariantSettings } from '@/components/Response/ResponseTextVariantSettings/ResponseTextVariantSettings.interface';

export interface IMessageCreateTextVariantSettings extends Omit<IResponseTextVariantSettings, 'attachments'> {
  variant: TextResponseVariantCreate;
  disabled?: boolean;
}
