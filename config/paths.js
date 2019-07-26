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

module.exports = Object.entries(PATHS).reduce(
  (acc, [key, value]) => {
    acc[key] = path.resolve(value);

    return acc;
  },
  {
    staticJS: `${staticDir}js/`,
    staticCSS: `${staticDir}css/`,
    staticMedia: `${staticDir}media/`,
  }
);
