import { SmartReducerAPi, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

interface HotkeysReducerState {
  disableCanvasCloseMode: string[];
  disableCanvasNodeDelete: string[];
}

export type HotkeysContextValue = readonly [HotkeysReducerState, SmartReducerAPi<HotkeysReducerState>];

export const HotkeysContext = React.createContext<HotkeysContextValue | null>(null);

export const HotkeysContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const api = useSmartReducerV2<HotkeysReducerState>({
    disableCanvasCloseMode: [],
    disableCanvasNodeDelete: [],
  });

  return <HotkeysContext.Provider value={api}>{children}</HotkeysContext.Provider>;
};
