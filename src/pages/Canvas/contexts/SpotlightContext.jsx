import React from 'react';

import { useDismissable } from '@/hooks';

export const SpotlightContext = React.createContext(null);
export const { Consumer: SpotlightConsumer } = SpotlightContext;

export const SpotlightProvider = ({ children }) => {
  const [isVisible, toggle, hide] = useDismissable();

  return <SpotlightContext.Provider value={{ isVisible, toggle, hide }}>{children}</SpotlightContext.Provider>;
};
