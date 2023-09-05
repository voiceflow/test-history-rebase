import { forwardRef } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormListButton } from '../CMSFormListButton/CMSFormListButton.component';
import type { ICMSFormListButtonRemove } from './CMSFormListButtonRemove.interface';

export const CMSFormListButtonRemove = forwardRef<HTMLButtonElement, ICMSFormListButtonRemove>('CMSFormListButtonRemove', (props, ref) => (
  <CMSFormListButton {...props} ref={ref} iconName="Minus" />
));
