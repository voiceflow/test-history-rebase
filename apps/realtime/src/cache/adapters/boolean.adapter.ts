import { createMultiAdapter } from 'bidirectional-adapter';

export const booleanAdapter = createMultiAdapter<string, boolean>(
  (value) => Boolean(Number(value)),
  (value) => String(Number(value))
);
