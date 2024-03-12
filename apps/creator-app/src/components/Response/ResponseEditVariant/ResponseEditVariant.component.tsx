import { ResponseVariantType } from '@voiceflow/dtos';
import { Text } from '@voiceflow/ui-next';
import React from 'react';
import { match } from 'ts-pattern';

import { ResponseEditTextVariant } from '../ResponseEditTextVariant/ResponseEditTextVariant.component';
import type { IResponseEditVariant } from './ResponseEditVariant.interface';

export const ResponseEditVariant: React.FC<IResponseEditVariant> = ({ variant, textVariantProps, ...props }) =>
  match(variant)
    .with({ type: ResponseVariantType.TEXT }, (data) => <ResponseEditTextVariant {...props} {...textVariantProps} textResponseVariant={data} />)
    .with({ type: ResponseVariantType.JSON }, () => <Text>TODO: Not implemented</Text>)
    .exhaustive();
