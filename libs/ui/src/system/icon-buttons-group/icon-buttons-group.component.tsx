import React from 'react';

import Box from '@/components/Box';
import { forwardRef } from '@/hocs/forwardRef';
import * as IconButton from '@/system/icon-button';

import type * as I from './icon-buttons-group.interface';

export const Base = forwardRef<HTMLDivElement, I.Props>(
  'SystemIconButtonsGroup',
  ({ size = IconButton.Size.M, gap = 8, color, children, ...props }, ref) => (
    <Box.Flex m={(size - IconButton.ICON_BOX_SIZE) / -2} ref={ref} gap={gap} color={color as any} {...props}>
      {children}
    </Box.Flex>
  )
);
