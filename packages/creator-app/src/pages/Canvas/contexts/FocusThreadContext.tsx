import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { EngineContext } from './EngineContext';

export type FocusThreadContextValue = {
  focusedID: string | null;
  setFocus: (id: string) => Promise<void>;
  resetFocus: () => void;
};

export const FocusThreadContext = React.createContext<FocusThreadContextValue | null>(null);
export const { Consumer: FocusThreadConsumer } = FocusThreadContext;

export const FocusThreadProvider: React.FC = ({ children }) => {
  const engine = React.useContext(EngineContext)!;

  const [focusedID, setFocusedID] = React.useState<string | null>(null);

  const setFocus = React.useCallback(
    async (id: string) => {
      setFocusedID(id);
      await engine.comment.setFocus(id);
    },
    [engine]
  );

  const resetFocus = React.useCallback(() => {
    setFocusedID(null);
    engine.comment.reset();
  }, [engine]);

  const api = useContextApi({ focusedID, setFocus, resetFocus });

  return <FocusThreadContext.Provider value={api}>{children}</FocusThreadContext.Provider>;
};
