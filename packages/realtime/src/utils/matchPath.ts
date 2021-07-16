/* eslint-disable @typescript-eslint/ban-types, sonarjs/cognitive-complexity */
// copied from https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/matchPath.js

import { Key, ParseOptions, pathToRegexp, TokensToRegexpOptions } from 'path-to-regexp';

const cache: Record<string, Record<string, { keys: Key[]; regexp: RegExp }>> = {};
const cacheLimit = 10000;
let cacheCount = 0;

interface CompilePathOptions extends TokensToRegexpOptions, ParseOptions {}

interface MathPathOptions extends CompilePathOptions {
  path?: string[];
  exact?: boolean;
}

interface Match<P extends {}> {
  url: string;
  path: string;
  params: P;
  isExact: boolean;
}

const compilePath = (path: string, options: TokensToRegexpOptions & ParseOptions) => {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
  const pathCache = cache[cacheKey] || (cache[cacheKey] = {});

  if (pathCache[path]) return pathCache[path];

  const keys: Key[] = [];
  const regexp = pathToRegexp(path, keys, options);
  const result = { regexp, keys };

  if (cacheCount < cacheLimit) {
    pathCache[path] = result;
    cacheCount++;
  }

  return result;
};

/**
 * Public API for matching a URL pathname to a path.
 */
const matchPath = <P extends {} = {}>(pathname: string, options: string | string | MathPathOptions = {}): null | Match<P> => {
  let opts: Omit<MathPathOptions, 'path'> & { path: string[] };

  if (typeof options === 'string') {
    opts = { path: [options] };
  } else if (Array.isArray(options)) {
    opts = { path: options };
  } else {
    opts = {
      ...options,
      path: options.path ?? [],
    };
  }

  const { path, exact = false, strict = false, sensitive = false } = opts;

  const paths = [...path];

  return paths.reduce<null | Match<P>>((matched, path) => {
    if (!path && path !== '') return null;

    if (matched) return matched;

    const { regexp, keys } = compilePath(path, {
      end: exact,
      strict,
      sensitive,
    });

    const match = regexp.exec(pathname);

    if (!match) return null;

    const [url, ...values] = match;
    const isExact = pathname === url;

    if (exact && !isExact) return null;

    return {
      url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
      path, // the path used to match
      isExact, // whether or not we matched exactly
      params: keys.reduce<P>((memo, key, index) => Object.assign(memo, { [key.name]: values[index] }), {} as P),
    };
  }, null);
};

export default matchPath;
