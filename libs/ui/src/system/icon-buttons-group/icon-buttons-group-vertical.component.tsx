import { forwardRef } from '@ui/hocs/forwardRef';
import React from 'react';

import { Base } from './icon-buttons-group.component';
import type * as I from './icon-buttons-group.interface';

export const Vertical = forwardRef<HTMLDivElement, I.Props>('SystemIconButtonsGroupVertical', (props, ref) => (
  <Base mx={0} ref={ref} {...props} />
));
