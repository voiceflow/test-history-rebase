export interface Config {
  NODE_ENV: string;
  PORT: number;

  // Deployment information
  CLOUD_ENV: string;
  IS_PRIVATE_CLOUD: boolean;
  CREATOR_API_ENDPOINT: string;
  BILLING_API_ENDPOINT: string;
  AUTH_API_ENDPOINT: string;
  ANALYTICS_API_ENDPOINT: string;

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

  // Google
  FIRESTORE_MODEL_COLLECTION: string | null;
  PUBSUB_PROJECT_KEY: string | null;

  // OpenAI
  OPENAI_API_KEY: string;
  OPENAI_ORG_ID: string;
}
