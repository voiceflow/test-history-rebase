import React from 'react';

import { withContext } from '@/hocs/withContext';

export type OverlayValue = {
  setHandler: (handler: (() => void) | null) => void;
  canOpen: () => boolean;
  dismiss: () => void;
};

export const OverlayContext = React.createContext<OverlayValue | null>(null);
export const { Consumer: OverlayConsumer } = OverlayContext;

export const OverlayProvider: React.FC = ({ children }) => {
  const dismissHandler = React.useRef<(() => void) | null>(null);

  const setHandler = React.useCallback((handler) => {
    dismissHandler.current = handler;
  }, []);

  const canOpen = React.useCallback(() => !dismissHandler.current, []);

  const dismiss = React.useCallback(() => {
    dismissHandler.current?.();
    setHandler(null);
  }, []);

  return (
    <OverlayContext.Provider
      value={{
        setHandler,
        canOpen,
        dismiss,
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
};

export const withOverlay = withContext(OverlayContext, 'overlay');
