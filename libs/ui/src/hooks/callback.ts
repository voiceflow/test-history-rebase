/* eslint-disable default-param-last */
/* eslint-disable lodash/import-scope */
/* eslint-disable you-dont-need-lodash-underscore/throttle */
import { Utils } from '@voiceflow/common';
import type { DebounceSettings, ThrottleSettings } from 'lodash';
import _debounce from 'lodash/debounce';
import _throttle from 'lodash/throttle';
import moize from 'moize';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useTeardown } from './lifecycle';

export const useDebouncedCallback = <C extends (...args: any[]) => any>(delay: number, callback: C, deps: any[] = [], options?: DebounceSettings) => {
  const memo = useMemo(() => _debounce(callback, delay, options), deps);

  useTeardown(() => {
    memo.cancel();
  });

  return memo;
};

export const useThrottledCallback = <C extends (...args: any[]) => any>(delay: number, callback: C, deps: any[] = [], options?: ThrottleSettings) => {
  const memo = useMemo(() => _throttle(callback, delay, options), deps);

  useTeardown(() => {
    memo.cancel();
  });

  return memo;
};

export const useCurried = <S extends any[], D extends any[], R = void>(callback: (...args: S & D) => R, dependencies: any[] = []) => {
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
