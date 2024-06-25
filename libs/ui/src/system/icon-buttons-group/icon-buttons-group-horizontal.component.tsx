import { forwardRef } from '@ui/hocs/forwardRef';
import React from 'react';

import { Base } from './icon-buttons-group.component';
import type * as I from './icon-buttons-group.interface';

export const Horizontal = forwardRef<HTMLDivElement, I.Props>('SystemIconButtonsGroupHorizontal', (props, ref) => (
  <Base my={0} ref={ref} {...props} />
));
