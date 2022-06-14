import axios from 'axios';
import React from 'react';

import { TEST_API_ENDPOINT } from '../constants';
import { CustomAPITestResponse } from '../types';
import { deepVariableReplacement, mapTestResponse, mapTestResponseError } from '../utils';

interface UseRequestProps {
  formattedData: any;
  variableValues: Record<string, string>;
}

const useRequest = ({ variableValues, formattedData }: UseRequestProps) => {
  const [response, setResponse] = React.useState<CustomAPITestResponse | null>(null);
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
