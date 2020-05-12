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
  const [startTime, setStartTime] = React.useState(0);
  const [isOpen, openTool, closeTool] = useEnableDisable(false);
  const [modeType, setModeType] = React.useState<MarkupModeType | null>(null);

  const enableMarkup = () => {
    if (!isOpen) {
      openTool();
      trackEvents.trackMarkupOpen();
      setStartTime(Date.now());
    }
  };

  const trackMarkupTime = React.useCallback(() => {
    if (isOpen) {
      const duration: number = Date.now() - startTime;
      trackEvents.trackMarkupSessionDuration({ duration });
    }
  }, [isOpen]);

  const disableMarkup = React.useCallback(() => {
    if (isOpen) {
      trackMarkupTime();
      setStartTime(0);
      closeTool();
    }
  }, [isOpen, trackMarkupTime]);

  React.useEffect(() => {
    window.addEventListener('beforeunload', trackMarkupTime);
    return window.removeEventListener('beforeunload', trackMarkupTime);
  }, [isOpen]);

  return (
    <MarkupModeContext.Provider value={{ isOpen, openTool: enableMarkup, closeTool: disableMarkup, modeType, setModeType }}>
      {children}
    </MarkupModeContext.Provider>
  );
};
