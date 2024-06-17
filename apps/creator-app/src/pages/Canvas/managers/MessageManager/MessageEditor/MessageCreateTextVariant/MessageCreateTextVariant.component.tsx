import { ResponseVariantType } from '@voiceflow/dtos';
import React from 'react';

import { ResponseTextVariantLayout } from '@/components/Response/ResponseTextVariantLayout/ResponseTextVariantLayout.component';

import { ResponseCreateMessageSettings } from '../MessageCreateTextVariantSettings/MessageCreateTextVariantSettings.component';
import type { IResponseEditMessage } from './MessageCreateTextVariant.interface';

export const ResponseCreateMessage: React.FC<IResponseEditMessage> = ({ onVariantChange, textVariant, ...props }) => (
  <ResponseTextVariantLayout
    {...props}
    value={textVariant.text}
    onValueChange={(value) => onVariantChange({ text: value })}
    variantType={ResponseVariantType.TEXT}
    onChangeVariantType={() => null}
    settingsButton={
      <ResponseCreateMessageSettings
        variant={textVariant}
        disabled={props.disabled}
        onVariantChange={({ speed }) => onVariantChange({ speed })}
      />
    }
  />
);
