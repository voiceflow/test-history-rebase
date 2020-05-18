import React from 'react';

import { MarkupModeType } from '@/constants';
import { useTeardown, useTrackingEvents } from '@/hooks';
import { useEnableDisable } from '@/hooks/toggle';
import { getMarkupIsOpenedCookie, getMarkupStartTimeCookie, setMarkupIsOpenedCookie, setMarkupStartTimeCookie } from '@/utils/cookies';

export type MarkupModeContextType = {
  isOpen: boolean;
  openTool: () => void;
  closeTool: () => void;
  modeType: MarkupModeType | null;
  setModeType: (value: MarkupModeType | null) => void;
};

export const MarkupModeContext = React.createContext<MarkupModeContextType | null>(null);
export const { Consumer: MarkupModeConsumer } = MarkupModeContext;

const beforeUnloadTrack = (trackEvents: any) => {
  if (getMarkupIsOpenedCookie() === 'true') {
    const startTime = getMarkupStartTimeCookie();
    const duration: number = Date.now() - startTime;
    if (duration) {
      trackEvents.trackMarkupSessionDuration({ duration });
    }
  }
};

export const MarkupModeProvider: React.FC = ({ children }) => {
  const [trackEvents] = useTrackingEvents();
  const [startTime, setStartTime] = React.useState(0);
  const [isOpen, openTool, closeTool] = useEnableDisable(false);
  const [modeType, setModeType] = React.useState<MarkupModeType | null>(null);

  const enableMarkup = () => {
    if (!isOpen) {
      openTool();
      trackEvents.trackMarkupOpen();
      setMarkupIsOpenedCookie(true);
      const startTime = Date.now();
      setMarkupStartTimeCookie(startTime);
      setStartTime(startTime);
    }
  };

  const trackMarkupTime = React.useCallback(() => {
    if (isOpen) {
      const duration: number = Date.now() - startTime;
      trackEvents.trackMarkupSessionDuration({ duration });
    }
  }, [isOpen, startTime]);

  const disableMarkup = React.useCallback(() => {
    if (isOpen) {
      trackMarkupTime();
      setMarkupIsOpenedCookie(false);
      setStartTime(0);
      closeTool();
    }
  }, [isOpen, setStartTime, trackMarkupTime]);

  React.useEffect(() => {
    const unloadTrack = () => beforeUnloadTrack(trackEvents);
    window.addEventListener('beforeunload', unloadTrack);
    return () => {
      setMarkupStartTimeCookie(false);
      window.removeEventListener('beforeunload', unloadTrack);
    };
  }, []);

  useTeardown(() => {
    trackMarkupTime();
  }, [trackMarkupTime]);

  return (
    <MarkupModeContext.Provider value={{ isOpen, openTool: enableMarkup, closeTool: disableMarkup, modeType, setModeType }}>
      {children}
    </MarkupModeContext.Provider>
  );
};
