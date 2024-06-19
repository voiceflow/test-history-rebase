import React from 'react';

import { RegisterEngine } from '@/contexts/EventualEngineContext';
import type Engine from '@/pages/Canvas/engine';

export const EngineContext = React.createContext<Engine | null>(null);

interface EngineProviderProps extends React.PropsWithChildren {
  engine: Engine;
}

export const EngineProvider: React.FC<EngineProviderProps> = ({ engine, children }) => {
  return (
    <EngineContext.Provider value={engine}>
      <RegisterEngine engine={engine} />
      {children}
    </EngineContext.Provider>
  );
};
