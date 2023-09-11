import React from 'react';

import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

import { ResponseTextVariantSettings } from '../ResponseTextVariantSettings/ResponseTextVariantSettings.component';
import type { IResponseEditTextVariantSettings } from './ResponseEditTextVariantSettings.interface';

export const ResponseEditTextVariantSettings: React.FC<IResponseEditTextVariantSettings> = ({ variant, ...props }) => {
  const attachments = useSelector(Designer.Response.ResponseAttachment.selectors.allByIDs, { ids: variant.attachmentOrder });

  return <ResponseTextVariantSettings {...props} variant={variant} attachments={attachments} />;
};
