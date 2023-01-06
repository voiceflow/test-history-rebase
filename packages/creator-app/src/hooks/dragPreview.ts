import React from 'react';

import { DragContext, DragContextPreviewProps } from '@/contexts/DragContext';
import type { PreviewOptions } from '@/contexts/DragContext/DragLayer';

export type { PreviewOptions } from '@/contexts/DragContext/DragLayer';

export const useDragPreview = <P>(type: string, component: React.OldFC<DragContextPreviewProps & P>, options: PreviewOptions = {}): void => {
  const { registerPreview } = React.useContext(DragContext)!;

  React.useEffect(() => {
    registerPreview(type, component as React.OldFC<DragContextPreviewProps & P>, options);

    return () => {
      registerPreview(type, null);
    };
  }, []);
};
