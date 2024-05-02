import { vi } from 'vitest';

import type { Storage } from './types';

export * as StorageTypes from './types';

export const storage: Storage = (name, getter) => {
  const getItem = getter
    ? vi.fn<[key: string], undefined | string>(getter)
    : vi.fn<[key: string], undefined | string>();
  const setItem = vi.fn<[string, string], undefined>();
  const storage = { getItem, setItem };

  vi.stubGlobal(name, storage);

  return storage;
};
