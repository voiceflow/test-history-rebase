import path from 'path';

const sourceDir = 'src/';
const publicDir = 'public/';
const staticDir = 'static/';

const PATHS = {
  pkg: 'package.json',
  entrypoint: `${sourceDir}index.tsx`,
  indexHTML: `${sourceDir}index.html`,
  sourceDir,
  publicDir,
  buildDir: 'build/',
};

const ADMIN_PATHS = {
  entrypoint: `${sourceDir}admin/index.tsx`,
  buildDir: 'admin_build/',
};

const resolvePaths = <T extends string>(paths: Record<T, string>) => {
  return (Object.entries(paths) as [T, string][]).reduce<Record<T, string>>((acc, [key, value]) => {
    acc[key] = path.resolve(value);

    return acc;
  }, {} as Record<T, string>);
};

export default {
  ...resolvePaths(PATHS),
  admin: resolvePaths(ADMIN_PATHS),
  staticJS: `${staticDir}js/`,
  staticCSS: `${staticDir}css/`,
  staticMedia: `${staticDir}media/`,
};
