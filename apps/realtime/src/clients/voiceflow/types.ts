import { AxiosInstance, AxiosStatic } from 'axios';

import { BaseOptions } from '../types';

export interface Options extends BaseOptions {
  axios: AxiosStatic;
}

export interface ExtraOptions extends BaseOptions {
  api: AxiosInstance;
  alexa: AxiosInstance;
  google: AxiosInstance;
  dialogflow: AxiosInstance;
  general: AxiosInstance;
}
