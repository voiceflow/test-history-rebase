import { ResponseMessageCreate } from '@voiceflow/dtos';

import { IResponseMessageLayout } from '@/components/ResponseV2/ResponseMessageLayout/ResponseMessageLayout.interface';

export interface IResponseEditMessage
  extends Omit<
    IResponseMessageLayout,
    | 'value'
    | 'children'
    | 'variantType'
    | 'onValueChange'
    | 'settingsButton'
    | 'attachmentsList'
    | 'attachmentButton'
    | 'onChangeVariantType'
  > {
  onVariantChange: (variant: Partial<ResponseMessageCreate>) => void;
  textVariant: ResponseMessageCreate;
}
