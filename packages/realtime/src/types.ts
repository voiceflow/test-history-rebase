import type Server from './server';

export interface Plugin {
  (server: Server): void;
}

export interface Config {
  NODE_ENV: string;
  PORT: number;

  // Deployment information
  CLOUD_ENV: string;
  IS_PRIVATE_CLOUD: boolean;
  CREATOR_API_ENDPOINT: string;

  // Application secrets
  PLATFORM_KEY: string;
  CONFIG_CLIENT_ID: string;
  CONFIG_CLIENT_SECRET: string;
  SEGMENT_WRITE_KEY: string;

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
