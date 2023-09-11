import type { TextResponseVariant } from '@voiceflow/sdk-logux-designer';

import type { IResponseTextVariantLayout } from '../ResponseTextVariantLayout/ResponseTextVariantLayout.interface';

export interface IResponseEditTextVariant
  extends Omit<
    IResponseTextVariantLayout,
    'value' | 'children' | 'variantType' | 'onValueChange' | 'settingsButton' | 'attachmentsList' | 'attachmentButton' | 'onChangeVariantType'
  > {
  variant: TextResponseVariant;
}
