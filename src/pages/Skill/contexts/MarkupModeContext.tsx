import React from 'react';

import { MarkupModeType } from '@/constants';
import { useTrackingEvents } from '@/hooks';
import { useEnableDisable } from '@/hooks/toggle';

export type MarkupModeContextType = {
  isOpen: boolean;
  openTool: () => void;
  closeTool: () => void;
  modeType: MarkupModeType | null;
  setModeType: (value: MarkupModeType | null) => void;
};

export const MarkupModeContext = React.createContext<MarkupModeContextType | null>(null);
export const { Consumer: MarkupModeConsumer } = MarkupModeContext;

export const MarkupModeProvider: React.FC = ({ children }) => {
  const [trackEvents] = useTrackingEvents();
  const [isOpen, openTool, closeTool] = useEnableDisable(false);
  const [modeType, setModeType] = React.useState<MarkupModeType | null>(null);
  const startTimeCache = React.useRef(0);
  const isOpenCache = React.useRef(isOpen);

  isOpenCache.current = isOpen;

  const trackMarkupTime = React.useCallback(() => {
    if (startTimeCache.current) {
      trackEvents.trackMarkupSessionDuration({ duration: Date.now() - startTimeCache.current });
      startTimeCache.current = 0;
    }
  }, []);

  const enableMarkup = React.useCallback(() => {
    if (isOpenCache.current) {
      return;
    }

    openTool();
    trackEvents.trackMarkupOpen();

    startTimeCache.current = Date.now();
  }, []);

  const disableMarkup = React.useCallback(() => {
    if (!isOpenCache.current) {
      return;
    }

    trackMarkupTime();
    closeTool();
  }, []);

  React.useEffect(() => {
    window.addEventListener('beforeunload', trackMarkupTime);

    return () => {
      trackMarkupTime();
      window.removeEventListener('beforeunload', trackMarkupTime);
    };
  }, []);

  return (
    <MarkupModeContext.Provider value={{ isOpen, openTool: enableMarkup, closeTool: disableMarkup, modeType, setModeType }}>
      {children}
    </MarkupModeContext.Provider>
  );
};
