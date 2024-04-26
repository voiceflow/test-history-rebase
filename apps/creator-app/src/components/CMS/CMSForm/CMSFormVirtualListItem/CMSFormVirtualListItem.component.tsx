import { forwardRef, useVirtualItemResizeObserver } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormListItem } from '../CMSFormListItem/CMSFormListItem.component';
import type { ICMSFormVirtualListItem } from './CMSFormVirtualListItem.interface';

export const CMSFormVirtualListItem = forwardRef<HTMLDivElement, ICMSFormVirtualListItem>('CMSFormVirtualListItem')((
  props,
  ref
) => {
  const { onRef } = useVirtualItemResizeObserver(ref);

  return <CMSFormListItem {...props} ref={onRef} />;
});
