import React from 'react';

import { ResponseTextVariantSettings } from '../ResponseTextVariantSettings/ResponseTextVariantSettings.component';
import type { IResponseEditTextVariantSettings } from './ResponseEditTextVariantSettings.interface';

export const ResponseEditTextVariantSettings: React.FC<IResponseEditTextVariantSettings> = ({ variant, ...props }) => {
  return <ResponseTextVariantSettings {...props} variant={variant} />;
};
