import React from 'react';

import { DragContext, DragContextPreviewProps, DragContextType } from '@/contexts';

// eslint-disable-next-line import/prefer-default-export
export const useDragPreview = (type: string, component: React.FC<DragContextPreviewProps>, options: Record<string, any> = {}) => {
  const { registerPreview } = React.useContext(DragContext) as NonNullable<DragContextType>;

  React.useEffect(() => {
    registerPreview(type, component, options);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};
