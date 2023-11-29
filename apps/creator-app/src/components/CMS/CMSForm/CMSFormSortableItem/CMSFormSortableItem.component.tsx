import { Box, DragButton } from '@voiceflow/ui-next';
import React, { forwardRef } from 'react';

import { CMSFormListItem } from '../CMSFormListItem/CMSFormListItem.component';
import type { ICMSFormSortableItem } from './CMSFormSortableItem.interface';

export const CMSFormSortableItem = forwardRef<HTMLDivElement, ICMSFormSortableItem>(
  ({ children, onRemove, dragButtonProps, ...props }, ref): React.ReactElement => (
    <CMSFormListItem onRemove={onRemove} {...props}>
      <DragButton.Container {...dragButtonProps} ref={ref} variant="section">
        <Box width="100%" align="center" justify="space-between" direction="row">
          {children}
        </Box>
      </DragButton.Container>
    </CMSFormListItem>
  )
);
