export * from './dispatch';
export * from './reducer';

export type RootState<T extends string, S, R = Record<string, any>> = Record<T, S> & R;
