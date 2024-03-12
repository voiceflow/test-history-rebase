import type { JSONResponseVariant, TextResponseVariant } from '@voiceflow/dtos';
import { BaseProps } from '@voiceflow/ui-next';

import type { IResponseCreateTextVariant } from '../ResponseCreateTextVariant/ResponseCreateTextVariant.interface';

type CreateVariant<T> = Omit<T, 'conditionID' | 'discriminatorID' | 'assistantID' | 'createdAt' | 'updatedAt' | 'environmentID' | 'updatedByID'>;

export interface IResponseCreateVariant extends BaseProps {
  variant: CreateVariant<TextResponseVariant> | CreateVariant<JSONResponseVariant>;
  autoFocus?: boolean;
  removeButton?: React.ReactNode;
  autoFocusIfEmpty?: boolean;
  textVariantProps: Omit<IResponseCreateTextVariant, 'value' | 'textResponseVariant' | 'toolbar' | 'autoFocus' | 'onValueChange'>;
}
