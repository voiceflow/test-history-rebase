import Mousetrap from 'mousetrap';
import { useEffect, useMemo } from 'react';

import HOTKEY_MAPPING, { Hotkey } from '@/keymap';

export type Options = null | {
  action?: 'keypress' | 'keydown' | 'keyup';
  preventDefault?: boolean;
};

// eslint-disable-next-line import/prefer-default-export
export function useHotKeys(key: Hotkey, callback: (e: KeyboardEvent) => void | boolean, options: Options = {}, deps: any[] = []) {
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

    Mousetrap.bind(keys, memoisedCallback, action);

    return () => {
      Mousetrap.unbind(keys, action);
    };
  }, [memoisedCallback]);
}
