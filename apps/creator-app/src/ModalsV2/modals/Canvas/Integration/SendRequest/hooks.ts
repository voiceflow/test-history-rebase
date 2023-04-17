import _isEmpty from 'lodash/isEmpty';
import React from 'react';

import client from '@/client';

import { Response } from './types';
import { deepVariableReplacement, deepVariableSearch, mapTestResponse, mapTestResponseError } from './utils';

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

const TEST_API_ENDPOINT = '/test/api';

export const useRequest = ({ formattedData, variableValues }: { formattedData: Record<string, unknown>; variableValues: Record<string, string> }) => {
  const [response, setResponse] = React.useState<Response | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const sendRequest = async () => {
    const requestObj = deepVariableReplacement(formattedData, variableValues);
    const initTime = Date.now();
    setIsLoading(true);

    try {
      const response = await client.testAPIClient.post(TEST_API_ENDPOINT, { api: requestObj });
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
