import React, { useCallback, useEffect, useRef, useState } from 'react';

export enum LifecyclePhase {
  MOUNTING = 'mounting',
  MOUNTED = 'mounted',
  UNMOUNTING = 'unmounting',
}

export const useDidUpdateEffect = (callback: () => void, dependencies: any[] = []) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      // eslint-disable-next-line callback-return
      callback();
    } else {
      didMount.current = true;
    }
  }, dependencies);
};

export const useLifecycle = () => {
  const phase = useRef(LifecyclePhase.MOUNTING);

  useEffect(() => {
    phase.current = LifecyclePhase.MOUNTED;

    return () => {
      phase.current = LifecyclePhase.UNMOUNTING;
    };
  }, []);

  return phase;
};

export const useSetup = (callback: () => void, dependencies: any[] = []) => {
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

export const useTeardown = (callback: () => void, dependencies: any[] = []) => {
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

export const useOnScreen = (ref: React.RefObject<any>) => {
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting));

  useEffect(() => {
    observer.observe(ref?.current);
    // Remove the observer as soon as the component is unmounted
    return () => {
      observer.disconnect();
    };
  }, []);

  return isIntersecting;
};
