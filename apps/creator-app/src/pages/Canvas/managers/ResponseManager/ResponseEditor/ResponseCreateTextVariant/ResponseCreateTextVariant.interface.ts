import type { TextResponseVariantCreate } from '@voiceflow/dtos';

import type { IResponseTextVariantLayout } from '@/components/Response/ResponseTextVariantLayout/ResponseTextVariantLayout.interface';

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
  onVariantChange: (variant: Partial<TextResponseVariantCreate>) => void;
  textVariant: TextResponseVariantCreate;
}
