import React from 'react';

import { DragContext, DragContextPreviewProps } from '@/contexts';

// eslint-disable-next-line import/prefer-default-export
export const useDragPreview = <P extends {}>(type: string, component: React.FC<DragContextPreviewProps & P>, options: Record<string, any> = {}) => {
  const { registerPreview } = React.useContext(DragContext)!;

  React.useEffect(() => {
    registerPreview(type, component as React.FC<DragContextPreviewProps & P>, options);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};
