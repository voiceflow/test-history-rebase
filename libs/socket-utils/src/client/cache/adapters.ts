import type { MultiAdapter } from 'bidirectional-adapter';
import { createMultiAdapter } from 'bidirectional-adapter';

export const booleanAdapter = createMultiAdapter<string, boolean>(
  (value) => Boolean(Number(value)),
  (value) => String(Number(value))
);

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

export const jsonAdapterCreator = <T>(): MultiAdapter<string, T> => jsonAdapter;
