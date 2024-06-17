import React from 'react';

import { ResponseTextVariantSettings } from '@/components/Response/ResponseTextVariantSettings/ResponseTextVariantSettings.component';

import type { IMessageCreateTextVariantSettings } from './MessageCreateTextVariantSettings.interface';

export const ResponseCreateMessageSettings: React.FC<IMessageCreateTextVariantSettings> = ({
  variant,
  disabled,
  ...props
}) => <ResponseTextVariantSettings {...props} disabled={disabled} variant={variant} />;
