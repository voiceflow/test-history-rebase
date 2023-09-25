import { getValidHref } from './string';

export const getHostName = () => window.location.hostname;

/**
 * opens url in  anew tab, noopener and noreferrer is set to true by default
 */
export const openURLInTheSameTab = (url: string): void => window.location.replace(getValidHref(url));

/**
 * opens url in  anew tab, noopener and noreferrer is set to true by default
 */
export const openURLInANewTab = (url: string, features = 'noopener=true,noreferrer=true'): void =>
  window.open(getValidHref(url), '_blank', features)?.focus();

/**
 * opens internal url in a new tab, noopener and noreferrer is not set
 */
export const openInternalURLInANewTab = (url: string): void => openURLInANewTab(url, '');

/**
 * opens url in a new, noopener and noreferrer is set to true
 */
export const onOpenURLInANewTabFactory = (url: string) => (): void => openURLInANewTab(url);

/**
 * opens internal url in a new tab, noopener and noreferrer is not set
 */
export const onOpenInternalURLInANewTabFactory = (url: string) => (): void => openInternalURLInANewTab(url);
