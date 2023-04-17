import { useContextApi } from '@voiceflow/ui';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';

export interface SpotlightContextValue {
  isVisible: boolean;
  toggle: () => void;
  hide: (event?: MouseEvent) => void;
}

export const SpotlightContext = React.createContext<SpotlightContextValue | null>(null);
export const { Consumer: SpotlightConsumer } = SpotlightContext;

export const SpotlightProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isVisible, toggle, hide] = useDismissable();

  const api = useContextApi({ isVisible, toggle, hide });

  return <SpotlightContext.Provider value={api}>{children}</SpotlightContext.Provider>;
};
