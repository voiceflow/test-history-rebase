const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');

// chai plugins

chai.use(sinonChai);
chai.use(chaiAsPromised);
