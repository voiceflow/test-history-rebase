import { ResponseVariantType } from '@voiceflow/dtos';
import React from 'react';

import { ResponseTextVariantLayout } from '@/components/Response/ResponseTextVariantLayout/ResponseTextVariantLayout.component';

import { ResponseCreateTextVariantSettings } from '../ResponseCreateTextVariantSettings/ResponseCreateTextVariantSettings.component';
import type { IResponseEditTextVariant } from './ResponseCreateTextVariant.interface';

export const ResponseCreateTextVariant: React.FC<IResponseEditTextVariant> = ({
  onVariantChange,
  textVariant,
  ...props
}) => (
  <ResponseTextVariantLayout
    {...props}
    value={textVariant.text}
    onValueChange={(value) => onVariantChange({ text: value })}
    variantType={ResponseVariantType.TEXT}
    onChangeVariantType={() => null}
    settingsButton={
      <ResponseCreateTextVariantSettings
        variant={textVariant}
        disabled={props.disabled}
        onVariantChange={({ speed }) => onVariantChange({ speed })}
      />
    }
  />
);
