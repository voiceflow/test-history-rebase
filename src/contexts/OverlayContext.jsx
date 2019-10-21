import React from 'react';

import { withContext } from '@/hocs';

export const OverlayContext = React.createContext(null);
export const { Consumer: OverlayConsumer } = OverlayContext;

export const OverlayProvider = ({ children }) => {
  const dismissHandler = React.useRef(null);

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
