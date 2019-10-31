import hotkeys from 'hotkeys-js';
import { useCallback, useEffect } from 'react';

import HOTKEY_MAPPING from '@/keymap';

// eslint-disable-next-line import/prefer-default-export
export function useHotKeys(key, callback, deps = []) {
  const memoisedCallback = useCallback(callback, deps);

  useEffect(() => {
    const keys = HOTKEY_MAPPING[key];
    const keysStr = Array.isArray(keys) ? keys.join(',') : keys;

    hotkeys(keysStr, memoisedCallback);

    return () => hotkeys.unbind(keysStr, memoisedCallback);
  }, [memoisedCallback]);
}
