import { Utils } from '@voiceflow/common';
import React, { useEffect } from 'react';

import { usePersistFunction } from './cache';
import { useTeardown } from './lifecycle';

interface IntersectionObserverOptions extends IntersectionObserverInit {
  disabled?: boolean;
}

export const useIntersectionObserver = <T extends Element>(
  ref: React.RefObject<T> | T | null,
  callback: IntersectionObserverCallback,
  { root, disabled = false, ...initOptions }: IntersectionObserverOptions = {}
) => {
  const persistedCallback = usePersistFunction(callback);
  const observer = React.useMemo(() => new IntersectionObserver(persistedCallback, { root, ...initOptions }), [root]);

  const element = ref && 'current' in ref ? ref.current : ref;

  useEffect(() => {
    if (!element || disabled) return Utils.functional.noop;

    observer.observe(element);

    return () => observer.unobserve(element);
  }, [element, disabled]);

  useTeardown(() => observer.disconnect());
};
