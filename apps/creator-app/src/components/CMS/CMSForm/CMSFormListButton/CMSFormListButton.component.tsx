import { forwardRef, SquareButton } from '@voiceflow/ui-next';
import React from 'react';

import type { ICMSFormListButton } from './CMSFormListButton.interface';

export const CMSFormListButton = forwardRef<HTMLButtonElement, ICMSFormListButton>('CMSFormListButton', (props, ref) => (
  <SquareButton {...props} ref={ref} size="medium" variant="light" />
));
