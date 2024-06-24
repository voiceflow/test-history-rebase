import { usePersistFunction } from '@voiceflow/ui-next';
import React from 'react';

type AnyAsyncFunction = (...args: any[]) => Promise<any>;

type PromiseResult<T extends AnyAsyncFunction> = T extends (...args: any[]) => Promise<infer R> ? R : never;

export const useHttp = <Callback extends AnyAsyncFunction>(callback: Callback) => {
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
      if (error instanceof Error) setError(true);
    } finally {
      setLoading(false);
    }
  });

  return { data, error, loading, fetch, refetch: fetch };
};

export const useHttpQuery = <Callback extends AnyAsyncFunction>(callback: Callback, ...args: Parameters<Callback>) => {
  const httpAPI = useHttp(callback);

  React.useEffect(() => {
    httpAPI.fetch(...args);
  }, []);

  return httpAPI;
};
