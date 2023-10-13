import { EnvironmentVariables } from './app.env';

export type Config = EnvironmentVariables;

// export interface Config {
//   NODE_ENV: string;
//   PORT: number;
//   PORT_IO: number;
//   PORT_METRICS: number | null;

//   // Deployment information
//   CLOUD_ENV: string;
//   DEPLOY_ENV: string;
//   IS_PRIVATE_CLOUD: boolean;
//   CREATOR_API_ENDPOINT: string;
//   ALEXA_SERVICE_ENDPOINT: string;
//   GOOGLE_SERVICE_ENDPOINT: string;
//   DIALOGFLOW_SERVICE_ENDPOINT: string;
//   GENERAL_SERVICE_ENDPOINT: string;

//   IDENTITY_API_ENDPOINT: string;
//   BILLING_API_ENDPOINT: string;

//   // Release information
//   GIT_SHA: string | null;
//   BUILD_NUM: string | null;
//   SEM_VER: string | null;
//   BUILD_URL: string | null;

//   // Redis
//   REDIS_CLUSTER_HOST: string;
//   REDIS_CLUSTER_PORT: number;

//   // Logux
//   LOGUX_ACTION_CHANNEL: string;

//   // Logging
//   LOG_LEVEL: string | null;
//   MIDDLEWARE_VERBOSITY: string | null;

//   // Feature flags
//   FEATURE_OVERRIDES: Record<string, boolean>;

//   // Mongo DB
//   MONGO_URI: string;
//   MONGO_DB: string;

//   // Unleash
//   UNLEASH_URL: string;
//   UNLEASH_API_KEY: string;

//   // Hashid
//   TEAM_HASH: string;
// }
