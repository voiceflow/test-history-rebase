import React from 'react';

import { EngineContext } from './EngineContext';

export type FocusThreadContextValue = {
  focusedID: string | null;
  setFocus: (id: string) => void;
  resetFocus: () => void;
};

export const FocusThreadContext = React.createContext<FocusThreadContextValue | null>(null);
export const { Consumer: FocusThreadConsumer } = FocusThreadContext;

export const FocusThreadProvider: React.FC = ({ children }) => {
  const engine = React.useContext(EngineContext)!;

  const [focusedID, setFocusedID] = React.useState<string | null>(null);

  const setFocus = async (id: string) => {
    setFocusedID(id);
    await engine.comment.setFocus(id);
  };

  const resetFocus = () => {
    setFocusedID(null);
    engine.comment.reset();
  };

  return <FocusThreadContext.Provider value={{ focusedID, setFocus, resetFocus }}>{children}</FocusThreadContext.Provider>;
};
