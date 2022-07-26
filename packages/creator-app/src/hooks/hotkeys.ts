import Mousetrap from 'mousetrap';
import { useEffect, useMemo } from 'react';

import HOTKEY_MAPPING, { Hotkey } from '@/keymap';

export type Options = null | {
  action?: 'keypress' | 'keydown' | 'keyup';
  disable?: boolean;
  preventDefault?: boolean;
  skipDefaultPrevented?: boolean;
};

type Callback = (event: KeyboardEvent) => void;

export function useHotKeys(key: Hotkey, callback: Callback, options: Options = {}, deps: any[] = []) {
  const memoisedCallback = useMemo(
    () => (event: KeyboardEvent) => {
      if (options?.disable || (options?.skipDefaultPrevented && event.defaultPrevented)) return false;

      if (!options?.preventDefault) {
        return callback(event);
      }

      event.preventDefault();
      callback(event);

      return false;
    },
    [...deps, options?.disable]
  );

  useEffect(() => {
    if (options?.disable) return undefined;

    const action = options?.action || 'keydown';
    const keys = HOTKEY_MAPPING[key];

    const instance = new Mousetrap();
    instance.bind(keys, memoisedCallback, action);
    return () => {
      instance.reset();
    };
  }, [memoisedCallback, options?.disable]);
}
