import { Utils } from '@voiceflow/common';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useCreateConst } from './cache';

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

export const useOnScreen = <T extends Element>(ref: React.RefObject<T>, initialState = false): boolean => {
  const [isIntersecting, setIntersecting] = useState(initialState);

  const observer = useCreateConst(() => new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting)));

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return Utils.functional.noop;
    }

    observer.observe(element);

    return () => observer.unobserve(element);
  }, [ref.current]);

  useTeardown(() => observer.disconnect());

  return isIntersecting;
};
