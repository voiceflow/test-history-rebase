import type { DebounceSettings, ThrottleSettings } from 'lodash';
import _debounce from 'lodash/debounce';
import _throttle from 'lodash/throttle';
import moize from 'moize';
import { useEffect, useMemo } from 'react';

import { Callback } from '@/types';

export const useDebouncedCallback = <C extends (...args: any[]) => any>(delay: number, callback: C, deps: any[] = [], options?: DebounceSettings) =>
  useMemo(() => _debounce(callback, delay, options), deps);

export const useThrottledCallback = <C extends (...args: any[]) => any>(delay: number, callback: C, deps: any[] = [], options?: ThrottleSettings) =>
  useMemo(() => _throttle(callback, delay, options), deps);

export const useCurried = <S extends any[], D extends any[], R extends any = void>(callback: (...args: S & D) => R, dependencies: any[] = []) =>
  useMemo(
    () =>
      moize((...staticArgs: S) => (...dynamicArgs: D) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        callback(...staticArgs, ...dynamicArgs)
      ),
    [callback, ...dependencies]
  );

export const useInterval = (callback: Callback, timeout: number, dependencies: any[] = []) =>
  useEffect(() => {
    const interval = setInterval(callback, timeout);

    return () => clearInterval(interval);
  }, dependencies);
