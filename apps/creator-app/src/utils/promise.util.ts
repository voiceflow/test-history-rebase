export const controlledPromiseFactory = <T>() => {
  let _reject!: (reason?: any) => void;
  let _resolve!: (value: T | PromiseLike<T>) => void;

  const promise = new Promise<T>((resolve, reject) => {
    _reject = reject;
    _resolve = resolve;
  });

  return Object.assign(promise, { resolve: _resolve, reject: _reject });
};
