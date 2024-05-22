import { ResponseVariantType } from '@voiceflow/dtos';
import React from 'react';
import { match } from 'ts-pattern';

import { ResponseCreateTextVariant } from '../ResponseCreateTextVariant/ResponseCreateTextVariant.component';
import type { IResponseCreateVariant } from './ResponseCreateVariant.interface';

export const ResponseCreateVariant: React.FC<IResponseCreateVariant> = ({
  variant,
  autoFocus,
  removeButton,
  autoFocusIfEmpty,
  textVariantProps,
  testID,
}) =>
  match(variant)
    .with({ type: ResponseVariantType.TEXT }, (data) => (
      <ResponseCreateTextVariant
        {...textVariantProps}
        textResponseVariant={data}
        autoFocus={autoFocus}
        removeButton={removeButton}
        autoFocusIfEmpty={autoFocusIfEmpty}
        testID={testID}
      />
    ))
    .exhaustive();
