export const delay = <T extends any = boolean>(timeout: number, value: T = true as T): Promise<T> =>
  new Promise<T>((resolve) => setTimeout(resolve.bind(null, value), timeout));

export const rejectIn = (timeout: number): Promise<never> =>
  // eslint-disable-next-line promise/param-names
  new Promise<never>((_resolve, reject) => setTimeout(() => reject(new Error('Rejected by timeout!')), timeout));
