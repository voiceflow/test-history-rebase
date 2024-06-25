export type Transform<T = any, R = T> = (value: T) => R;

export interface Compose {
  <R, T1>(t0: Transform<T1, R>): (value: T1) => R;
  <R, T1, T2>(t0: Transform<T1, T2>, t1: Transform<T2, R>): (value: T1) => R;
  <R, T1, T2, T3>(t0: Transform<T1, T2>, t1: Transform<T2, T3>, t2: Transform<T3, R>): (value: T1) => R;
  <R, T1, T2, T3, T4>(
    t0: Transform<T1, T2>,
    t1: Transform<T2, T3>,
    t2: Transform<T3, T4>,
    t3: Transform<T4, R>
  ): (value: T1) => R;
  <R, T1, T2, T3, T4, T5>(
    t0: Transform<T1, T2>,
    t1: Transform<T2, T3>,
    t2: Transform<T3, T4>,
    t3: Transform<T4, T5>,
    t4: Transform<T5, R>
  ): (value: T1) => R;
  <R, T1, T2, T3, T4, T5, T6>(
    t0: Transform<T1, T2>,
    t1: Transform<T2, T3>,
    t2: Transform<T3, T4>,
    t3: Transform<T4, T5>,
    t4: Transform<T5, T6>,
    t5: Transform<T6, R>
  ): (value: T1) => R;
  (...transforms: Transform[]): <T extends object>(value: T) => T;
}

export const compose: Compose =
  (...transforms: Transform[]) =>
  <T extends object>(value: T): T =>
    [...transforms].reverse().reduce((acc, transform) => transform(acc), value);
