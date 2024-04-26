import { Utils } from '@voiceflow/common';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useCreateConst, usePersistFunction } from './cache';

export enum LifecyclePhase {
  MOUNTING = 'mounting',
  MOUNTED = 'mounted',
  UNMOUNTING = 'unmounting',
}

export const useDidUpdateEffect = (callback: () => void | VoidFunction, dependencies: unknown[] = []): void => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      return callback();
    }

    didMount.current = true;

    return undefined;
  }, dependencies);
};

export const useLifecycle = (): React.RefObject<LifecyclePhase> => {
  const phase = useRef(LifecyclePhase.MOUNTING);

  useEffect(() => {
    phase.current = LifecyclePhase.MOUNTED;

    return () => {
      phase.current = LifecyclePhase.UNMOUNTING;
    };
  }, []);

  return phase;
};

export const useSetup = (callback: () => void, dependencies: unknown[] = []): void => {
  const phase = useLifecycle();
  // this must be determined outside of the useEffect()
  const isMounting = phase.current === LifecyclePhase.MOUNTING;
  const memoizedCallback = useCallback(callback, dependencies);

  useEffect(() => {
    if (isMounting) {
      memoizedCallback();
    }
  }, [memoizedCallback, isMounting]);
};

export const useTeardown = (callback: () => void, dependencies: unknown[] = []): void => {
  const phase = useLifecycle();
  const memoizedCallback = useCallback(callback, dependencies);

  useEffect(
    () => () => {
      // this must be determined inside of the useEffect()
      const isUnmounting = phase.current === LifecyclePhase.UNMOUNTING;

      if (isUnmounting) {
        memoizedCallback();
      }
    },
    [memoizedCallback]
  );
};

interface OnScreenCallbackOptions {
  disabled?: boolean;
}

export const useOnScreenCallback = <T extends Element>(
  ref: React.RefObject<T>,
  callback: (entry: IntersectionObserverEntry) => void,
  { disabled = false }: OnScreenCallbackOptions = {}
) => {
  const persistedCallback = usePersistFunction(callback);

  const observer = useCreateConst(() => new IntersectionObserver(([entry]) => persistedCallback(entry)));

  useEffect(() => {
    const element = ref.current;

    if (!element || disabled) return Utils.functional.noop;

    observer.observe(element);

    return () => observer.unobserve(element);
  }, [ref.current, disabled]);

  useTeardown(() => observer.disconnect());
};

interface OnScreenOptions extends OnScreenCallbackOptions {
  initialState?: boolean;
}

export const useOnScreen = <T extends Element>(
  ref: React.RefObject<T>,
  { initialState = false, ...options }: OnScreenOptions = {}
): boolean => {
  const [isIntersecting, setIntersecting] = useState(initialState);

  useOnScreenCallback(ref, (entry) => setIntersecting(entry.isIntersecting), options);

  return isIntersecting;
};
