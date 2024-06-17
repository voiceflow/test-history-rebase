import React from 'react';

import { ResponseMessageLayout } from '@/components/ResponseV2/ResponseMessageLayout/ResponseMessageLayout.component';

import type { IResponseEditMessage } from './MessageCreateTextVariant.interface';

export const ResponseCreateMessage: React.FC<IResponseEditMessage> = ({ onVariantChange, textVariant, ...props }) => (
  <ResponseMessageLayout
    {...props}
    value={textVariant.text}
    onValueChange={(value) => onVariantChange({ text: value })}
    onChangeVariantType={() => null}
  />
);
