import { usePersistFunction } from '@voiceflow/ui';
import Mousetrap from 'mousetrap';
import React from 'react';

import HOTKEY_MAPPING, { Hotkey } from '@/keymap';

interface Options {
  action?: 'keypress' | 'keydown' | 'keyup';
  disable?: boolean;
  preventDefault?: boolean;
}

type Callback = (event: KeyboardEvent) => void;

const isHotkey = (key: Hotkey | string): key is Hotkey => key in HOTKEY_MAPPING;

export interface HotkeyItem extends Options {
  hotkey: Hotkey | string;
  callback: Callback;
}

export const useHotkeyList = (hotkeys: HotkeyItem[], deps: unknown[] = []) => {
  React.useEffect(() => {
    if (!hotkeys.length) return undefined;

    let instance: Mousetrap.MousetrapInstance | null;

    const callbackFactory = (callback: Callback, options?: Omit<Options, 'action' | 'disable'>) => (event: KeyboardEvent) => {
      if (options?.preventDefault) {
        event.preventDefault();
      }

      return callback(event);
    };

    hotkeys.forEach(({ action, hotkey, disable, callback, ...options }: HotkeyItem) => {
      if (disable) return;

      const keys = isHotkey(hotkey) ? HOTKEY_MAPPING[hotkey] : hotkey;

      instance ??= new Mousetrap();
      instance.bind(keys, callbackFactory(callback, options), action || 'keydown');
    });

    return () => {
      instance?.reset();
    };
  }, [...deps]);
};

export const useHotkey = (hotkey: Hotkey, callback: Callback, options: Options = {}) => {
  const persistedCallback = usePersistFunction(callback);

  useHotkeyList([{ ...options, hotkey, callback: persistedCallback }], [options?.disable]);
};
