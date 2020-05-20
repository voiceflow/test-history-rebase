import React from 'react';

import { withContext } from '@/hocs';
import type { Engine } from '@/pages/Canvas/engine';

export type EventualEngineContextType = null | {
  get: () => null | Engine;
  set: (engine: null | Engine) => void;
};

export const EventualEngineContext = React.createContext<EventualEngineContextType>(null);
export const { Consumer: EventualEngineConsumer } = EventualEngineContext;

export const EventualEngineProvider: React.FC = ({ children }) => {
  const engineRef = React.useRef<Engine | null>(null);

  const get = React.useCallback(() => engineRef.current, []);
  const set = React.useCallback((engine: null | Engine) => {
    engineRef.current = engine;
  }, []);

  return <EventualEngineContext.Provider value={{ get, set }}>{children}</EventualEngineContext.Provider>;
};

export type RegisterEngineProps = {
  engine: Engine;
};

export const RegisterEngine: React.FC<RegisterEngineProps> = ({ engine }) => {
  const engineContext = React.useContext(EventualEngineContext)!;

  React.useEffect(() => {
    engineContext.set(engine);

    return () => engineContext.set(null);
  }, [engine]);

  return null;
};

export const withEventualEngine = withContext(EventualEngineContext, 'eventualEngine');
