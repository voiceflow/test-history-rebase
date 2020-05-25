import Mousetrap from 'mousetrap';
import { useEffect, useMemo } from 'react';

import HOTKEY_MAPPING, { Hotkey } from '@/keymap';

export type Options = null | {
  action?: 'keypress' | 'keydown' | 'keyup';
  preventDefault?: boolean;
};

type Callback = (e: KeyboardEvent) => void | boolean | Promise<void>;

// eslint-disable-next-line import/prefer-default-export
export function useHotKeys(key: Hotkey, callback: Callback, options: Options = {}, deps: any[] = []) {
  const memoisedCallback = useMemo(
    () => (e: KeyboardEvent) => {
      if (!options?.preventDefault) {
        return callback(e);
      }

      e.preventDefault();
      callback(e);

      return false;
    },
    deps
  );

  useEffect(() => {
    const action = options?.action || 'keydown';
    const keys = HOTKEY_MAPPING[key];

    const instance = new Mousetrap();

    instance.bind(keys, memoisedCallback, action);

    return () => {
      instance.reset();
    };
  }, [memoisedCallback]);
}
