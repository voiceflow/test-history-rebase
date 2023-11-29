import { Utils } from '@voiceflow/common';

// add https:// if not present
export const sanitizeURL = (url: string): string => {
  if (!/^https?:\/\//.test(url)) {
    url = `https://${url}`;
  }

  return url.trim();
};

export const sanitizeURLs = (urls: string): string[] => {
  return Utils.array.unique(
    urls
      .split('\n')
      .filter((url) => !!url.trim())
      .map(sanitizeURL)
  );
};

export const formatURLs = (urls: string): string[] => Utils.array.unique(sanitizeURLs(urls));

export const appendURLs = (urls: string, newURLs: string[]): string =>
  Utils.array
    .unique([...urls.trim().split('\n'), ...newURLs])
    .filter(Boolean)
    .join('\n');
