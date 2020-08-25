// eslint-disable-next-line import/prefer-default-export
export const delay = <T extends any = boolean>(timeout: number, value: T = true as T) =>
  new Promise<T>((resolve) => setTimeout(resolve.bind(null, value), timeout));
