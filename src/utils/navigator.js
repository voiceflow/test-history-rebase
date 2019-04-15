import bowser from 'bowser';

const browser = bowser.getParser(window.navigator.userAgent);

export const OS_NAME = browser.getOSName();

export const BROWSER_NAME = browser.getBrowserName();

export const isMacOS = () => OS_NAME === 'macOS';

export const isIE = () => BROWSER_NAME === 'Internet Explorer';

export const isChrome = () => BROWSER_NAME === 'Chrome';
