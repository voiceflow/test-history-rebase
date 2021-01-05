/* eslint-disable prefer-destructuring, no-process-env */
import Bowser from 'bowser';
import loglevel from 'loglevel';

const { browser, os } = Bowser.parse(window.navigator.userAgent);

export const DEVICE_INFO = {
  os: os.name,
  version: os.version,
  browser: browser.name,
};

// Container env var-based configuration overrides
declare global {
  interface Window {
    VF_OVERRIDE_API_HOST?: string; // API_HOST URL
    VF_OVERRIDE_CANVAS_EXPORT_ENDPOINT?: string; // CANVAS_ENDPOINT URL
    VF_OVERRIDE_APP_ENV?: string; // creator-app runtime environment
    VF_OVERRIDE_CLOUD_ENV?: string; // name of private cloud
    VF_OVERRIDE_GOOGLE_SERVICE_ENDPOINT?: string; // google-service public endpoint
    VF_OVERRIDE_ALEXA_SERVICE_ENDPOINT?: string; // google-service public endpoint
    VF_OVERRIDE_GENERAL_SERVICE_ENDPOINT?: string; // general-service public endpoint
    VF_OVERRIDE_INTERCOM_APP_ID?: string;
    VF_OVERRIDE_AMAZON_APP_ID?: string;
    VF_OVERRIDE_GOOGLE_CLIENT_ID?: string; // Override the Google OAuth2 Client
    VF_OVERRIDE_GOOGLE_ANALYTICS_ID?: string;
    VF_OVERRIDE_COPY_PASTE_KEY?: string;
    VF_OVERRIDE_ADMIN_HOST?: string;
    VF_OVERRIDE_MAINTENANCE_STATUS_SOURCE?: string;
    VF_OVERRIDE_GENERAL_RUNTIME_ENDPOINT?: string;
  }
}

export const isMac = DEVICE_INFO.os === 'macOS';
export const isWindows = DEVICE_INFO.os === 'Windows';
export const isChromeOS = DEVICE_INFO.os === 'Chrome OS';

export const isEdge = DEVICE_INFO.browser === 'Microsoft Edge';
export const isChrome = DEVICE_INFO.browser === 'Chrome';
export const isFirefox = DEVICE_INFO.browser === 'Firefox';
export const isSafari = DEVICE_INFO.browser === 'Safari';

export const NODE_ENV = process.env.NODE_ENV!;
export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_DEVELOPMENT = NODE_ENV === 'development';
export const IS_TEST = NODE_ENV === 'test';

export const APP_ENV = window.VF_OVERRIDE_APP_ENV || process.env.APP_ENV!;
export const IS_PRODUCTION_ENV = APP_ENV === 'production';

export const CLOUD_ENV = window.VF_OVERRIDE_CLOUD_ENV || process.env.CLOUD_ENV || 'public';
export const IS_PRIVATE_CLOUD = IS_PRODUCTION && CLOUD_ENV !== 'public';

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

export const API_HOST = window.VF_OVERRIDE_API_HOST || getHost();
export const API_ENDPOINT = `https://${API_HOST}${IS_DEVELOPMENT ? ':8080' : ''}`;

export const ROOT_DOMAIN = process.env.ROOT_DOMAIN || (IS_DEVELOPMENT ? window.location.hostname : 'voiceflow.com');
export const VERSION = process.env.VERSION!;

// logging

export const LOG_LEVEL = (IS_PRODUCTION ? 'error' : process.env.LOG_LEVEL || 'info') as loglevel.LogLevelDesc;
export const LOG_FILTER = process.env.LOG_FILTER || '';

// debugging

export const DEBUG_NETWORK = !IS_PRODUCTION && !!process.env.DEBUG_NETWORK;
export const DEBUG_HTTP = DEBUG_NETWORK || (!IS_PRODUCTION && !!process.env.DEBUG_HTTP);
export const DEBUG_SOCKET = DEBUG_NETWORK || (!IS_PRODUCTION && !!process.env.DEBUG_SOCKET);

export const DEBUG_REALTIME = !IS_PRODUCTION && !!process.env.DEBUG_REALTIME;

export const DEBUG_CANVAS = !IS_PRODUCTION && !!process.env.DBEUG_CANVAS;
export const CANVAS_CROSSHAIR_ENABLED = DEBUG_CANVAS || (!IS_PRODUCTION && !!process.env.CANVAS_CROSSHAIR);

// realtime
export const REALTIME_CURSOR_ENABLED = IS_PRODUCTION || DEBUG_REALTIME;

const _ADMIN_HOST =
  // eslint-disable-next-line no-nested-ternary
  !API_HOST || API_HOST.includes('localhost')
    ? 'https://localhost:3001'
    : IS_PRODUCTION_ENV
    ? 'https://admin.voiceflow.com'
    : 'https://admin.development.voiceflow.com';
export const ADMIN_HOST = window.VF_OVERRIDE_ADMIN_HOST || _ADMIN_HOST;

// amazon
export const AMAZON_APP_ID = window.VF_OVERRIDE_AMAZON_APP_ID || process.env.AMAZON_APP_ID!;

// google
export const GOOGLE_OAUTH_ID = process.env.GOOGLE_OAUTH_ID!;
const GOOGLE_PROD_CLIENT_ID = process.env.GOOGLE_PROD_CLIENT_ID!;
const GOOGLE_DEV_CLIENT_ID = process.env.GOOGLE_DEV_CLIENT_ID!;
const _GOOGLE_CLIENT_ID = IS_PRODUCTION_ENV ? GOOGLE_PROD_CLIENT_ID : GOOGLE_DEV_CLIENT_ID;
export const GOOGLE_CLIENT_ID = window.VF_OVERRIDE_GOOGLE_CLIENT_ID || _GOOGLE_CLIENT_ID;

// tracking
export const TRACKING_ENABLED = IS_PRODUCTION || process.env.TRACKING_ENABLED === 'true';

// google analytics
export const GA_ENABLED = TRACKING_ENABLED || process.env.GA_ENABLED === 'true';
export const GOOGLE_ANALYTICS_ID = window.VF_OVERRIDE_GOOGLE_ANALYTICS_ID || process.env.GOOGLE_ANALYTICS_ID!;

// zapier
const ZAPIER_DEV_PATH = process.env.ZAPIER_DEV_PATH!;
const ZAPIER_PROD_PATH = process.env.ZAPIER_PROD_PATH!;
export const ZAPIER_PATH = IS_PRODUCTION_ENV ? ZAPIER_PROD_PATH : ZAPIER_DEV_PATH;

const ONBOARDING_ZAPIER_PROD_PATH = process.env.ONBOARDING_ZAPIER_PROD_PATH!;
export const ONBOARDING_ZAPIER_PATH = IS_PRODUCTION_ENV ? ONBOARDING_ZAPIER_PROD_PATH : '';

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

// logrocket
export const LOGROCKET_ENABLED = IS_PRODUCTION || process.env.LOGROCKET_ENABLED === 'true';
export const LOGROCKET_PROJECT = process.env.LOGROCKET_PROJECT!;

// intercom
export const INTERCOM_ENABLED = IS_PRODUCTION || process.env.INTERCOM_ENABLED === 'true';
export const INTERCOM_APP_ID = window.VF_OVERRIDE_INTERCOM_APP_ID || process.env.INTERCOM_APP_ID!;

// maintenance
export const MAINTENANCE_STATUS_SOURCE = window.VF_OVERRIDE_MAINTENANCE_STATUS_SOURCE || process.env.MAINTENANCE_STATUS_SOURCE!;

// copy-paste
export const COPY_PASTE_KEY = window.VF_OVERRIDE_COPY_PASTE_KEY || process.env.COPY_PASTE_KEY!;

// userflow
export const USERFLOW_ENABLED = IS_PRODUCTION || process.env.USERFLOW_ENABLED === 'true';
const USERFLOW_PROD_TOKEN = process.env.USERFLOW_PROD_TOKEN!;
const USERFLOW_DEV_TOKEN = process.env.USERFLOW_DEV_TOKEN!;
export const USERFLOW_TOKEN = IS_PRODUCTION_ENV ? USERFLOW_PROD_TOKEN : USERFLOW_DEV_TOKEN;
export const USERFLOW_ONBOARDING_FLOW_ID = process.env.USERFLOW_ONBOARDING_FLOW_ID!;
export const USERFLOW_DASHBOARD_FLOW_ID = process.env.USERFLOW_DASHBOARD_FLOW_ID!;

// canvas export
export const CANVAS_EXPORT_ENDPOINT = window.VF_OVERRIDE_CANVAS_EXPORT_ENDPOINT || process.env.CANVAS_EXPORT_ENDPOINT!;

// platform services
export const ALEXA_SERVICE_CLOUD_ENDPOINT = window.VF_OVERRIDE_ALEXA_SERVICE_ENDPOINT || process.env.ALEXA_SERVICE_CLOUD_ENDPOINT!;
export const ALEXA_SERVICE_LOCAL_ENDPOINT = process.env.ALEXA_SERVICE_LOCAL_ENDPOINT!;
export const ALEXA_SERVICE_ENDPOINT = IS_DEVELOPMENT ? ALEXA_SERVICE_LOCAL_ENDPOINT : ALEXA_SERVICE_CLOUD_ENDPOINT;
export const GOOGLE_SERVICE_CLOUD_ENDPOINT = window.VF_OVERRIDE_GOOGLE_SERVICE_ENDPOINT || process.env.GOOGLE_SERVICE_CLOUD_ENDPOINT!;
export const GOOGLE_SERVICE_LOCAL_ENDPOINT = process.env.GOOGLE_SERVICE_LOCAL_ENDPOINT!;
export const GOOGLE_SERVICE_ENDPOINT = IS_DEVELOPMENT ? GOOGLE_SERVICE_LOCAL_ENDPOINT : GOOGLE_SERVICE_CLOUD_ENDPOINT;
export const GENERAL_SERVICE_CLOUD_ENDPOINT = window.VF_OVERRIDE_GENERAL_SERVICE_ENDPOINT || process.env.GENERAL_SERVICE_CLOUD_ENDPOINT!;
export const GENERAL_SERVICE_LOCAL_ENDPOINT = process.env.GENERAL_SERVICE_LOCAL_ENDPOINT!;
export const GENERAL_SERVICE_ENDPOINT = IS_DEVELOPMENT ? GENERAL_SERVICE_LOCAL_ENDPOINT : GENERAL_SERVICE_CLOUD_ENDPOINT;
export const GENERAL_RUNTIME_CLOUD_ENDPOINT = window.VF_OVERRIDE_GENERAL_RUNTIME_ENDPOINT || process.env.GENERAL_RUNTIME_CLOUD_ENDPOINT!;
export const GENERAL_RUNTIME_LOCAL_ENDPOINT = process.env.GENERAL_RUNTIME_LOCAL_ENDPOINT!;
export const GENERAL_RUNTIME_ENDPOINT = IS_DEVELOPMENT ? GENERAL_RUNTIME_LOCAL_ENDPOINT : GENERAL_RUNTIME_CLOUD_ENDPOINT;

export const TRUSTED_ENDPOINTS = [API_ENDPOINT, ALEXA_SERVICE_ENDPOINT, GOOGLE_SERVICE_ENDPOINT, GENERAL_SERVICE_ENDPOINT];

// okta
export const OKTA_DOMAIN = process.env.OKTA_DOMAIN!;
export const OKTA_SCOPES = ['openid', 'profile', 'email', 'offline_access'];
export const OKTA_CLIENT_ID = process.env.OKTA_CLIENT_ID!;
