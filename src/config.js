/* eslint-disable prefer-destructuring, no-process-env */
import Bowser from 'bowser';

const { browser, os } = Bowser.parse(window.navigator.userAgent);
export const DEVICE_INFO = {
  os: os.name,
  version: os.version,
  browser: browser.name,
};

export const isMac = DEVICE_INFO.os === 'macOS';
export const isWindows = DEVICE_INFO.os === 'Windows';
export const isChromeOS = DEVICE_INFO.os === 'Chrome OS';

export const isEdge = DEVICE_INFO.browser === 'Microsoft Edge';
export const isChrome = DEVICE_INFO.browser === 'Chrome';
export const isFirefox = DEVICE_INFO.browser === 'Firefox';
export const isSafari = DEVICE_INFO.browser === 'Safari';

export const NODE_ENV = process.env.NODE_ENV;
export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_DEVELOPMENT = NODE_ENV === 'development';

export const BUILD_ENV = process.env.BUILD_ENV;

export const API_HOST = process.env.API_HOST;
export const API_ENDPOINT = `https://${API_HOST}${IS_DEVELOPMENT ? ':8080' : ''}`;

export const ROOT_DOMAIN = process.env.ROOT_DOMAIN || (IS_PRODUCTION ? 'voiceflow.com' : window.location.hostname);
export const VERSION = process.env.VERSION;

export const CREATOR_URL = 'creator.voiceflow.com';
export const LEGACY_URL = 'creator.getvoiceflow.com';

// debugging
export const DEBUG_NETWORK = !IS_PRODUCTION && process.env.DEBUG_NETWORK;
export const DEBUG_HTTP = DEBUG_NETWORK || (!IS_PRODUCTION && process.env.DEBUG_HTTP);
export const DEBUG_SOCKET = DEBUG_NETWORK || (!IS_PRODUCTION && process.env.DEBUG_SOCKET);

export const ADMIN_HOST =
  // eslint-disable-next-line no-nested-ternary
  !API_HOST || API_HOST.includes('localhost')
    ? 'https://localhost:3001'
    : BUILD_ENV === 'staging'
    ? 'https://admin.development.voiceflow.com'
    : 'https://admin.voiceflow.com';

// amazon
export const AMAZON_APP_ID = process.env.AMAZON_APP_ID;

// google
export const GOOGLE_OAUTH_ID = process.env.GOOGLE_OAUTH_ID;
const GOOGLE_PROD_CLIENT_ID = process.env.GOOGLE_PROD_CLIENT_ID;
const GOOGLE_DEV_CLIENT_ID = process.env.GOOGLE_DEV_CLIENT_ID;
export const GOOGLE_CLIENT_ID = BUILD_ENV === 'production' ? GOOGLE_PROD_CLIENT_ID : GOOGLE_DEV_CLIENT_ID;

// google analytics
export const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID;

// zapier
const ZAPIER_DEV_PATH = process.env.ZAPIER_DEV_PATH;
const ZAPIER_PROD_PATH = process.env.ZAPIER_PROD_PATH;
export const ZAPIER_PATH = IS_PRODUCTION && BUILD_ENV !== 'staging' ? ZAPIER_PROD_PATH : ZAPIER_DEV_PATH;

// facebook
export const FACEBOOK_GROUP_ID = process.env.FACEBOOK_GROUP_ID;
export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;

// youtube
export const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

// stripe
const STRIPE_LIVE_KEY = process.env.STRIPE_LIVE_KEY;
const STRIPE_TEST_KEY = process.env.STRIPE_TEST_KEY;
export const STRIPE_KEY = IS_PRODUCTION && BUILD_ENV !== 'staging' ? STRIPE_LIVE_KEY : STRIPE_TEST_KEY;

// logrocket
export const LOGROCKET_ENABLED = IS_PRODUCTION || process.env.LOGROCKET_ENABLED === 'true';
export const LOGROCKET_PROJECT = process.env.LOGROCKET_PROJECT;

// maintenance
export const MAINTENANCE_STATUS_SOURCE = process.env.MAINTENANCE_STATUS_SOURCE;
