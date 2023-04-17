import { Nullable } from '@voiceflow/common';
import React from 'react';

import { LifecyclePhase, useLifecycle } from './lifecycle';

interface RafApi {
  cancel: VoidFunction;
  callback: Nullable<VoidFunction>;
  unmounted: boolean;
  isScheduled: boolean;
  animationFrame: number;
}

export const useRAF = (): [scheduler: (callback: VoidFunction) => void, apiCache: React.MutableRefObject<RafApi>] => {
  const phase = useLifecycle();

  const apiCache = React.useRef<RafApi>({
    cancel: () => {
      apiCache.current.isScheduled = false;
      window.cancelAnimationFrame(apiCache.current.animationFrame);
    },
    callback: null as Nullable<VoidFunction>,
    unmounted: false,
    isScheduled: false,
    animationFrame: 0,
  });

  const scheduler = React.useCallback((callback: VoidFunction) => {
    apiCache.current.callback = callback;

    if (apiCache.current.isScheduled) {
      return;
    }

    apiCache.current.isScheduled = true;

    apiCache.current.animationFrame = window.requestAnimationFrame(() => {
      apiCache.current.isScheduled = false;

      if (phase.current === LifecyclePhase.UNMOUNTING) {
        return;
      }

      apiCache.current.callback?.();
    });
  }, []);

  return [scheduler, apiCache];
};
