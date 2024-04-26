import React from 'react';

import client from '@/client';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';

import type { Response } from './types';
import { mapTestResponse, mapTestResponseError } from './utils';

export const useRequest = (requestObj: Record<string, unknown>) => {
  const [response, setResponse] = React.useState<Response | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;

  const sendRequest = async () => {
    const initTime = Date.now();
    setIsLoading(true);

    try {
      const response = await client.testAPIClient.apiCall(workspaceID, requestObj);
      setResponse(mapTestResponse(response, initTime));
    } catch (error) {
      setResponse(mapTestResponseError(error, initTime));
    } finally {
      setIsLoading(false);
    }
  };

  const cleanRequest = () => {
    setResponse(null);
    setIsLoading(false);
  };

  return { response, sendRequest, cleanRequest, isLoading };
};
