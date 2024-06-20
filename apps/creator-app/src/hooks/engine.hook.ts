import React from 'react';

import { EventualEngineContext } from '@/contexts/EventualEngineContext';

export const useEventualEngine = () => {
  const eventualEngine = React.useContext(EventualEngineContext);

  return React.useCallback(() => eventualEngine?.get(), []);
};
