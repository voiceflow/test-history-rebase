import { useHotkeys } from 'react-hotkeys-hook';

import HOTKEY_MAPPING from '@/keymap';

// eslint-disable-next-line import/prefer-default-export
export const useHotKeys = (key, callback, deps) => {
  const keys = HOTKEY_MAPPING[key];

  return useHotkeys(Array.isArray(keys) ? keys.join(',') : keys, callback, deps);
};
