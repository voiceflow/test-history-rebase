import hotkeys, { KeyHandler } from 'hotkeys-js';
import { useCallback, useEffect } from 'react';

import HOTKEY_MAPPING, { Hotkey } from '@/keymap';

type Options = {
  scope?: string;
  element?: HTMLElement | null;
  keyup?: boolean | null;
  keydown?: boolean | null;
  splitKey?: string;
};

// eslint-disable-next-line import/prefer-default-export
export function useHotKeys(key: Hotkey, callback: KeyHandler, deps: any[] = [], options?: Options) {
  const memoisedCallback = useCallback(callback, deps);

  useEffect(() => {
    const keys = HOTKEY_MAPPING[key];
    const keysStr = Array.isArray(keys) ? keys.join(',') : keys;

    options ? hotkeys(keysStr, options, memoisedCallback) : hotkeys(keysStr, memoisedCallback);

    return () => hotkeys.unbind(keysStr, memoisedCallback);
  }, [memoisedCallback]);
}
