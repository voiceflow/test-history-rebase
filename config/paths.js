const path = require('path');

const sourceDir = 'src/';
const publicDir = 'public/';
const staticDir = 'static/';

const PATHS = {
  pkg: 'package.json',
  entrypoint: `${sourceDir}index.jsx`,
  indexHTML: `${publicDir}index.html`,
  sourceDir,
  publicDir,
  buildDir: 'build/',
};

const ADMIN_PATHS = {
  entrypoint: `${sourceDir}admin/index.jsx`,
  buildDir: 'adminbuild/',
};

function resolvePaths(paths) {
  return Object.entries(paths).reduce((acc, [key, value]) => {
    acc[key] = path.resolve(value);

    return acc;
  }, {});
}

module.exports = {
  ...resolvePaths(PATHS),
  admin: resolvePaths(ADMIN_PATHS),
  staticJS: `${staticDir}js/`,
  staticCSS: `${staticDir}css/`,
  staticMedia: `${staticDir}media/`,
};
