import actionCreatorFactory from 'typescript-fsa';

export const createAction = actionCreatorFactory();

export const typeFactory =
  (...parts: string[]) =>
  (name: string): string =>
    [...parts, name].join('.');
