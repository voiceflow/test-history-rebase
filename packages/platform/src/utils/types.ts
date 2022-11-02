export const infers =
  <T>() =>
  <U extends T>(t: U): T =>
    t;

export const satisfies =
  <T>() =>
  <U extends T>(t: U): U =>
    t;

export const partialSatisfies =
  <T>() =>
  <U extends Partial<T>>(t: U): U =>
    t;
