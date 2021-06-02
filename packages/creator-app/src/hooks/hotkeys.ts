import Mousetrap from 'mousetrap';
import { useEffect, useMemo } from 'react';

import HOTKEY_MAPPING, { Hotkey } from '@/keymap';

export type Options = null | {
  action?: 'keypress' | 'keydown' | 'keyup';
  preventDefault?: boolean;
  disable?: boolean;
};

type Callback = (e: KeyboardEvent) => void;

// eslint-disable-next-line import/prefer-default-export
export function useHotKeys(key: Hotkey, callback: Callback, options: Options = {}, deps: any[] = []) {
  const memoisedCallback = useMemo(
    () => (e: KeyboardEvent) => {
      if (options?.disable) return false;

      if (!options?.preventDefault) {
        return callback(e);
      }

      e.preventDefault();
      callback(e);

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
