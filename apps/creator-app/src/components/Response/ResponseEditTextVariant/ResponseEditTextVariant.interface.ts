import type { TextResponseVariant } from '@voiceflow/dtos';

import type { IResponseTextVariantLayout } from '../ResponseTextVariantLayout/ResponseTextVariantLayout.interface';

export interface IResponseEditTextVariant
  extends Omit<
    IResponseTextVariantLayout,
    | 'value'
    | 'children'
    | 'variantType'
    | 'onValueChange'
    | 'settingsButton'
    | 'attachmentsList'
    | 'attachmentButton'
    | 'onChangeVariantType'
  > {
  textResponseVariant: TextResponseVariant;
}
