/* eslint-disable no-process-env */
import { AIModel } from '@voiceflow/dtos';
import { IS_DEVELOPMENT, IS_PRODUCTION } from '@voiceflow/ui';
import loglevel from 'loglevel';

export { IS_DEVELOPMENT, IS_PRODUCTION, IS_TEST, NODE_ENV } from '@voiceflow/ui';

// Container env var-based configuration overrides
declare global {
  interface Window {
    VF_OVERRIDE_SEM_VER?: string; // The semantic version associated with this code

    VF_DEBUG?: boolean; // enter into debugging mode

    VF_OVERRIDE_IS_PERFORMANCE_TEST?: string; // API_HOST URL
    VF_OVERRIDE_API_HOST?: string; // API_HOST URL
    VF_OVERRIDE_CANVAS_EXPORT_ENDPOINT?: string; // CANVAS_ENDPOINT URL
    VF_OVERRIDE_APP_ENV?: string; // creator-app runtime environment
    VF_OVERRIDE_CLOUD_ENV?: string; // name of private cloud
    VF_OVERRIDE_ALEXA_SERVICE_ENDPOINT?: string; // alexa-service public endpoint
    VF_OVERRIDE_GENERAL_SERVICE_ENDPOINT?: string; // general-service public endpoint
    VF_OVERRIDE_RUNTIME_API_ENDPOINT?: string; // platform runtime-api public endpoint
    VF_OVERRIDE_REALTIME_ENDPOINT?: string; // realtime public endpoint
    VF_OVERRIDE_REALTIME_API_ENDPOINT?: string; // realtime public endpoint
    VF_OVERRIDE_REALTIME_IO_ENDPOINT?: string; // realtime public endpoint
    VF_OVERRIDE_ML_GATEWAY_ENDPOINT?: string; // realtime public endpoint
    VF_OVERRIDE_AUTH_API_ENDPOINT?: string; // auth public endpoint
    VF_OVERRIDE_ANALYTICS_API_ENDPOINT?: string; // analytics public endpoint
    VF_OVERRIDE_IDENTITY_API_ENDPOINT?: string; // identity public endpoint
    VF_OVERRIDE_BILLING_API_ENDPOINT?: string; // billing public endpoint
    VF_OVERRIDE_AMAZON_APP_ID?: string;
    VF_OVERRIDE_GOOGLE_CLIENT_ID?: string; // Override the Google OAuth2 Client
    VF_OVERRIDE_GOOGLE_ANALYTICS_ID?: string;
    VF_OVERRIDE_COPY_PASTE_KEY?: string;
    VF_OVERRIDE_USERFLOW_TOKEN?: string;
    VF_OVERRIDE_MAINTENANCE_STATUS_SOURCE?: string;
    VF_OVERRIDE_GENERAL_RUNTIME_ENDPOINT?: string;
    VF_OVERRIDE_IS_PRIVATE_CLOUD?: string;

    VF_OVERRIDE_OKTA_DOMAIN?: string;
    VF_OVERRIDE_OKTA_CLIENT_ID?: string;
    VF_OVERRIDE_OKTA_OIN_DOMAIN?: string;
    VF_OVERRIDE_OKTA_OIN_CLIENT_ID?: string;

    VF_OVERRIDE_PRIVATE_LLM_MODELS?: string;

    VF_OVERRIDE_VOICEFLOW_CDN_ENDPOINT: string;

    VF_OVERRIDE_CHARGEBEE_SITE?: string;
    VF_OVERRIDE_CHARGEBEE_PUBLISHABLE_KEY?: string;
  }
}

export const IS_E2E_TEST = !!window.Cypress;
export const IS_PERFORMANCE_TEST = IS_DEVELOPMENT || !!window.VF_OVERRIDE_IS_PERFORMANCE_TEST;

export const isDebug = () => IS_DEVELOPMENT || !!window.VF_DEBUG;

export const APP_ENV = window.VF_OVERRIDE_APP_ENV || process.env.APP_ENV!;

// shouldn't export this, only use it within this file for choosing the correct env vars to load
const IS_PRODUCTION_ENV = APP_ENV === 'production';

const PUBLIC_CLOUD = 'public';
export const CLOUD_ENV = window.VF_OVERRIDE_CLOUD_ENV || process.env.CLOUD_ENV || PUBLIC_CLOUD;
export const IS_PRIVATE_CLOUD = window.VF_OVERRIDE_IS_PRIVATE_CLOUD ? window.VF_OVERRIDE_IS_PRIVATE_CLOUD === 'true' : CLOUD_ENV !== PUBLIC_CLOUD;

export const CREATOR_URL = 'creator.voiceflow.com';
export const LEGACY_URL = 'creator.getvoiceflow.com';

// Dynamically set API_HOST based on the url
const APP_SUBDOMAIN = 'creator';
const API_SUBDOMAIN = 'api';

function getHost() {
  if (window.location.hostname.startsWith(`${APP_SUBDOMAIN}.`)) {
    return window.location.hostname.replace(new RegExp(`^${APP_SUBDOMAIN}\\b`), API_SUBDOMAIN);
  }

  return process.env.API_HOST!;
}

export const CREATOR_APP_ENDPOINT = `https://${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;

export const API_HOST = window.VF_OVERRIDE_API_HOST || process.env.VF_OVERRIDE_API_HOST || getHost();
// Currently only the e2e environment runs on 'localhost', so the check below is sufficient to distinguish between the envs.
export const API_ENDPOINT = `https://${API_HOST}${API_HOST === 'localhost' ? ':8003' : ''}`;
export const API_V2_ENDPOINT = `${API_ENDPOINT}/v2`;
export const API_V3_ENDPOINT = `${API_ENDPOINT}/v3`;

export const ROOT_DOMAIN = process.env.ROOT_DOMAIN || (API_HOST === 'localhost' ? 'localhost' : '.voiceflow.com');
export const VERSION = window.VF_OVERRIDE_SEM_VER ? `v${window.VF_OVERRIDE_SEM_VER}` : process.env.VERSION!;
export const IS_E2E = process.env.E2E === 'true';

// logging

export const LOG_LEVEL = (IS_PRODUCTION && !IS_E2E ? 'error' : process.env.LOG_LEVEL || 'info') as loglevel.LogLevelDesc;
export const LOG_FILTER = process.env.LOG_FILTER || '';

// debugging

export const DEBUG_NETWORK = !IS_PRODUCTION && !!process.env.DEBUG_NETWORK;

export const DEBUG_REALTIME = !IS_PRODUCTION && !!process.env.DEBUG_REALTIME;

export const DEBUG_CANVAS = !IS_PRODUCTION && !!process.env.DEBUG_CANVAS;
export const CANVAS_CROSSHAIR_ENABLED = DEBUG_CANVAS || (!IS_PRODUCTION && !!process.env.CANVAS_CROSSHAIR);

export const DEBUG_LOADING_GATES = !IS_PRODUCTION && !!process.env.DEBUG_LOADING_GATES;

// realtime
const REALTIME_LOCAL_ENDPOINT = process.env.REALTIME_LOCAL_ENDPOINT!;
const REALTIME_CLOUD_ENDPOINT = process.env.REALTIME_CLOUD_ENDPOINT!;
export const REALTIME_ENDPOINT =
  window.VF_OVERRIDE_REALTIME_ENDPOINT ||
  process.env.VF_OVERRIDE_REALTIME_ENDPOINT ||
  (IS_DEVELOPMENT ? REALTIME_LOCAL_ENDPOINT : REALTIME_CLOUD_ENDPOINT);

// designer-api
const REALTIME_API_LOCAL_ENDPOINT = process.env.REALTIME_API_LOCAL_ENDPOINT!;
const REALTIME_API_CLOUD_ENDPOINT = process.env.REALTIME_API_CLOUD_ENDPOINT!;
export const DESIGNER_API_ENDPOINT =
  window.VF_OVERRIDE_REALTIME_API_ENDPOINT ||
  process.env.VF_OVERRIDE_REALTIME_API_ENDPOINT ||
  (IS_DEVELOPMENT ? REALTIME_API_LOCAL_ENDPOINT : REALTIME_API_CLOUD_ENDPOINT);

// ml-gateway
const ML_GATEWAY_LOCAL_ENDPOINT = process.env.ML_GATEWAY_LOCAL_ENDPOINT!;
const ML_GATEWAY_CLOUD_ENDPOINT = process.env.ML_GATEWAY_CLOUD_ENDPOINT!;
export const ML_GATEWAY_ENDPOINT =
  window.VF_OVERRIDE_ML_GATEWAY_ENDPOINT ||
  process.env.VF_OVERRIDE_ML_GATEWAY_ENDPOINT ||
  (IS_DEVELOPMENT ? ML_GATEWAY_LOCAL_ENDPOINT : ML_GATEWAY_CLOUD_ENDPOINT);

const REALTIME_IO_LOCAL_ENDPOINT = process.env.REALTIME_IO_LOCAL_ENDPOINT!;
const REALTIME_IO_CLOUD_ENDPOINT = process.env.REALTIME_IO_CLOUD_ENDPOINT!;
export const REALTIME_IO_ENDPOINT =
  window.VF_OVERRIDE_REALTIME_IO_ENDPOINT ||
  process.env.VF_OVERRIDE_REALTIME_IO_ENDPOINT ||
  (IS_DEVELOPMENT ? REALTIME_IO_LOCAL_ENDPOINT : REALTIME_IO_CLOUD_ENDPOINT);

// amazon
export const AMAZON_APP_ID = window.VF_OVERRIDE_AMAZON_APP_ID || process.env.AMAZON_APP_ID!;

// google
export const GOOGLE_OAUTH_ID = process.env.GOOGLE_OAUTH_ID!;
const GOOGLE_PROD_CLIENT_ID = process.env.GOOGLE_PROD_CLIENT_ID!;
const GOOGLE_DEV_CLIENT_ID = process.env.GOOGLE_DEV_CLIENT_ID!;
const _GOOGLE_CLIENT_ID = IS_PRODUCTION_ENV ? GOOGLE_PROD_CLIENT_ID : GOOGLE_DEV_CLIENT_ID;
export const GOOGLE_CLIENT_ID = window.VF_OVERRIDE_GOOGLE_CLIENT_ID || _GOOGLE_CLIENT_ID;

// google analytics
export const GA_ENABLED = (!IS_E2E && IS_PRODUCTION) || process.env.GA_ENABLED === 'true';
export const GOOGLE_ANALYTICS_ID = window.VF_OVERRIDE_GOOGLE_ANALYTICS_ID || process.env.GOOGLE_ANALYTICS_ID!;

// facebook
export const FACEBOOK_GROUP_ID = process.env.FACEBOOK_GROUP_ID!;
export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID!;

// youtube
export const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID!;

// airtable
export const AIRTABLE_ID = process.env.AIRTABLE_ID!;

// stripe
const STRIPE_LIVE_KEY = process.env.STRIPE_LIVE_KEY!;
const STRIPE_TEST_KEY = process.env.STRIPE_TEST_KEY!;
export const STRIPE_KEY = IS_PRODUCTION_ENV ? STRIPE_LIVE_KEY : STRIPE_TEST_KEY;

// maintenance
export const MAINTENANCE_STATUS_SOURCE = window.VF_OVERRIDE_MAINTENANCE_STATUS_SOURCE || process.env.MAINTENANCE_STATUS_SOURCE!;

// copy-paste
export const COPY_PASTE_KEY = window.VF_OVERRIDE_COPY_PASTE_KEY || process.env.COPY_PASTE_KEY!;

// userflow
export const USERFLOW_TOKEN = (IS_PRODUCTION_ENV && (window.VF_OVERRIDE_USERFLOW_TOKEN || process.env.USERFLOW_TOKEN)) || null;

// canvas export
export const CANVAS_EXPORT_CLOUD_ENDPOINT =
  window.VF_OVERRIDE_CANVAS_EXPORT_ENDPOINT || process.env.VF_OVERRIDE_CANVAS_EXPORT_ENDPOINT || process.env.CANVAS_EXPORT_CLOUD_ENDPOINT!;
export const CANVAS_EXPORT_LOCAL_ENDPOINT = process.env.CANVAS_EXPORT_LOCAL_ENDPOINT!;
export const CANVAS_EXPORT_ENDPOINT =
  IS_E2E && process.env.VF_OVERRIDE_CANVAS_EXPORT_ENDPOINT === '' ? CANVAS_EXPORT_LOCAL_ENDPOINT : CANVAS_EXPORT_CLOUD_ENDPOINT;

// platform services
export const ALEXA_SERVICE_CLOUD_ENDPOINT =
  window.VF_OVERRIDE_ALEXA_SERVICE_ENDPOINT || process.env.VF_OVERRIDE_ALEXA_SERVICE_ENDPOINT || process.env.ALEXA_SERVICE_CLOUD_ENDPOINT!;
export const ALEXA_SERVICE_LOCAL_ENDPOINT = process.env.ALEXA_SERVICE_LOCAL_ENDPOINT!;
export const ALEXA_SERVICE_ENDPOINT =
  IS_E2E && process.env.VF_OVERRIDE_ALEXA_SERVICE_ENDPOINT === '' ? ALEXA_SERVICE_LOCAL_ENDPOINT : ALEXA_SERVICE_CLOUD_ENDPOINT;

export const GENERAL_SERVICE_CLOUD_ENDPOINT =
  window.VF_OVERRIDE_GENERAL_SERVICE_ENDPOINT || process.env.VF_OVERRIDE_GENERAL_SERVICE_ENDPOINT || process.env.GENERAL_SERVICE_CLOUD_ENDPOINT!;
export const GENERAL_SERVICE_LOCAL_ENDPOINT = process.env.GENERAL_SERVICE_LOCAL_ENDPOINT!;
export const GENERAL_SERVICE_ENDPOINT =
  IS_E2E && process.env.VF_OVERRIDE_GENERAL_SERVICE_ENDPOINT === '' ? GENERAL_SERVICE_LOCAL_ENDPOINT : GENERAL_SERVICE_CLOUD_ENDPOINT;

export const RUNTIME_API_CLOUD_ENDPOINT =
  window.VF_OVERRIDE_RUNTIME_API_ENDPOINT || process.env.VF_OVERRIDE_RUNTIME_API_ENDPOINT || process.env.RUNTIME_API_CLOUD_ENDPOINT!;
export const RUNTIME_API_LOCAL_ENDPOINT = process.env.RUNTIME_API_LOCAL_ENDPOINT!;
export const RUNTIME_API_ENDPOINT =
  IS_E2E && process.env.VF_OVERRIDE_RUNTIME_API_ENDPOINT === '' ? RUNTIME_API_LOCAL_ENDPOINT : RUNTIME_API_CLOUD_ENDPOINT;

export const GENERAL_RUNTIME_CLOUD_ENDPOINT =
  window.VF_OVERRIDE_GENERAL_RUNTIME_ENDPOINT || process.env.VF_OVERRIDE_GENERAL_RUNTIME_ENDPOINT || process.env.GENERAL_RUNTIME_CLOUD_ENDPOINT!;
export const GENERAL_RUNTIME_LOCAL_ENDPOINT = process.env.GENERAL_RUNTIME_LOCAL_ENDPOINT!;
export const GENERAL_RUNTIME_ENDPOINT_TAG = 'RUNTIME_ENDPOINT';
const GENERAL_RUNTIME_STORAGE_ENDPOINT = localStorage.getItem(GENERAL_RUNTIME_ENDPOINT_TAG);
export const GENERAL_RUNTIME_ENDPOINT =
  GENERAL_RUNTIME_STORAGE_ENDPOINT ||
  (IS_E2E && process.env.VF_OVERRIDE_GENERAL_RUNTIME_ENDPOINT === '' ? GENERAL_RUNTIME_LOCAL_ENDPOINT : GENERAL_RUNTIME_CLOUD_ENDPOINT);

export const IDENTITY_API_CLOUD_ENDPOINT =
  window.VF_OVERRIDE_IDENTITY_API_ENDPOINT || process.env.VF_OVERRIDE_IDENTITY_API_ENDPOINT || process.env.IDENTITY_API_CLOUD_ENDPOINT!;
export const IDENTITY_API_LOCAL_ENDPOINT = process.env.IDENTITY_API_LOCAL_ENDPOINT!;
export const IDENTITY_API_ENDPOINT =
  IS_E2E && process.env.VF_OVERRIDE_IDENTITY_API_ENDPOINT === '' ? IDENTITY_API_LOCAL_ENDPOINT : IDENTITY_API_CLOUD_ENDPOINT;

export const BILLING_API_CLOUD_ENDPOINT =
  window.VF_OVERRIDE_BILLING_API_ENDPOINT || process.env.VF_OVERRIDE_BILLING_API_ENDPOINT || process.env.BILLING_API_CLOUD_ENDPOINT!;
export const BILLING_API_LOCAL_ENDPOINT = process.env.BILLING_API_LOCAL_ENDPOINT!;
export const BILLING_API_ENDPOINT =
  IS_E2E && process.env.VF_OVERRIDE_BILLING_API_ENDPOINT === '' ? BILLING_API_LOCAL_ENDPOINT : BILLING_API_CLOUD_ENDPOINT;

export const AUTH_API_CLOUD_ENDPOINT =
  window.VF_OVERRIDE_AUTH_API_ENDPOINT || process.env.VF_OVERRIDE_AUTH_API_ENDPOINT || process.env.AUTH_API_CLOUD_ENDPOINT!;
export const AUTH_API_LOCAL_ENDPOINT = process.env.AUTH_API_LOCAL_ENDPOINT!;
export const AUTH_API_ENDPOINT = IS_E2E && process.env.VF_OVERRIDE_AUTH_API_ENDPOINT === '' ? AUTH_API_LOCAL_ENDPOINT : AUTH_API_CLOUD_ENDPOINT;

export const ANALYTICS_API_CLOUD_ENDPOINT =
  window.VF_OVERRIDE_ANALYTICS_API_ENDPOINT || process.env.VF_OVERRIDE_ANALYTICS_API_ENDPOINT || process.env.ANALYTICS_API_CLOUD_ENDPOINT!;
export const ANALYTICS_API_LOCAL_ENDPOINT = process.env.ANALYTICS_API_LOCAL_ENDPOINT!;
export const ANALYTICS_API_ENDPOINT =
  IS_E2E && process.env.VF_OVERRIDE_ANALYTICS_API_ENDPOINT === '' ? ANALYTICS_API_LOCAL_ENDPOINT : ANALYTICS_API_CLOUD_ENDPOINT;

export const TRUSTED_ENDPOINTS = [API_ENDPOINT, ALEXA_SERVICE_ENDPOINT, GENERAL_SERVICE_ENDPOINT];

const VALID_MODELS = new Set<string>(Object.values(AIModel));

// comma separated list of models supported, checked against the enum
const PRIVATE_LLM_MODEL_STRING =
  window.VF_OVERRIDE_PRIVATE_LLM_MODELS || process.env.VF_OVERRIDE_PRIVATE_LLM_MODELS || process.env.PRIVATE_LLM_MODELS;
const PRIVATE_LLM_MODEL_LIST = PRIVATE_LLM_MODEL_STRING?.split?.(',').filter((model) => VALID_MODELS.has(model)) || null;

export const PRIVATE_LLM_MODELS = new Set(PRIVATE_LLM_MODEL_LIST ?? []);

export const VOICEFLOW_CDN_ENDPOINT =
  window.VF_OVERRIDE_VOICEFLOW_CDN_ENDPOINT || process.env.VF_OVERRIDE_VOICEFLOW_CDN_ENDPOINT || 'https://cdn.voiceflow.com';

// chargebee
export const CHARGEBEE_SITE = window.VF_OVERRIDE_CHARGEBEE_SITE || process.env.VF_OVERRIDE_CHARGEBEE_SITE || '';
export const CHARGEBEE_PUBLISHABLE_KEY = window.VF_OVERRIDE_CHARGEBEE_PUBLISHABLE_KEY || process.env.VF_OVERRIDE_CHARGEBEE_PUBLISHABLE_KEY || '';

// datadog
// TODO: move into env var
export const DATADOG_SITE = 'datadoghq.com';
export const DATADOG_APP_ID = 'ef6859f3-2843-43c6-9abf-0157556ff84a';
export const DATADOG_CLIENT_TOKEN = 'pubd54c024c3ce9f4333a328044b85c8154';
