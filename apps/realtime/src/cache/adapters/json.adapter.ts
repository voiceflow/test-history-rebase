import type { MultiAdapter } from 'bidirectional-adapter';
import { createMultiAdapter } from 'bidirectional-adapter';

export const jsonAdapter = createMultiAdapter<string, any>(
  (json) => {
    let value = null;

    try {
      value = JSON.parse(json) || null;
    } catch {
      // empty
    }

    return value;
  },
  (value) => JSON.stringify(value)
);

export const jsonAdapterFactory = <T>(): MultiAdapter<string, T> => jsonAdapter;
