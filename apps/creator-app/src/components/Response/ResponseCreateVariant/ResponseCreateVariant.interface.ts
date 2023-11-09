import type { JSONResponseVariant, PromptResponseVariantWithPrompt, TextResponseVariant } from '@voiceflow/dtos';

import type { IResponseCreateTextVariant } from '../ResponseCreateTextVariant/ResponseCreateTextVariant.interface';

type CreateVariant<T> = Omit<T, 'conditionID' | 'discriminatorID' | 'assistantID' | 'createdAt' | 'updatedAt' | 'environmentID'>;

export interface IResponseCreateVariant {
  variant: CreateVariant<TextResponseVariant> | CreateVariant<PromptResponseVariantWithPrompt> | CreateVariant<JSONResponseVariant>;
  autoFocus?: boolean;
  removeButton?: React.ReactNode;
  autoFocusIfEmpty?: boolean;
  textVariantProps: Omit<IResponseCreateTextVariant, 'value' | 'variant' | 'toolbar' | 'autoFocus' | 'onValueChange'>;
}
