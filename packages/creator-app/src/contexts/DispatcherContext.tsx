import { useConst, useCreateConst } from '@voiceflow/ui';
import { createNanoEvents, EventsMap } from 'nanoevents';
import React from 'react';

export interface DispatcherContextValue<E extends EventsMap> {
  useSubscription: <K extends keyof E>(event: K, cb: E[K], dependencies?: any[]) => void;
  emit: <K extends keyof E>(event: K, ...args: Parameters<E[K]>) => void;
}

export const createDispatcherContext = <E extends EventsMap>() => {
  const Context = React.createContext<DispatcherContextValue<E> | null>(null);

  const Dispatcher: React.FC<React.PropsWithChildren> = ({ children }) => {
    const emitter = useCreateConst(() => createNanoEvents<E>());

    const api = useConst<DispatcherContextValue<E>>({
      useSubscription: (event, cb, dependencies = []) => React.useEffect(() => emitter.on(event, cb), dependencies),
      emit: (event, ...args) => emitter.emit(event, ...args),
    });

    return <Context.Provider value={api}>{children}</Context.Provider>;
  };

  return {
    Context,
    Dispatcher,
  };
};
