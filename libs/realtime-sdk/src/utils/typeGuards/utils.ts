export const createTypeGuardCreator =
  <T extends string>() =>
  <R extends T>(values: R | R[] | ReadonlyArray<R>) =>
  (value?: string | null): value is R =>
    !!value && (Array.isArray(values) ? values.includes(value as R) : values === value);

export const createTypedTypeGuardCreator =
  <T extends { type: string } = { type: string }>() =>
  <R extends T>(values: R['type'] | R['type'][] | ReadonlyArray<R['type']>) =>
  (value: T): value is R =>
    Array.isArray(values) ? values.includes(value.type) : value.type === values;
