export const infers =
  <T>() =>
  <U extends T>(t: U): T =>
    t;

interface Satisfies {
  <T extends keyof any>(): <U extends T>(t: U[]) => U[];
  <T>(): <U extends T>(t: U) => U;
}

export const satisfies: Satisfies = () => (t: any) => t;

export const partialSatisfies =
  <T>() =>
  <U extends Partial<T>>(t: U): U =>
    t;
