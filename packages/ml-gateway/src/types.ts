export interface Config {
  NODE_ENV: string;
  PORT: number;

  // Deployment information
  CLOUD_ENV: string;
  IS_PRIVATE_CLOUD: boolean;

  // Release information
  GIT_SHA: string | null;
  BUILD_NUM: string | null;
  SEM_VER: string | null;
  BUILD_URL: string | null;

  // Redis
  REDIS_CLUSTER_HOST: string;
  REDIS_CLUSTER_PORT: number;

  // Logux
  LOGUX_ACTION_CHANNEL: string;

  // Logging
  LOG_LEVEL: string | null;
  MIDDLEWARE_VERBOSITY: string | null;
}
