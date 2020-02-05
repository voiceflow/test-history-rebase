import _debounce from 'lodash/debounce';
import _throttle from 'lodash/throttle';
import moize from 'moize';
import { useMemo } from 'react';

export const useDebouncedCallback = (delay, callback, deps = [], options) => useMemo(() => _debounce(callback, delay, options), deps);

export const useThrottledCallback = (delay, callback, deps = [], options) => useMemo(() => _throttle(callback, delay, options), deps);

export const useCurried = (callback, dependencies = []) =>
  useMemo(() => moize((...staticArgs) => (...dynamicArgs) => callback(...staticArgs, ...dynamicArgs)), [callback, ...dependencies]);
