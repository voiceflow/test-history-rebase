/* eslint-disable prefer-rest-params */
const Module = require('module');

const resolveStaticFile = function (module) {
  // eslint-disable-next-line no-param-reassign
  module.exports = 'static-file';
};

Module._extensions['.css'] = resolveStaticFile;
Module._extensions['.svg'] = resolveStaticFile;

const originalLoad = Module._load;

Module._load = function () {
  if (arguments[0].endsWith('.svg?url')) {
    return 'path';
  }

  return originalLoad.apply(this, arguments);
};
