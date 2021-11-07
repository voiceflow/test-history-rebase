/* eslint-disable prefer-rest-params */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-process-env */

require('regenerator-runtime/runtime');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiSubset = require('chai-subset');
const sinonChai = require('sinon-chai');
const ignoreStyles = require('ignore-styles');

const Module = require('module');

const originalRequire = Module.prototype.require;
Module.prototype.require = function () {
  if (arguments[0] && arguments[0].endsWith('?url')) return;

  return originalRequire.apply(this, arguments);
};

global.Audio = class {
  play() {}

  pause() {}
};

ignoreStyles.default([...ignoreStyles.DEFAULT_EXTENSIONS, '.csv', '.svg']);

// chai plugins

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(chaiSubset);

// env variables

// can be removed when runtime endpoint feature is moved to a form element (CORE-4990)
process.env.GENERAL_RUNTIME_CLOUD_ENDPOINT = 'https://localhost:8005';
