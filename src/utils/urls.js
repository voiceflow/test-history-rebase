import querystring from 'query-string';

export function isDropboxURL(src) {
  return !!src.match(/dropbox.com|dl.dropboxusercontent.com/g);
}

export function getFileNameFromURL(src) {
  const { url } = querystring.parseUrl(src);
  const [fileName] = url.split('/').reverse();

  return decodeURIComponent(fileName);
}

export function getDownloadableMediaURL(src) {
  if (isDropboxURL(src)) {
    const { url, query } = querystring.parseUrl(src);
    query.dl = 1;

    return `${url}?${querystring.stringify(query)}`;
  }

  return src;
}
