import React from 'react';

import { withContext } from '@/hocs';

export const EventualEngineContext = React.createContext(null);
export const { EventualEngineConsumer: Consumer } = EventualEngineContext;

export const EventualEngineProvider = ({ children }) => {
  const engineRef = React.useRef(null);

  const get = React.useCallback(() => engineRef.current, []);
  const set = React.useCallback((engine) => {
    engineRef.current = engine;
  }, []);

  return <EventualEngineContext.Provider value={{ get, set }}>{children}</EventualEngineContext.Provider>;
};

export const RegisterEngine = ({ engine }) => {
  const engineContext = React.useContext(EventualEngineContext);

  React.useEffect(() => {
    engineContext.set(engine);

    return () => engineContext.set(null);
  }, [engine]);

  return null;
};

export const withEventualEngine = withContext(EventualEngineContext, 'eventualEngine');
