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

type MarkupProviderProps = {
  skillID: string;
  projectID: string;
  activeWorkspaceID: string;
};

export const MarkupModeContext = React.createContext<MarkupModeContextType | null>(null);
export const { Consumer: MarkupModeConsumer } = MarkupModeContext;

export const MarkupModeProvider: React.FC<MarkupProviderProps> = ({ skillID, projectID, activeWorkspaceID, children }) => {
  const [trackEvents] = useTrackingEvents();
  const [startTime, setStartTime] = React.useState(0);
  const [isOpen, openTool, closeTool] = useEnableDisable(false);
  const [modeType, setModeType] = React.useState<MarkupModeType | null>(null);

  const enableMarkup = () => {
    if (!isOpen) {
      openTool();
      trackEvents.trackMarkupOpen({ skillID, projectID, workspaceID: activeWorkspaceID });
      setStartTime(Date.now());
    }
  };

  const disableMarkup = () => {
    if (isOpen) {
      trackEvents.trackMarkupSessionDuration(Date.now() - startTime);
      setStartTime(0);
      closeTool();
    }
  };

  return (
    <MarkupModeContext.Provider value={{ isOpen, openTool: enableMarkup, closeTool: disableMarkup, modeType, setModeType }}>
      {children}
    </MarkupModeContext.Provider>
  );
};
