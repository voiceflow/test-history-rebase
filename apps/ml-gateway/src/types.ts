import { BaseUtils } from '@voiceflow/base-types';
import { ChatCompletionRequestMessage } from 'openai';

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
  IDENTITY_API_ENDPOINT: string;

  // Release information
  GIT_SHA: string | null;
  BUILD_NUM: string | null;
  SEM_VER: string | null;
  BUILD_URL: string | null;

  // Redis
  REDIS_CLUSTER_HOST: string;
  REDIS_CLUSTER_PORT: number;

  // Logux
  LOGUX_TIMEOUT: number;
  LOGUX_ACTION_CHANNEL: string;

  // Logging
  LOG_LEVEL: string | null;
  MIDDLEWARE_VERBOSITY: string | null;

  // Google
  FIRESTORE_MODEL_COLLECTION: string | null;
  FIRESTORE_GPTPROMPT_COLLECTION: string;
  PUBSUB_PROJECT_KEY: string | null;

  // OpenAI
  OPENAI_API_KEY: string;
  OPENAI_ORG_ID: string;
}

export interface MLRequest {
  requestID: string;
  locales: string[];
}

export interface MLGenPromptRequest extends MLRequest {
  examples: string[];
  quantity: number;
  workspaceID: string;
}

export interface MLGenUtteranceRequest extends MLGenPromptRequest {
  intent: string;
}

export interface MLGenEntityValue extends MLRequest {
  type: string;
  name: string;
  examples: string[][];
  quantity: number;
  workspaceID: string;
}

export interface MLGenEntityPrompt extends MLRequest {
  type: string;
  name: string;
  quantity: number;
  workspaceID: string;
  intentName: string;
  intentInputs: string[];
  examples: string[];
}

export interface MLGenAutoComplete {
  projectID: string;
  transcript: string[];
}

export interface MLGenerativeResponse extends BaseUtils.ai.AIModelParams {
  projectID: string;
  prompt: string;
}

export interface MLChatResponse extends BaseUtils.ai.AIModelParams {
  projectID: string;
  messages: Array<ChatCompletionRequestMessage>;
}
