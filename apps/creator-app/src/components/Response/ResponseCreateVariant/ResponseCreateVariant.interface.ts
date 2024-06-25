import type { TextResponseVariant } from '@voiceflow/dtos';
import type { BaseProps } from '@voiceflow/ui-next';

import type { IResponseCreateTextVariant } from '../ResponseCreateTextVariant/ResponseCreateTextVariant.interface';

type CreateVariant<T> = Omit<
  T,
  'conditionID' | 'discriminatorID' | 'assistantID' | 'createdAt' | 'updatedAt' | 'environmentID' | 'updatedByID'
>;

export interface IResponseCreateVariant extends BaseProps {
  variant: CreateVariant<TextResponseVariant>;
  autoFocus?: boolean;
  removeButton?: React.ReactNode;
  autoFocusIfEmpty?: boolean;
  textVariantProps: Omit<
    IResponseCreateTextVariant,
    'value' | 'textResponseVariant' | 'toolbar' | 'autoFocus' | 'onValueChange'
  >;
}
