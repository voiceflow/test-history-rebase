'use strict';

const _jwt = require('jsonwebtoken');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const AccountManager = require('../../../lib/services/accountManager');

chai.use(chaiAsPromised);
const { expect } = chai;

const mockAccount = {
  id: 2,
  name: 'Tyler',
  email: 'tyler@voiceflow.com',
  admin: 100,
};

class DeterministicRandomString {
  constructor() {
    this.counter = 0;
    this.answers = ['sEp2JV1nbHeS1fe8', 'CMAFoQjhz41lkPmb', '7auWIOSgXeY2qYSQ'];
  }

  result(index) {
    return this.answers[index];
  }

  getCounter() {
    return this.counter;
  }

  generate() {
    this.counter++;
    return this.answers[this.counter - 1];
  }
}

const defaultServices = {
  _jwt: {},
  pool: {},
  axios: {},
  redis: {},
  bcrypt: {},
  hashids: {},
  teamManager: {},
  mailManager: {},
  randomstring: {},
  googleClient: {},
};

describe('accountManager unit tests', () => {
  it('generates valid userHash', async () => {
    const randomstring = new DeterministicRandomString();

    const services = {
      ...defaultServices,
      redis: {
        exists: (userHash) => (userHash === randomstring.result(1) ? 1 : 0),
      },
      randomstring,
    };

    const accountManager = new AccountManager(services, {});

    // girst userHash should be normal and valid
    expect(await accountManager.generateUserHash()).to.eql(randomstring.result(0));
    // generate userHash, see that it exists, then generate new userHash
    expect(await accountManager.generateUserHash()).to.eql(randomstring.result(2));
    expect(randomstring.getCounter()).to.be.eq(3);
  });

  it('handles userHash redis error', async () => {
    const services = {
      ...defaultServices,
      redis: {
        exists: () => {
          throw new Error('fail');
        },
      },
      randomstring: new DeterministicRandomString(),
    };

    const accountManager = new AccountManager(services, {});
    expect(accountManager.generateUserHash()).to.eventually.be.rejectedWith('fail');
  });

  it('creates session', async () => {
    const randomstring = new DeterministicRandomString();
    const HASH = randomstring.result(0);
    const SECRET = randomstring.result(1);

    const redisStore = {};
    const services = {
      ...defaultServices,
      randomstring,
      redis: {
        exists: () => false,
        set: (key, value, a, b) => {
          redisStore[key] = {
            value,
            a,
            b,
          };
        },
      },
      _jwt,
    };

    const accountManager = new AccountManager(services, {});

    const userObject = {
      creator_id: mockAccount.id,
      name: mockAccount.name,
      email: mockAccount.email,
      admin: mockAccount.admin,
    };

    const signedToken = _jwt.sign(userObject, SECRET);

    const { token, userHash, user } = await accountManager.createSession(mockAccount);

    expect(redisStore[HASH])
      .to.be.an('object')
      .that.deep.equals({
        value: SECRET,
        a: 'EX',
        b: AccountManager.CONSTANTS.ONE_WEEK_SEC,
      });

    expect(token).to.be.eq(signedToken);
    expect(userHash).to.be.eq(HASH);
    expect(user).to.deep.equals(mockAccount);
    expect(randomstring.getCounter()).to.be.eq(2);
  });

  it('returns undefined amazon token', async () => {
    const services = {
      ...defaultServices,
      redis: {
        get: () => null,
      },
    };

    const accountManager = new AccountManager(services, {});
    expect(await accountManager.defaultServices).to.eq(undefined);
  });

  it('fetches and refreshes amazon token', async () => {
    const requests = [];
    const redisStore = {};

    const services = {
      ...defaultServices,
      redis: {
        set: (key, value) => {
          redisStore[key] = value;
        },
        get: (key) => redisStore[key],
      },
      axios: {
        post: (url, data) => {
          requests.push({
            url,
            data,
          });
          return {
            data: {
              expire: 0,
              access_token: 'ACCESS_TOKEN_1',
              refresh_token: 'REFRESH_TOKEN_1',
            },
          };
        },
      },
    };

    redisStore[`${AccountManager.CONSTANTS.AMAZON_TOKEN_PREFIX}1`] = JSON.stringify({
      access_token: 'ACCESS_TOKEN',
      refresh_token: 'REFRESH_TOKEN',
      expire: Date.now() + 1000,
    });

    const accountManager = new AccountManager(services, {});

    // should be able to consistently fetch access token
    expect(await accountManager.AmazonAccessToken(1)).to.eq('ACCESS_TOKEN');
    expect(await accountManager.AmazonAccessToken(1)).to.eq('ACCESS_TOKEN');

    redisStore[`${AccountManager.CONSTANTS.AMAZON_TOKEN_PREFIX}1`] = JSON.stringify({
      access_token: 'ACCESS_TOKEN',
      refresh_token: 'REFRESH_TOKEN',
      expire: Date.now() - 1000,
    });
    expect(await accountManager.AmazonAccessToken(1)).to.eq('ACCESS_TOKEN_1');
  });
});
