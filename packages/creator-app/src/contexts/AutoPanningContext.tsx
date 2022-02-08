import { useContextApi } from '@voiceflow/ui';
import React from 'react';

export interface AutoPanningContextValue {
  isAutoPanning: React.MutableRefObject<boolean>;
}

export const AutoPanningContext = React.createContext<AutoPanningContextValue>({ isAutoPanning: { current: false } });
export const { Consumer: AutoPanningConsumer } = AutoPanningContext;

export const AutoPanningProvider: React.FC = ({ children }) => {
  const isAutoPanning = React.useRef(false);

  const api = useContextApi({ isAutoPanning });

  return <AutoPanningContext.Provider value={api}>{children}</AutoPanningContext.Provider>;
};
