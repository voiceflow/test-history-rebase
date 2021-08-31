import * as Realtime from '@voiceflow/realtime-sdk';

export const booleanAdapter = Realtime.Adapters.createAdapter<string, boolean>(
  (value) => Boolean(Number(value)),
  (value) => String(Number(value))
);

export const jsonAdapter = Realtime.Adapters.createAdapter<string, any>(
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

export const jsonAdapterCreator = <T>(): Realtime.Adapters.BidirectionalMultiAdapter<string, T, [], []> => jsonAdapter;
