import { Utils } from '@voiceflow/common';
import React from 'react';

export const AutoPanningSetContext = React.createContext<(value: boolean) => void>(Utils.functional.noop);
export const AutoPanningStateContext = React.createContext<boolean>(false);
export const AutoPanningCacheContext = React.createContext<React.MutableRefObject<boolean>>({ current: false });

export const AutoPanningProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isPanning, localSetIsPanning] = React.useState(false);
  const cache = React.useRef(isPanning);

  const setIsPanning = React.useCallback((value: boolean) => {
    if (cache.current === value) return;

    cache.current = value;
    localSetIsPanning(value);
  }, []);

  return (
    <AutoPanningSetContext.Provider value={setIsPanning}>
      <AutoPanningStateContext.Provider value={isPanning}>
        <AutoPanningCacheContext.Provider value={cache}>{children}</AutoPanningCacheContext.Provider>
      </AutoPanningStateContext.Provider>
    </AutoPanningSetContext.Provider>
  );
};
