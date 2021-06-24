import { Action } from '../types';

// eslint-disable-next-line @typescript-eslint/ban-types, import/prefer-default-export
export const createAction = <T extends string, P, M extends object | void>(type: T, payload?: P, meta?: M) =>
  ({
    type,
    ...(payload !== undefined && { payload }),
    ...(meta && { meta }),
  } as Action<T, P, Exclude<M, void>>);
