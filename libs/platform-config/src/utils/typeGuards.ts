export const isValueFactory =
  <Value>(type: Value) =>
  (value?: unknown): value is Value =>
    value === type;
