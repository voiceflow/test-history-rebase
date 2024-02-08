import { useCreateConst } from '@voiceflow/ui-next';
import { useEffect, useRef } from 'react';

interface TimerAPI {
  stop: () => void;
  start: (time: number) => void;
  invoke: () => void;
  resetState: (state?: Record<string, any>) => void;
}

interface UseTimer {
  (callback: VoidFunction): TimerAPI;
  <State extends Record<string, any>>(callback: (state: State) => void, state: State): TimerAPI;
}

export const useTimer: UseTimer = (callback: (state: Record<string, any>) => void, state = {}) => {
  const ref = useRef({
    timer: null as number | null,
    state,
    callback,
    unmounted: false,
  });

  ref.current.callback = callback;

  useEffect(() => {
    return () => {
      ref.current.unmounted = true;

      if (ref.current.timer) {
        window.clearTimeout(ref.current.timer);
      }
    };
  }, []);

  return useCreateConst(() => ({
    start: (time: number) => {
      if (ref.current.unmounted) return;

      if (ref.current.timer) {
        window.clearTimeout(ref.current.timer);
      }

      ref.current.timer = window.setTimeout(() => ref.current.callback(ref.current.state), time);
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

      ref.current.callback(ref.current.state);
    },

    resetState: (newState = state) => {
      ref.current.state = newState;
    },
  }));
};
