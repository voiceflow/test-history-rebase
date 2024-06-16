import React from 'react';

import { ResponseTextVariantSettings } from '@/components/Response/ResponseTextVariantSettings/ResponseTextVariantSettings.component';

import type { IResponseCreateTextVariantSettings } from './ResponseCreateTextVariantSettings.interface';

export const ResponseCreateTextVariantSettings: React.FC<IResponseCreateTextVariantSettings> = ({
  variant,
  disabled,
  ...props
}) => <ResponseTextVariantSettings {...props} disabled={disabled} variant={variant} />;
