import React from 'react';

import { Nullable } from '@/types';

import { useCache } from './cache';
import { LifecyclePhase, useLifecycle } from './lifecycle';

export const useRAF = () => {
  const phase = useLifecycle();
  const cache = useCache({ unmounted: false, isScheduled: false, callback: null as Nullable<() => void> }, {});

  const scheduler = React.useCallback((callback: () => void) => {
    cache.current.callback = callback;

    if (cache.current.isScheduled) {
      return;
    }

    cache.current.isScheduled = true;

    window.requestAnimationFrame(() => {
      cache.current.isScheduled = false;

      if (phase.current === LifecyclePhase.UNMOUNTING) {
        return;
      }

      cache.current.callback!();
    });
  }, []);

  return [scheduler, cache] as const;
};
