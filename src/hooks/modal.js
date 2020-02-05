import React from 'react';

import { ModalLayerContext } from '@/contexts';

export const useModalToggle = (key) => {
  const { toggle } = React.useContext(ModalLayerContext);

  return React.useCallback(() => toggle(key), [key, toggle]);
};
