import { clsx, tid } from '@voiceflow/style';
import { Box, forwardRef } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormListButtonRemove } from '../CMSFormListButtonRemove/CMSFormListButtonRemove.component';
import { buttonStyle, containerStyle } from './CMSFormListItem.css';
import type { ICMSFormListItem } from './CMSFormListItem.interface';

export const CMSFormListItem = forwardRef<HTMLDivElement, ICMSFormListItem>('CMSFormListItem')(
  ({ pr = 16, gap = 12, index, onRemove, children, className, showOnHover, removeDisabled, contentContainerProps, ...props }, ref) => (
    <Box {...props} pr={pr} ref={ref} gap={gap} direction="row" className={clsx(containerStyle, className)} data-index={index}>
      <Box width="100%" overflow="hidden" direction="column" {...contentContainerProps}>
        {children}
      </Box>

      <CMSFormListButtonRemove
        onClick={onRemove}
        disabled={removeDisabled}
        className={buttonStyle({ showOnHover })}
        testID={tid(props.testID, 'remove')}
      />
    </Box>
  )
);
