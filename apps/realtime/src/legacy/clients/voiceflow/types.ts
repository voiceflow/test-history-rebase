import type { AxiosInstance, AxiosStatic } from 'axios';

import type { BaseOptions } from '../types';

export interface Options extends BaseOptions {
  axios: AxiosStatic;
}

export interface ExtraOptions extends BaseOptions {
  api: AxiosInstance;
  alexa: AxiosInstance;
  general: AxiosInstance;
}
