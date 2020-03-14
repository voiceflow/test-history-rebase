import React from 'react';

import { withContext } from '@/hocs';

export type EventualEngineContextType = null | {
  get: () => any;
  set: (engine: any) => void;
};

export const EventualEngineContext = React.createContext<EventualEngineContextType>(null);
export const { Consumer: EventualEngineConsumer } = EventualEngineContext;

export const EventualEngineProvider: React.FC = ({ children }) => {
  const engineRef = React.useRef(null);

  const get = React.useCallback(() => engineRef.current, []);
  const set = React.useCallback((engine) => {
    engineRef.current = engine;
  }, []);

  return <EventualEngineContext.Provider value={{ get, set }}>{children}</EventualEngineContext.Provider>;
};

export type RegisterEngineProps = {
  engine: any;
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
