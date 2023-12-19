import { usePersistFunction } from '@voiceflow/ui';
import Mousetrap from 'mousetrap';
import React from 'react';

import HOTKEY_MAPPING, { Hotkey } from '@/keymap';

interface Options {
  action?: 'keypress' | 'keydown' | 'keyup';
  disable?: boolean;
  allowInputs?: boolean;
  preventDefault?: boolean;
}

type Callback = (event: KeyboardEvent) => void;

const isHotkey = (key: Hotkey | string): key is Hotkey => key in HOTKEY_MAPPING;

export interface HotkeyItem extends Options {
  hotkey: Hotkey | string;
  callback: Callback;
}

export const useHotkeyList = (hotkeys: HotkeyItem[], deps: unknown[] = []) => {
  // eslint-disable-next-line sonarjs/cognitive-complexity
  React.useEffect(() => {
    if (!hotkeys.length) return undefined;

    let instance: Mousetrap.MousetrapInstance | null = null;

    const callbackFactory = (callback: Callback, options?: Omit<Options, 'action' | 'disable'>) => (event: KeyboardEvent) => {
      if (options?.preventDefault) {
        event.preventDefault();
      }

      return callback(event);
    };
    const hotkeyOptionMap: Record<string, Omit<Options, 'action' | 'disable'>> = {};

    for (const { action, hotkey, disable, callback, ...options } of hotkeys) {
      if (disable) continue;

      const keys = isHotkey(hotkey) ? HOTKEY_MAPPING[hotkey] : hotkey;

      instance ??= new Mousetrap();
      instance.bind(keys, callbackFactory(callback, options), action || 'keydown');

      Object.assign(hotkeyOptionMap, Object.fromEntries((Array.isArray(keys) ? keys : [keys]).map((key) => [key, options])));
    }

    if (instance) {
      const { stopCallback } = instance;

      instance.stopCallback = (event, element, combo) => {
        const hotkeyOptions = hotkeyOptionMap[combo];

        if (hotkeyOptions?.allowInputs) {
          return false;
        }

        if (element.getAttribute('contenteditable') === 'true' || element.closest('[contenteditable="true"]')) {
          return true;
        }

        return stopCallback.call(instance, event, element, combo);
      };
    }

    return () => {
      if (instance) {
        instance.stopCallback = () => true;
        instance.reset();
      }

      instance = null;
    };
  }, [...deps]);
};

export const useHotkey = (hotkey: Hotkey, callback: Callback, options: Options = {}) => {
  const persistedCallback = usePersistFunction(callback);

  useHotkeyList([{ ...options, hotkey, callback: persistedCallback }], [options?.disable, options.allowInputs]);
};
