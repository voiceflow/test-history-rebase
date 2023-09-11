import { ResponseVariantType } from '@voiceflow/sdk-logux-designer';
import { Text } from '@voiceflow/ui-next';
import React from 'react';
import { match } from 'ts-pattern';

import { ResponseCreateTextVariant } from '../ResponseCreateTextVariant/ResponseCreateTextVariant.component';
import type { IResponseCreateVariant } from './ResponseCreateVariant.interface';

export const ResponseCreateVariant: React.FC<IResponseCreateVariant> = ({ variant, autoFocus, removeButton, autoFocusIfEmpty, textVariantProps }) =>
  match(variant)
    .with({ type: ResponseVariantType.TEXT }, (data) => (
      <ResponseCreateTextVariant
        {...textVariantProps}
        variant={data}
        autoFocus={autoFocus}
        removeButton={removeButton}
        autoFocusIfEmpty={autoFocusIfEmpty}
      />
    ))
    .with({ type: ResponseVariantType.JSON }, () => <Text>TODO: Not implemented</Text>)
    .with({ type: ResponseVariantType.PROMPT }, () => <Text>TODO: Not implemented</Text>)
    .exhaustive();
