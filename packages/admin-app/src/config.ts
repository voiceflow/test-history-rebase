/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { IS_DEVELOPMENT, IS_PRODUCTION } from '@voiceflow/ui';

// Container env var-based configuration overrides
declare global {
  interface Window {
    VF_DEBUG?: boolean; // enter into debugging mode

    VF_OVERRIDE_API_HOST?: string; // API_HOST URL
    VF_OVERRIDE_APP_ENV?: string; // creator-app runtime environment
    VF_OVERRIDE_CLOUD_ENV?: string; // name of private cloud
    VF_OVERRIDE_GOOGLE_CLIENT_ID?: string; // Override the Google OAuth2 Client
    VF_OVERRIDE_SENTRY_DSN?: string;
  }
}

export const isDebug = () => IS_DEVELOPMENT || !!window.VF_DEBUG;

export const APP_ENV = window.VF_OVERRIDE_APP_ENV || process.env.APP_ENV!;
export const IS_PRODUCTION_ENV = APP_ENV === 'production';

const PUBLIC_CLOUD = 'public';
export const CLOUD_ENV = window.VF_OVERRIDE_CLOUD_ENV || process.env.CLOUD_ENV || PUBLIC_CLOUD;

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

export const API_HOST = window.VF_OVERRIDE_API_HOST || process.env.VF_OVERRIDE_API_HOST || getHost();
// Currently only the e2e environment runs on 'localhost', so the check below is sufficient to distinguish between the envs.
export const API_ENDPOINT = `https://${API_HOST}${API_HOST === 'localhost' ? ':8003' : ''}`;

// platform services
export const ALEXA_SERVICE_LOCAL_ENDPOINT = process.env.ALEXA_SERVICE_LOCAL_ENDPOINT!;

export const ALEXA_SERVICE_CLOUD_ENDPOINT = process.env.VF_OVERRIDE_ALEXA_SERVICE_ENDPOINT || process.env.ALEXA_SERVICE_CLOUD_ENDPOINT!;
export const ALEXA_SERVICE_ENDPOINT =
  IS_DEVELOPMENT && process.env.VF_OVERRIDE_ALEXA_SERVICE_ENDPOINT === '' ? ALEXA_SERVICE_LOCAL_ENDPOINT : ALEXA_SERVICE_CLOUD_ENDPOINT;
export const GOOGLE_SERVICE_CLOUD_ENDPOINT = process.env.VF_OVERRIDE_GOOGLE_SERVICE_ENDPOINT || process.env.GOOGLE_SERVICE_CLOUD_ENDPOINT!;
export const GOOGLE_SERVICE_LOCAL_ENDPOINT = process.env.GOOGLE_SERVICE_LOCAL_ENDPOINT!;
export const GOOGLE_SERVICE_ENDPOINT =
  IS_DEVELOPMENT && process.env.VF_OVERRIDE_GOOGLE_SERVICE_ENDPOINT === '' ? GOOGLE_SERVICE_LOCAL_ENDPOINT : GOOGLE_SERVICE_CLOUD_ENDPOINT;
export const GENERAL_SERVICE_CLOUD_ENDPOINT = process.env.VF_OVERRIDE_GENERAL_SERVICE_ENDPOINT || process.env.GENERAL_SERVICE_CLOUD_ENDPOINT!;
export const GENERAL_SERVICE_LOCAL_ENDPOINT = process.env.GENERAL_SERVICE_LOCAL_ENDPOINT!;
export const GENERAL_SERVICE_ENDPOINT =
  IS_DEVELOPMENT && process.env.VF_OVERRIDE_GENERAL_SERVICE_ENDPOINT === '' ? GENERAL_SERVICE_LOCAL_ENDPOINT : GENERAL_SERVICE_CLOUD_ENDPOINT;

export const ROOT_DOMAIN = process.env.ROOT_DOMAIN || (API_HOST === 'localhost' ? 'localhost' : '.voiceflow.com');
export const VERSION = process.env.VERSION!;

// google
const GOOGLE_PROD_CLIENT_ID = process.env.GOOGLE_PROD_CLIENT_ID!;
const GOOGLE_DEV_CLIENT_ID = process.env.GOOGLE_DEV_CLIENT_ID!;
// eslint-disable-next-line no-underscore-dangle
const _GOOGLE_CLIENT_ID = IS_PRODUCTION_ENV ? GOOGLE_PROD_CLIENT_ID : GOOGLE_DEV_CLIENT_ID;
export const GOOGLE_CLIENT_ID = window.VF_OVERRIDE_GOOGLE_CLIENT_ID || _GOOGLE_CLIENT_ID;

// logrocket
export const LOGROCKET_PROJECT = process.env.LOGROCKET_PROJECT!;

// sentry
export const SENTRY_ENABLED = IS_PRODUCTION || process.env.SENTRY_ENABLED === 'true';
export const SENTRY_DSN = window.VF_OVERRIDE_SENTRY_DSN || process.env.SENTRY_DSN!;
