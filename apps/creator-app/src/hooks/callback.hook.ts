import { useCreateConst, usePersistFunction } from '@voiceflow/ui-next';
import type { DebounceSettings, ThrottleSettings } from 'lodash';
import _debounce from 'lodash/debounce';
import _throttle from 'lodash/throttle';
import { useEffect } from 'react';

export const useDebouncedCallback = <C extends (...args: any[]) => any>(
  delay: number,
  callback: C,
  options?: DebounceSettings
) => {
  const persistedCallback = usePersistFunction(callback);
  const debounced = useCreateConst(() => _debounce(persistedCallback, delay, options));

  useEffect(() => () => debounced.cancel(), []);

  return debounced;
};

export const useThrottledCallback = <C extends (...args: any[]) => any>(
  delay: number,
  callback: C,

  options?: ThrottleSettings
) => {
  const persistedCallback = usePersistFunction(callback);
  const throttled = useCreateConst(() => _throttle(persistedCallback, delay, options));

  useEffect(() => () => throttled.cancel(), []);

  return throttled;
};
