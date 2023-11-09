import type { AnyResponseVariant } from '@voiceflow/dtos';

import type { IResponseEditTextVariant } from '../ResponseEditTextVariant/ResponseEditTextVariant.interface';

export interface IResponseEditVariant {
  variant: AnyResponseVariant;
  autoFocus?: boolean;
  removeButton?: React.ReactNode;
  autoFocusIfEmpty?: boolean;
  textVariantProps?: Omit<IResponseEditTextVariant, 'value' | 'variant' | 'toolbar' | 'autoFocus' | 'onValueChange'>;
}
