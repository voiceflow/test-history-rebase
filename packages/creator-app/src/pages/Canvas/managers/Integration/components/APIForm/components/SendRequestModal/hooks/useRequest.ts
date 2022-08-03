import axios from 'axios';
import React from 'react';

import { Response } from '../types';
import { deepVariableReplacement, mapTestResponse, mapTestResponseError } from '../utils';

const TEST_API_ENDPOINT = '/test/api';

interface UseRequestProps {
  formattedData: any;
  variableValues: Record<string, string>;
}

const useRequest = ({ variableValues, formattedData }: UseRequestProps) => {
  const [response, setResponse] = React.useState<Response | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const sendRequest = async () => {
    const requestObj = deepVariableReplacement(formattedData, variableValues);
    const initTime = Date.now();
    setIsLoading(true);

    try {
      const response = await axios.post(TEST_API_ENDPOINT, { api: requestObj });
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

export default useRequest;
