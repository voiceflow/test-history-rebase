export * from './expressions';
export * from './node';
export * from './platform';
export * from './workspace';

type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T;

export const truthy = <T>(value: T): value is Truthy<T> => Boolean(value);
