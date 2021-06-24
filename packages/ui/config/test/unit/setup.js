const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
const ignoreStyles = require('ignore-styles').default;

ignoreStyles();

// chai plugins

chai.use(sinonChai);
chai.use(chaiAsPromised);
