import { BaseClientOptions } from '@voiceflow/socket-utils';
import { AxiosInstance, AxiosStatic } from 'axios';

import { Config } from '../types';

export type BaseOptions = BaseClientOptions<Config>;

export interface Options extends BaseOptions {
  axios: AxiosStatic;
}

export interface ExtraOptions extends BaseOptions {
  api: AxiosInstance;
}
