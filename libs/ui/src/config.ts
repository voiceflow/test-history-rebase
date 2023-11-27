import Bowser from 'bowser';

const { browser, os, platform } = globalThis.navigator ? Bowser.parse(globalThis.navigator.userAgent) : { browser: {}, os: {}, platform: {} };

export const DEVICE_INFO = {
  os: os.name,
  version: os.version,
  browser: browser.name,
  platform: platform.type,
  browserVersion: browser.version,
};

interface BrowserNavigator extends Navigator {
  brave: {
    isBrave(): boolean;
  };
}

export const NODE_ENV = process.env.NODE_ENV!;
export const IS_DEVELOPMENT = NODE_ENV === 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_E2E = process.env.E2E === 'true';
export const IS_TEST = NODE_ENV === 'test';

export const IS_MOBILE = DEVICE_INFO.platform === 'mobile';
export const IS_TABLET = DEVICE_INFO.platform === 'tablet';

export const IS_MAC = DEVICE_INFO.os === 'macOS';
export const IS_IOS = DEVICE_INFO.os === 'iOS';
export const IS_WINDOWS = DEVICE_INFO.os === 'Windows';
export const IS_CHROME_OS = DEVICE_INFO.os === 'Chrome OS';

export const IS_EDGE = DEVICE_INFO.browser === 'Microsoft Edge';
export const IS_CHROME = DEVICE_INFO.browser === 'Chrome';
export const IS_FIREFOX = DEVICE_INFO.browser === 'Firefox';
export const IS_SAFARI = DEVICE_INFO.browser === 'Safari';

// We need to check for the existence of navigator.brave.isBrave because navigator browser name is chrome
const isBraveBrowser = () => {
  const browserNavigator = globalThis.navigator as BrowserNavigator;

  if (!browserNavigator) return false;

  if (browserNavigator.brave !== undefined) {
    return browserNavigator.brave.isBrave.name === 'isBrave';
  }

  return false;
};

export const IS_BRAVE = isBraveBrowser();
