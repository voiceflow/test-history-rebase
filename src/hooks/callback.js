import _debounce from 'lodash/debounce';
import _throttle from 'lodash/throttle';
import { useMemo } from 'react';

export const useDebouncedCallback = (delay, callback, deps = [], options) => useMemo(() => _debounce(callback, delay, options), deps);

export const useThrottledCallback = (delay, callback, deps = [], options) => useMemo(() => _throttle(callback, delay, options), deps);
