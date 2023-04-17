import { forwardRef } from '@ui/hocs/forwardRef';
import React from 'react';

import { Base } from './icon-buttons-group.component';
import * as I from './icon-buttons-group.interface';

// eslint-disable-next-line no-secrets/no-secrets
export const Vertical = forwardRef<HTMLDivElement, I.Props>('SystemIconButtonsGroupVertical', (props, ref) => <Base mx={0} ref={ref} {...props} />);
