import React from 'react';

import { withContext } from '@/hocs/withContext';
import { useContextApi } from '@/hooks/cache';

export type OverlayValue<T extends HTMLElement | Document = Document> = {
  canOpen: () => boolean;
  dismiss: () => void;
  rootNode: T;
  setHandler: (handler: (() => void) | null) => void;
};

export const OverlayContext = React.createContext<OverlayValue<HTMLElement | Document> | null>(null);
export const { Consumer: OverlayConsumer } = OverlayContext;

export const OverlayProvider = <T extends HTMLElement | Document = Document>({
  children,
  rootNode = document as any,
}: React.PropsWithChildren<{ rootNode?: T }>) => {
  const dismissHandler = React.useRef<(() => void) | null>(null);

  const setHandler = React.useCallback((handler) => {
    dismissHandler.current = handler;
  }, []);

  const canOpen = React.useCallback(() => !dismissHandler.current, []);

  const dismiss = React.useCallback(() => {
    dismissHandler.current?.();
    setHandler(null);
  }, []);

  const value = useContextApi<OverlayValue<T>>({ canOpen, dismiss, rootNode, setHandler });

  return <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>;
};

export const withOverlay = withContext(OverlayContext, 'overlay');
