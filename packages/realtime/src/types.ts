import { Context as LoguxContext } from '@logux/server';

export interface Config {
  NODE_ENV: string;
  PORT: number;

  // Deployment information
  CLOUD_ENV: string;
  IS_PRIVATE_CLOUD: boolean;
  CREATOR_API_ENDPOINT: string;
  ALEXA_SERVICE_ENDPOINT: string;
  GOOGLE_SERVICE_ENDPOINT: string;
  DIALOGFLOW_SERVICE_ENDPOINT: string;
  GENERAL_SERVICE_ENDPOINT: string;

  // Release information
  GIT_SHA: string | null;
  BUILD_NUM: string | null;
  SEM_VER: string | null;
  BUILD_URL: string | null;

  // Redis
  REDIS_CLUSTER_HOST: string;
  REDIS_CLUSTER_PORT: number;

  // Logging
  LOG_LEVEL: string | null;
  MIDDLEWARE_VERBOSITY: string | null;
}

export interface BaseContextData {
  creatorID: number;
}

export type Context<D extends BaseContextData = BaseContextData> = LoguxContext<D>;
