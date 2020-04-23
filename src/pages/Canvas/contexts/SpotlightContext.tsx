import React from 'react';

import { useDismissable } from '@/hooks';

export type SpotlightContextValue = {
  isVisible: boolean;
  toggle: () => void;
  hide: (event?: MouseEvent) => void;
};

export const SpotlightContext = React.createContext<SpotlightContextValue | null>(null);
export const { Consumer: SpotlightConsumer } = SpotlightContext;

export const SpotlightProvider: React.FC = ({ children }) => {
  const [isVisible, toggle, hide] = useDismissable();

  return <SpotlightContext.Provider value={{ isVisible, toggle, hide }}>{children}</SpotlightContext.Provider>;
};
