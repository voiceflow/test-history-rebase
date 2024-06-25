import { ResponseVariantType } from '@voiceflow/dtos';
import React from 'react';
import { match } from 'ts-pattern';

import { ResponseEditTextVariant } from '../ResponseEditTextVariant/ResponseEditTextVariant.component';
import type { IResponseEditVariant } from './ResponseEditVariant.interface';

export const ResponseEditVariant: React.FC<IResponseEditVariant> = ({ variant, textVariantProps, ...props }) =>
  match(variant)
    .with({ type: ResponseVariantType.TEXT }, (data) => (
      <ResponseEditTextVariant {...props} {...textVariantProps} textResponseVariant={data} />
    ))
    .exhaustive();
