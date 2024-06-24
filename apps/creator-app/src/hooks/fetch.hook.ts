import { usePersistFunction } from '@voiceflow/ui-next';
import React from 'react';

type AnyAsyncFunction = (...args: any[]) => Promise<any>;

type PromiseResult<T extends AnyAsyncFunction> = T extends (...args: any[]) => Promise<infer R> ? R : never;

export const useFetch = <Callback extends AnyAsyncFunction>(callback: Callback) => {
  const [data, setData] = React.useState<PromiseResult<Callback> | null>(null);
  const [error, setError] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const fetch = usePersistFunction(async (...localArgs: Parameters<Callback>) => {
    try {
      setError(false);
      setLoading(true);
      // eslint-disable-next-line callback-return
      const response = await callback(...localArgs);
      setData(response);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  });

  return { data, error, loading, fetch };
};

export const useFetchQuery = <Callback extends AnyAsyncFunction>(callback: Callback, ...args: Parameters<Callback>) => {
  const httpAPI = useFetch(callback);

  React.useEffect(() => {
    httpAPI.fetch(...args);
  }, []);

  return httpAPI;
};
