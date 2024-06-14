import { useContextApi } from '@voiceflow/ui';
import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import type Engine from '@/pages/Canvas/engine';

export type EventualEngineContextType = null | {
  get: () => null | Engine;
  set: (engine: null | Engine) => void;
};

export const EventualEngineContext = React.createContext<EventualEngineContextType>(null);

export const EventualEngineProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const engineRef = React.useRef<Engine | null>(null);

  const get = React.useCallback(() => engineRef.current, []);
  const set = React.useCallback((engine: null | Engine) => {
    engineRef.current = engine;
  }, []);

  const api = useContextApi({ get, set });

  return <EventualEngineContext.Provider value={api}>{children}</EventualEngineContext.Provider>;
};

export interface RegisterEngineProps {
  engine: Engine;
}

export const RegisterEngine: React.FC<RegisterEngineProps> = ({ engine }) => {
  const engineContext = React.useContext(EventualEngineContext)!;

  React.useEffect(() => {
    engineContext.set(engine);

    return () => engineContext.set(null);
  }, [engine]);

  return null;
};

export const withRequiredEngine = <P extends object, T>(Component: React.ComponentType<P & { engine: Engine }>) =>
  setDisplayName(wrapDisplayName(Component, 'withRequiredEventualEngine'))(
    React.forwardRef<T, P>((props, ref) => {
      const eventualEngine = React.useContext(EventualEngineContext);

      const engine = eventualEngine?.get();

      return !engine ? null : <Component {...props} engine={engine} ref={ref} />;
    })
  );
