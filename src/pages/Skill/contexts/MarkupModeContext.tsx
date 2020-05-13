import React from 'react';

import { MarkupModeType } from '@/constants';
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
  const [isOpen, openTool, closeTool] = useEnableDisable(false);
  const [modeType, setModeType] = React.useState<MarkupModeType | null>(null);

  return <MarkupModeContext.Provider value={{ isOpen, openTool, closeTool, modeType, setModeType }}>{children}</MarkupModeContext.Provider>;
};
