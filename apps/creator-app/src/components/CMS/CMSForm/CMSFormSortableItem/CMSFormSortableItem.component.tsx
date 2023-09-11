import { Box, DragButton } from '@voiceflow/ui-next';
import React, { forwardRef } from 'react';

import { CMSFormListItem } from '../CMSFormListItem/CMSFormListItem.component';
import type { ICMSFormSortableItem } from './CMSFormSortableItem.interface';

export const CMSFormSortableItem = forwardRef<HTMLDivElement, ICMSFormSortableItem>(
  ({ children, style, onRemove, dragButtonProps, ...props }, ref): React.ReactElement => {
    return (
      <CMSFormListItem onRemove={onRemove} {...props}>
        <DragButton.Container {...dragButtonProps} ref={ref} variant="section">
          <Box width="100%" pl={24} align="center" justify="space-between" direction="row" style={style}>
            {children}
          </Box>
        </DragButton.Container>
      </CMSFormListItem>
    );
  }
);
