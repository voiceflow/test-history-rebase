import { useCreateConst, usePersistFunction } from '@voiceflow/ui-next';
import { useEffect, useRef } from 'react';

interface TimerAPI {
  stop: () => void;
  start: (time: number) => void;
  invoke: () => void;
  resetState: (state?: Record<string, any>) => void;
}

interface UseTimer {
  (callback: (data: { unmounted: boolean }) => void): TimerAPI;
  <State extends Record<string, any>>(
    callback: (data: { state: State; unmounted: boolean }) => void,
    state: State
  ): TimerAPI;
}

export const useTimer: UseTimer = (
  callback: (data: { state: Record<string, any>; unmounted: boolean }) => void,
  state = {}
) => {
  const ref = useRef({
    timer: null as number | null,
    state,
    started: false,
    callback,
    unmounted: false,
    initialState: state,
  });

  ref.current.callback = callback;
  ref.current.initialState = state;

  useEffect(
    () => () => {
      ref.current.unmounted = true;

      if (ref.current.timer) {
        window.clearTimeout(ref.current.timer);
      }
    },
    []
  );

  return useCreateConst(() => ({
    start: (time: number) => {
      if (ref.current.unmounted) return;

      if (ref.current.timer) {
        window.clearTimeout(ref.current.timer);
      }

      ref.current.timer = window.setTimeout(
        () => ref.current.callback({ state: ref.current.state, unmounted: ref.current.unmounted }),
        time
      );
    },

    stop: () => {
      if (ref.current.timer) {
        window.clearTimeout(ref.current.timer);
      }
    },

    invoke: () => {
      if (!ref.current.callback) {
        throw new Error('Callback is not defined');
      }

      ref.current.callback({ state: ref.current.state, unmounted: ref.current.unmounted });
    },

    resetState: (newState = ref.current.initialState) => {
      ref.current.state = newState;
    },
  }));
};

export const usePolling = <Deps extends any[]>(
  options: { time: number; callback: VoidFunction; shouldLoad?: (deps: Deps) => boolean },
  dependencies: Deps
) => {
  const persistedCallback = usePersistFunction(options.callback);

  useEffect(() => {
    if (options.shouldLoad && !options.shouldLoad(dependencies)) return undefined;
    let counterID = 0;

    const load = async () => {
      counterID = window.setTimeout(async () => {
        await persistedCallback();
        load();
      }, options.time);
    };

    load();
    return () => window.clearTimeout(counterID);
  }, dependencies);
};
