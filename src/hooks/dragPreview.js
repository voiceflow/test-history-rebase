import React from 'react';

import { DragContext } from '@/contexts';

// eslint-disable-next-line import/prefer-default-export
export const useDragPreview = (type, component, options = {}) => {
  const { registerPreview } = React.useContext(DragContext);

  React.useEffect(() => {
    registerPreview(type, component, options);
  }, []);
};
