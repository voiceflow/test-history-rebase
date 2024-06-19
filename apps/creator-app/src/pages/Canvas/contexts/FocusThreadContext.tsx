import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { EngineContext } from './Engine.context';

export interface FocusThreadContextValue {
  focusedID: string | null;
  setFocus: (id: string, options?: { center?: boolean; commentID?: string }) => Promise<void>;
  resetFocus: (options?: { syncURL?: boolean }) => void;
}

export const FocusThreadContext = React.createContext<FocusThreadContextValue | null>(null);
export const { Consumer: FocusThreadConsumer } = FocusThreadContext;

export const FocusThreadProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const engine = React.useContext(EngineContext)!;

  const [focusedID, setFocusedID] = React.useState<string | null>(null);

  const setFocus = React.useCallback(
    async (id: string, options?: { center?: boolean }) => {
      setFocusedID(id);

      await engine.comment.setFocus(id, options);
    },
    [engine]
  );

  const resetFocus = React.useCallback(
    (options?: { syncURL?: boolean }) => {
      setFocusedID(null);
      engine.comment.reset(options);
    },
    [engine]
  );

  const api = useContextApi({ focusedID, setFocus, resetFocus });

  return <FocusThreadContext.Provider value={api}>{children}</FocusThreadContext.Provider>;
};
