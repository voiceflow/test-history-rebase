import { TextResponseVariantCreate } from '@voiceflow/dtos';

import { IResponseTextVariantLayout } from '@/components/Response/ResponseTextVariantLayout/ResponseTextVariantLayout.interface';

export interface IResponseEditMessage
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
