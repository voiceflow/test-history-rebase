import { Utils } from '@voiceflow/common';
// eslint-disable-next-line lodash/import-scope
import type { DebounceSettings, ThrottleSettings } from 'lodash';
import _debounce from 'lodash/debounce';
import _throttle from 'lodash/throttle';
import moize from 'moize';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useTeardown } from './lifecycle';

/**
 * @deprecated import from @voiceflow/ui instead
 */
export const useDebouncedCallback = <C extends (...args: any[]) => any>(delay: number, callback: C, deps: any[] = [], options?: DebounceSettings) => {
  const debounced = useMemo(() => _debounce(callback, delay, options), deps);

  useTeardown(() => {
    debounced.cancel();
  });

  return debounced;
};

/**
 * @deprecated import from @voiceflow/ui instead
 */
export const useThrottledCallback = <C extends (...args: any[]) => any>(delay: number, callback: C, deps: any[] = [], options?: ThrottleSettings) => {
  const memo = useMemo(() => _throttle(callback, delay, options), deps);

  useTeardown(() => {
    memo.cancel();
  });

  return memo;
};

export const useCurried = <S extends any[], D extends any[], R extends any = void>(callback: (...args: S & D) => R, dependencies: any[] = []) => {
  const moized = useMemo(
    () =>
      moize(
        (...staticArgs: S) =>
          (...dynamicArgs: D) =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            callback(...staticArgs, ...dynamicArgs)
      ),
    [callback, ...dependencies]
  );

  useEffect(() => moized.clear, [moized]);

  return moized;
};

export const useCancellable = <T extends any[]>(effect: (...args: T) => () => void, dependencies: any[] = []): [(...args: T) => void, () => void] => {
  const teardownHandler = useRef(Utils.functional.noop);

  const callback = useCallback((...args: T) => {
    const handler = effect(...args);

    teardownHandler.current = () => {
      handler();
      teardownHandler.current = Utils.functional.noop;
    };
  }, dependencies);

  const teardown = useCallback(() => teardownHandler.current?.(), []);

  useTeardown(teardown);

  return [callback, teardown];
};
