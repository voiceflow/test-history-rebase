import { BidirectionalMultiAdapter, createAdapter } from 'bidirectional-adapter';

export const booleanAdapter = createAdapter<string, boolean>(
  (value) => Boolean(Number(value)),
  (value) => String(Number(value))
);

export const jsonAdapter = createAdapter<string, any>(
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

export const jsonAdapterCreator = <T>(): BidirectionalMultiAdapter<string, T, [], []> => jsonAdapter;
