import type { AxiosResponse } from 'axios';
import pretty from 'prettysize';

import type { Response, ResponseMetadata } from '../types';

export const getResponseMetadata = ({
  response,
  initTime,
}: {
  response?: AxiosResponse<any, any>;
  initTime: number;
}): ResponseMetadata => {
  const successResponse = response?.status && response?.status < 400;

  return {
    time: Date.now() - initTime,
    size: pretty(JSON.stringify(response).length * 7),
    isError: !successResponse,
  };
};

export const getResponseHeaders = (response: AxiosResponse<any, any>) => {
  return Object.keys(response.headers).map((headerKey) => ({ key: headerKey, val: response.headers[headerKey] || '' }));
};

export const mapTestResponse = (response: AxiosResponse<any, any>, initTime: number): Response => ({
  statusCode: response.status,
  statusText: response.statusText,
  body: JSON.stringify(response.data, null, ' '),
  headers: getResponseHeaders(response),
  metadata: getResponseMetadata({ initTime, response }),
});

export const mapTestResponseError = (error: any, initTime: number): Response => {
  if (!error.response || !error.isAxiosError) {
    return {
      statusCode: 500,
      statusText: 'Server Error',
      body: JSON.stringify({ error: error.message }, null, ' '),
      headers: [],
      metadata: {
        time: Date.now() - initTime,
        size: '0',
        isError: true,
      },
    };
  }

  const { response } = error;

  return {
    statusCode: response.data?.statusCode || response.status || response.data.code,
    statusText: response.data?.description || response.statusText || response.data.status || 'Server Error',
    body: JSON.stringify(response?.data || {}, null, ' '),
    headers: getResponseHeaders(response),
    metadata: getResponseMetadata({ initTime, response: response?.data }),
  };
};
