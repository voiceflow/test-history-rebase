import { usePersistFunction } from '@voiceflow/ui-next';
import { useEffect, useRef } from 'react';

export const useAsyncEffect = (
  effect: (ref: { unmounted: boolean }) => Promise<void>,
  dependencies: unknown[] = []
): void =>
  useEffect(() => {
    const ref = { unmounted: false };

    effect(ref);

    return () => {
      ref.unmounted = true;
    };
  }, dependencies);

export const useDidUpdateEffect = (callback: () => void | VoidFunction, dependencies: unknown[]): void => {
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;

      return undefined;
    }

    return callback();
  }, dependencies);
};

export const useUnmount = (callback: VoidFunction): void => {
  useEffect(
    usePersistFunction(() => callback),
    []
  );
};
