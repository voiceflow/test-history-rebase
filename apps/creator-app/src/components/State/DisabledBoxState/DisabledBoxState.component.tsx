import { clsx } from '@voiceflow/style';
import { Box } from '@voiceflow/ui-next';
import React from 'react';

import { boxStyle } from './DisabledBoxState.css';
import { IDisabledBoxState } from './DisabledBoxState.interface';

export const DisabledBoxState: React.FC<IDisabledBoxState> = ({ disabled, children, className, ...props }) => (
  <Box {...props} className={clsx(boxStyle({ disabled }), className)}>
    {children}
  </Box>
);
