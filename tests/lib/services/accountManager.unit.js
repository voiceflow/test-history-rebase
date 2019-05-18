'use strict';

const randomstring = require('randomstring');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const AccountManager = require('../../../lib/services/accountManager');

chai.use(chaiAsPromised);
const { expect } = chai;

describe('accountManager unit tests', () => {
  const defaultServices = {
    jwt: {},
    pool: {},
    axios: {},
    redis: {},
    crypto: {},
    hashids: {},
    analytics: {},
    googleClient: {},
    randomstring: {},
  };

  it('generates valid userHash', async () => {
    let counter = 0;

    const services = {
      ...defaultServices,
      redis: {
        exists: (userHash, cb) => {
          cb(null, userHash === 'CMAFoQjhz41lkPmb' ? 1 : 0);
        },
      },
      randomstring: {
        generate: () => {
          counter++;
          switch (counter) {
            case 1:
              return 'sEp2JV1nbHeS1fe8';
            case 2:
              return 'CMAFoQjhz41lkPmb';
            default:
              return '7auWIOSgXeY2qYSQ';
          }
        },
      },
    };

    const accountManager = AccountManager(services);

    // girst userHash should be normal and valid
    expect(await accountManager.generateUserHash()).to.eql('sEp2JV1nbHeS1fe8');
    // generate userHash, see that it exists, then generate new userHash
    expect(await accountManager.generateUserHash()).to.eql('7auWIOSgXeY2qYSQ');
  });

  it('handles userHash redis error', async () => {
    const services = {
      ...defaultServices,
      redis: {
        exists: (userHash, cb) => (cb('fail', null)),
      },
      randomstring,
    };

    const accountManager = AccountManager(services);
    expect(accountManager.generateUserHash()).to.eventually.be.rejectedWith('fail');
  });
});
