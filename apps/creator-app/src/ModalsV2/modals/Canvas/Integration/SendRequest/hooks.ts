import _isEmpty from 'lodash/isEmpty';
import React from 'react';

import client from '@/client';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import { deepVariableReplacement, deepVariableSearch } from '@/utils/variable';

import { Response } from './types';
import { mapTestResponse, mapTestResponseError } from './utils';

export const useRequestVariables = (formattedData: Record<string, unknown>) => {
  const [variableValues, setVariableValues] = React.useState<Record<string, string>>(
    deepVariableSearch(formattedData).reduce((acc, key) => ({ ...acc, [key]: null }), {})
  );

  const hasVariables = !_isEmpty(variableValues);

  const updateVariableValue = (key: string, value: string) => {
    setVariableValues((currentValues) => ({ ...currentValues, [key]: value }));
  };

  return { variableValues, hasVariables, updateVariableValue };
};

export const useRequest = ({ formattedData, variableValues }: { formattedData: Record<string, unknown>; variableValues: Record<string, string> }) => {
  const [response, setResponse] = React.useState<Response | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;

  const sendRequest = async () => {
    const requestObj = deepVariableReplacement(formattedData, variableValues);
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

export default useRequestVariables;
