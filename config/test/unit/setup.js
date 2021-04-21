/* eslint-disable no-process-env */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
const ignoreStyles = require('ignore-styles');

ignoreStyles.default([...ignoreStyles.DEFAULT_EXTENSIONS, '.csv']);

// chai plugins

chai.use(sinonChai);
chai.use(chaiAsPromised);

// env variables

// can be removed when runtime endpoint feature is moved to a form element (CORE-4990)
process.env.GENERAL_RUNTIME_CLOUD_ENDPOINT = 'https://localhost:8005';
